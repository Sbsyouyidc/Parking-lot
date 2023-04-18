import service from 'mysql2'
import fs from 'fs'
import dayjs from 'dayjs'
import path from 'path'
import request from 'request'
import duration from 'dayjs/plugin/duration'

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
            if (Remaining >= 1) {
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

export const PriceDetail = (duration: number, type: string) => {
  return new Promise<number>((resolve, reject) => {
    let Remaining = Math.floor(dayjs.duration(duration).asSeconds() as any)
    const old_r = Remaining
    if (Remaining < 1) {
      resolve(0)
    } else {
      connection.execute(
        `SELECT * FROM charge_standard WHERE  type = '${type}'`,
        (err, results) => {
          if (err) throw new Error(err)
          const res = results.reduce(
            (right, left) => {
              const { StartClock, EndClock, HourlyCharge } = left
              const obj = {
                StartClock
              }
              if (Remaining >= 1) {
                if (EndClock == '以后') {
                  return (right = [
                    ...right,
                    Object.assign(obj, {
                      settlement: Remaining + '*' + HourlyCharge,
                      EndClock: old_r
                    })
                  ])
                } else {
                  const interval = EndClock - StartClock
                  if (interval > Remaining) {
                    const tiem = Remaining
                    Remaining = 0
                    return (right = [
                      ...right,
                      Object.assign(obj, {
                        EndClock,
                        settlement: tiem + '*' + HourlyCharge
                      })
                    ])
                  } else {
                    Remaining -= interval
                    return (right = [
                      ...right,
                      Object.assign(obj, {
                        EndClock,
                        settlement: interval + '*' + HourlyCharge
                      })
                    ])
                  }
                }
              } else {
                return right
              }
            },
            [{ Remaining: duration }]
          )
          resolve(res)
        }
      )
    }
  })
}
const getAccessToken = () => {
  const options = {
    method: 'POST',
    url:
      'https://aip.baidubce.com/oauth/2.0/token?grant_type=client_credentials&client_id=' +
      'LdqGQkY1foQt4ijSLHTU1ZMW' +
      '&client_secret=' +
      'vvwm6PAD2NHrYh9r14EryGacgjwGans6'
  }
  return new Promise((resolve, reject) => {
    request(options, (error, response) => {
      if (error) {
        reject(error)
      } else {
        resolve(JSON.parse(response.body).access_token)
      }
    })
  })
}

export const recognition = async (imagePath: string) => {
  const image = getFileContentAsBase64(path.join(__dirname, '../public/images', imagePath))
  const options = {
    method: 'POST',
    url:
      'https://aip.baidubce.com/rest/2.0/ocr/v1/license_plate?access_token=' +
      (await getAccessToken()),
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Accept: 'application/json'
    },
    form: {
      image
    }
  }
  return new Promise<any>((resolve, reject) => {
    request(options, async (error, response) => {
      if (error) throw new Error(error)
      const object = JSON.parse(response.body)
      console.log(object)
      if (object.words_result) {
        const { number } = object.words_result

        const boolean = await isExistence('user', 'licensePlate', number)
        ;(boolean && reject('车牌已存在')) || resolve(number)
      } else {
        reject('未识别到车牌')
      }
    })
  })
}
