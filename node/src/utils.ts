import service from 'mysql2'
import fs from 'fs'
import duration from 'dayjs/plugin/duration'
import dayjs from 'dayjs'

dayjs.extend(duration)
export const connection = service.createConnection({
  host: 'localhost',
  user: 'root',
  password: '52799454',
  database: 'parkinglot'
})

export interface IData {
  [key: string]: string
}

export const getFileContentAsBase64 = (path: string) => {
  try {
    return fs.readFileSync(path, { encoding: 'base64' })
  } catch (err: any | undefined) {
    throw new Error(err)
  }
}

export const isExistence = (Table: string, Condition: string, id: string) => {
  return new Promise<boolean>((resolve, reject) => {
    connection.execute(
      `SELECT * FROM ${Table} where ${Condition} = '${id}'`,
      (err: any, results: IData[]) => {
        if (err) {
          reject(err)
        } else {
          const res = results.length !== 0 ? true : false
          resolve(res)
        }
      }
    )
  })
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

export const Price = (duration: number, type: string) => {
  return new Promise<number>((resolve, reject) => {
    let Remaining = Math.floor(dayjs.duration(duration).asSeconds() as any)
    if (Remaining < 1) {
      resolve(0)
    } else {
      connection.execute(
        `SELECT * FROM charge_standard WHERE  type = '${type}'`,
        (err, results) => {
          if (err) throw new Error(err)
          const res = results.reduce((right, left) => {
            const { StartClock, EndClock, HourlyCharge } = left
            if (Remaining > 1) {
              if (EndClock == '以后') {
                return (right += Remaining * HourlyCharge)
              } else {
                const interval = EndClock - StartClock
                if (interval > Remaining) {
                  const time = Remaining
                  Remaining = 0
                  return (right += time * HourlyCharge)
                } else {
                  Remaining -= interval
                  return (right += interval * HourlyCharge)
                }
              }
            } else {
              return right
            }
          }, 0)
          resolve(res)
        }
      )
    }
  })
}
