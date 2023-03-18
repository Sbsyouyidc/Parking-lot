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
