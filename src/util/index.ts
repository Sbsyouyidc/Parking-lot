import duration from 'dayjs/plugin/duration'
import dayjs from 'dayjs'
import mitt from 'mitt'

dayjs.extend(duration)

export const Duration = (duration: number) => {
  const time = dayjs.duration(duration)
  if (time.asDays() >= 1) {
    return (
      time.days() + '天' + time.hours() + '小时' + time.minutes() + '分钟' + time.seconds() + '秒'
    )
  }
  if (time.asHours() >= 1) {
    return time.hours() + '小时' + time.minutes() + '分钟' + time.seconds() + '秒'
  }
  if (time.asMinutes() >= 1) {
    return time.minutes() + '分钟' + time.seconds() + '秒'
  }
  if (time.asSeconds() >= 1) {
    return time.seconds() + '秒'
  }
}

export const debounce = (func: () => void, wait: number) => {
  let timer: NodeJS.Timeout | null = null
  return function () {
    if (timer) {
      clearTimeout(timer)
      timer = null
    }
    timer = setTimeout(() => {
      func()
    }, wait)
  }
}

export const throttle = (func: () => void, wait: number) => {
  let lastTime = 0
  return function () {
    const nowTime = new Date().getTime()
    // cd剩余时间
    // 如果剩余时间大于间隔时间，也就是说可以再次执行函数
    if (nowTime - lastTime >= wait) {
      func()
      // 将上一次函数执行的时间设置为nowTime，这样下次才能重新进入cd
      lastTime = nowTime
    }
  }
}

export const file = (image: string) => {
  const blob = dataURLtoFile(image, 'image/jpeg')
  console.log(blob)

  const fileOfBlob = new File([blob], dayjs().format('YYYYMMDDHHmmss') + '.jpg')
  const data = new FormData()
  console.log(fileOfBlob)

  data.append('file', fileOfBlob)
  return data
}
const dataURLtoFile = (dataURI: string, type: string) => {
  const binary = atob(dataURI.split(',')[1])
  const array = []
  for (let i = 0; i < binary.length; i++) {
    array.push(binary.charCodeAt(i))
  }
  return new Blob([new Uint8Array(array)], { type: type })
}

export const emitter = mitt()

export const spaceType: { [key: string]: string } = {
  parked: '停放',
  appointment: '预约',
  true: '可使用'
}
