// 서버 컴포넌트(<head>)에서 import 하므로 React 훅과 분리해 둔다. 구독 훅은 ./install-prompt

/** 설치 이벤트가 바뀌었음을 알리는 window 이벤트 이름 */
export const INSTALL_PROMPT_CHANGE_EVENT = 'installpromptchange'

/**
 * `<head>` 에 인라인으로 넣어 beforeinstallprompt 를 일찍 붙잡아 두는 스크립트.
 *
 * @description
 * 이 이벤트는 React 가 hydration 을 마치기 전에 한 번만 올 수 있어서, 컴포넌트에서 듣기 시작하면 놓친다.
 * preventDefault 로 Chrome 의 하단 설치 배너를 막고, 헤더의 설치 버튼 하나로 설치를 받는다.
 */
export const INSTALL_PROMPT_CAPTURE_SCRIPT = `(function () {
  function notify() { window.dispatchEvent(new Event('${INSTALL_PROMPT_CHANGE_EVENT}')) }
  window.addEventListener('beforeinstallprompt', function (event) {
    event.preventDefault()
    window.__installPrompt = event
    notify()
  })
  window.addEventListener('appinstalled', function () {
    window.__installPrompt = null
    notify()
  })
})()`
