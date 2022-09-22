import { Message } from 'element-ui'

export function errorMsg(msg) {
  Message.error({
    message: msg,
    duration: 0,
    showClose: true,
  })
}

export function successMsg(msg) {
  Message.success({
    message: msg,
    duration: 3600,
  })
}

export function infoMsg(msg) {
  Message.info({
    message: msg,
    duration: 2700,
    showClose: true,
  })
}
