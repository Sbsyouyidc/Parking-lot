import duration from 'dayjs/plugin/duration'
import dayjs from 'dayjs'

dayjs.extend(duration)

export const base64 = (file: any, callback: (dataUrl: string) => void) => {
  const reader = new FileReader()
  reader.readAsDataURL(file)
  reader.onload = function (e) {
    const dataUrl = e.target?.result as string
    callback(dataUrl)
  }
}

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
      console.log(lastTime)
    }
  }
}
