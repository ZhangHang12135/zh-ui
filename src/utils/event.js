/**
 * @description 通用事件绑定，以及事件卸载
 * 这里的话，我就不像iview,去监听是否是服务端实例了
 */

/**
 * @description 事件绑定 ，仅提供冒泡阶段
 */
export const on = (function () {
  if (document.addEventListener) {
    return function (element, event, handler) {
      if (element && event && handler) {
        element.addEventListener(event, handler, false)
      }
    }
  } else {
    return function (element, event, handler) {
      if (element && event && handler) {
        element.attachEvent('on' + event, handler)
      }
    }
  }
})()

/**
 * @description 事件卸载
 */
export const off = (function () {
  if (document.removeEventListener) {
    return function (element, event, handler) {
      if (element && event && handler) {
        element.removeEventListener(event, handler, false)
      }
    }
  } else {
    return function (element, event, handler) {
      if (element && event && handler) {
        element.detachEvent('on' + event, handler)
      }
    }
  }
})()
