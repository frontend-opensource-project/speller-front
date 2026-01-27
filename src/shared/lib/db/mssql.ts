import sql from 'mssql'

const config: sql.config = {
  server: process.env.DB_SERVER || 'localhost',
  database: process.env.DB_DATABASE || 'master',
  user: process.env.DB_USER || '',
  password: process.env.DB_PASSWORD || '',
  port: parseInt(process.env.DB_PORT || '1433'),
  options: {
    encrypt: false, // 로컬 서버는 암호화 비활성화
    trustServerCertificate: true,
  },
  pool: {
    max: 10,
    min: 0,
    idleTimeoutMillis: 30000,
  },
}

let pool: sql.ConnectionPool | null = null

export async function getConnection(): Promise<sql.ConnectionPool> {
  if (!pool) {
    pool = await new sql.ConnectionPool(config).connect()
  }
  return pool
}

export async function query<T = unknown>(
  queryString: string,
  params?: Record<string, unknown>,
): Promise<T[]> {
  const connection = await getConnection()
  const request = connection.request()

  // 파라미터 바인딩
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      request.input(key, value)
    })
  }

  const result = await request.query(queryString)
  return result.recordset as T[]
}

export async function execute(
  queryString: string,
  params?: Record<string, unknown>,
): Promise<sql.IResult<unknown>> {
  const connection = await getConnection()
  const request = connection.request()

  // 파라미터 바인딩
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      request.input(key, value)
    })
  }

  return await request.query(queryString)
}

export async function closePool(): Promise<void> {
  if (pool) {
    await pool.close()
    pool = null
  }
}

export { sql }
