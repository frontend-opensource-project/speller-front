#!/bin/bash

ENVIRONMENT=${1:-"staging"}

# Exit on error
set -e

BASE_DIR=$BASE_DIR

# Load NVM environment
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"

if [[ "$ENVIRONMENT" == "production" ]]; then
  BRANCH="main"
  APP_PORT="4000"
  PM2_NAME="speller-front"
  ENV_FILE=".env.production"
  NODE_ENV="production"
else
  # BRANCH="deploy"
  BRANCH="main" # MVP 이후에 production/staging 환경 분리
  APP_PORT="3000"
  PM2_NAME="speller-front-staging"
  ENV_FILE=".env.staging"
  NODE_ENV="development"
fi

# Log file setup
LOG_FILE="${BASE_DIR}/deploy-${ENVIRONMENT}.log"
TIMESTAMP=$(date +"%Y-%m-%d %H:%M:%S")

log_cmd() {
  echo "[${TIMESTAMP}] Running: $1" >> "${LOG_FILE}"
  OUTPUT=$(eval "$1" 2>&1) || {
    EXIT_CODE=$?
    echo "[${TIMESTAMP}] ERROR (Exit code: ${EXIT_CODE}): Command failed" >> "${LOG_FILE}"
    echo "${OUTPUT}" >> "${LOG_FILE}"
    echo "[${TIMESTAMP}] ERROR: $1 failed with exit code ${EXIT_CODE}" >&2
    echo "${OUTPUT}" >&2
    return ${EXIT_CODE}
  }
  echo "${OUTPUT}" >> "${LOG_FILE}"
  echo "${OUTPUT}"
}

log() {
  echo "[${TIMESTAMP}] $1" | tee -a "${LOG_FILE}"
}

log "${ENVIRONMENT^} deployment started: ${TIMESTAMP}"
log "Using configuration: Branch=${BRANCH}, Port=${APP_PORT}, PM2=${PM2_NAME}"

# Change to project directory
log "Changing to project directory: ${BASE_DIR}"
cd $BASE_DIR || {
  log "ERROR: Cannot change to project directory"
  exit 1
}

log "Checking out ${BRANCH} branch"
log_cmd "git checkout ${BRANCH}"

log "Fetching latest code from Git repository"
log_cmd "git fetch origin"

log "Resetting all local changes (hard reset to origin/${BRANCH})"
log_cmd "git reset --hard origin/${BRANCH}"

log "Cleaning untracked files and directories"
log_cmd "git clean -fdx --exclude=.env.*"

# Switch to the Node version pinned in .nvmrc
# (nvm use must run in this shell, so it is not wrapped with log_cmd)
PM2_VERSION=$(pm2 -v 2>/dev/null | tail -1)
log "Switching to Node $(cat .nvmrc) from .nvmrc"
log_cmd "nvm install"
nvm use > /dev/null

# pm2 is a global package, so each Node version needs its own install
if ! command -v pm2 > /dev/null; then
  log "Installing pm2@${PM2_VERSION:-latest} for Node $(node -v)"
  log_cmd "npm install -g pm2@${PM2_VERSION:-latest}"
fi

log "Node version: $(node -v), NPM version: $(npm -v)"

# Check environment variables
if [ ! -f ${ENV_FILE} ]; then
  log "ERROR: ${ENV_FILE} file not found. Please create the environment file manually."
  exit 1
fi

# Copy env to .env.local
log "Copying environment file"
log_cmd "cp ${ENV_FILE} .env.local"

# Install dependencies
log "Installing dependencies with NPM"
log_cmd "npm ci"

# Build application
log "Building Next.js application"
log_cmd "npm run build"

# Start or restart with PM2
log "Starting/restarting application with PM2"
# npm path the existing process was registered with (empty if not registered).
# pm2 restart keeps this path, so the Node version only changes by re-registering.
PM2_EXEC_PATH=$(pm2 jlist 2>/dev/null | node -e '
  let s = ""
  process.stdin.on("data", d => (s += d)).on("end", () => {
    try {
      const app = JSON.parse(s.slice(s.indexOf("["))).find(p => p.name === process.argv[1])
      console.log(app ? app.pm2_env.pm_exec_path : "")
    } catch {
      console.log("")
    }
  })' "${PM2_NAME}")

if [[ -z "${PM2_EXEC_PATH}" ]]; then
  log "Starting new PM2 process"
  log_cmd "pm2 start npm --name '${PM2_NAME}' -- run start -- -p ${APP_PORT}"
elif [[ "${PM2_EXEC_PATH}" != "$(command -v npm)" ]]; then
  log "Node version changed (${PM2_EXEC_PATH} -> $(command -v npm)), re-registering PM2 process"
  log_cmd "pm2 delete ${PM2_NAME}"
  log_cmd "pm2 start npm --name '${PM2_NAME}' -- run start -- -p ${APP_PORT}"
else
  log "Restarting existing PM2 process"
  log_cmd "pm2 restart ${PM2_NAME} --update-env" || {
    log "WARNING: PM2 restart failed, attempting to start new process"
    log_cmd "pm2 start npm --name '${PM2_NAME}' -- run start -- -p ${APP_PORT}"
  }
fi
log_cmd "pm2 save"

# The PM2 daemon keeps running on the Node it was started with.
# pm2 update restarts every app on the server, so it is left as a manual step.
PM2_DAEMON_NODE=$(readlink "/proc/$(cat "$HOME/.pm2/pm2.pid" 2>/dev/null)/exe" 2>/dev/null || true)
if [[ -n "${PM2_DAEMON_NODE}" && "${PM2_DAEMON_NODE}" != "$(command -v node)" ]]; then
  log "WARNING: PM2 daemon runs on ${PM2_DAEMON_NODE}. Run 'pm2 update' to move it to $(command -v node)"
fi

log "${ENVIRONMENT^} deployment completed: $(date +"%Y-%m-%d %H:%M:%S")"