/**
 * 바른한글 서비스 워커.
 *
 * 맞춤법 검사는 서버에서만 할 수 있으므로 페이지나 API 응답을 캐시하지 않는다.
 * 하는 일은 하나뿐이다. 페이지 이동이 네트워크 오류로 실패하면 미리 받아 둔 오프라인 안내를 보여 준다.
 * (서버가 돌려준 오류 응답 — 웹방화벽 제한, 404 등 — 은 그대로 통과시킨다)
 *
 * 이 파일을 고치면 CACHE_VERSION 을 올린다. 이전 버전 캐시는 activate 때 지운다.
 */
const CACHE_VERSION = 'v1'
const CACHE_NAME = `speller-offline-${CACHE_VERSION}`

// 등록 시 scope 를 basePath 로 지정하므로, scope 에서 basePath 를 얻는다. (운영: '/', 스테이징: '/test_speller/')
const SCOPE_PATH = new URL(self.registration.scope).pathname
const OFFLINE_URL = `${SCOPE_PATH}offline.html`

// 스테이징은 운영과 같은 도메인의 하위 경로라서, 운영 워커(scope '/')의 범위에 들어간다.
// 운영 워커가 스테이징 페이지에 개입하지 않도록 제외한다.
const EXCLUDED_PATH_PREFIXES = SCOPE_PATH === '/' ? ['/test_speller/'] : []

self.addEventListener('install', event => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then(cache => cache.add(new Request(OFFLINE_URL, { cache: 'reload' })))
      .then(() => self.skipWaiting()),
  )
})

self.addEventListener('activate', event => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys()
      await Promise.all(
        keys
          .filter(
            key => key.startsWith('speller-offline-') && key !== CACHE_NAME,
          )
          .map(key => caches.delete(key)),
      )
      // 워커 기동 시간만큼 페이지 요청이 늦어지지 않도록 기동과 동시에 요청을 보낸다.
      if (self.registration.navigationPreload) {
        await self.registration.navigationPreload.enable()
      }
      await self.clients.claim()
    })(),
  )
})

self.addEventListener('fetch', event => {
  const { request } = event
  if (request.mode !== 'navigate') return

  const { pathname } = new URL(request.url)
  const excluded = EXCLUDED_PATH_PREFIXES.some(prefix =>
    pathname.startsWith(prefix),
  )

  // 제외 경로도 응답은 해야 한다. 그냥 return 하면 navigation preload 로 보낸 요청이 버려지고 같은 요청이 한 번 더 나간다.
  event.respondWith(
    (async () => {
      try {
        const preloaded = await event.preloadResponse
        if (preloaded) return preloaded
        return await fetch(request)
      } catch (error) {
        if (excluded) throw error
        const cached = await caches.match(OFFLINE_URL)
        return cached || Response.error()
      }
    })(),
  )
})
