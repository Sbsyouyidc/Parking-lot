import service from 'mysql2'
import fs from 'fs'
import duration from 'dayjs/plugin/duration'
import dayjs from 'dayjs'
import { json } from 'stream/consumers'

dayjs.extend(duration)
export const connection = service.createConnection({
  host: 'localhost',
  user: 'root',
  password: '52799454',
  database: 'parkinglot'
})

interface IData {
  [key: string]: string
}
interface ID {
  $d: { [key: string]: string }
  $l: string
  $ms: string
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
    return Math.floor(time.asHours()) + '天'
  }
  if (time.asHours() >= 1) {
    return Math.floor(time.asHours()) + '小时'
  }
  if (time.asMinutes() >= 1) {
    return Math.floor(time.asMinutes()) + '分钟'
  }
  if (time.asSeconds() >= 1) {
    return Math.floor(time.asSeconds()) + '秒'
  } else {
    return Math.floor(time.milliseconds()) + '毫秒'
  }
}
