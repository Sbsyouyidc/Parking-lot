import fs from 'fs'
import dayjs from 'dayjs'
import duration from 'dayjs/plugin/duration'
import {
  recognition,
  Duration,
  IData,
  Price,
  connection,
  getAccessToken,
  getFileContentAsBase64
} from './utils'
import { monitoring } from './sql'
import request from 'request'
import path from 'path'

dayjs.extend(duration)
const time = dayjs().format('YYYY-MM-DD HH:mm:ss')
 const lastId = (Table: string, Condition: string, id: string) => {
  return new Promise<any>((resolve, reject) => {
    connection.execute(
      `SELECT * FROM ${Table} where ${Condition} = '${id}'`,
      (err: any, results: IData[]) => {
        if (err) {
          reject(err)
        } else {
          const res = results[results.length - 1]
          resolve(res)
        }
      }
    )
  })
}

export default {
  entry: async (req: any, res: any) => {
    const { imagePath } = req.body
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
        if (object.words_result) {
          const { number } = object.words_result
          const obj = await lastId('history', 'plate', number)
          console.log(obj.leaveTime)

          if (obj.leaveTime) {
            const params = {
              plate: number,
              entryImage: imagePath,
              entryTime: time
            }
            connection.query(monitoring.insert, params, (err, result) => {
              res.send({ res: true, message: number })
            })
          } else {
            const params = {
              leaveImage: imagePath,
              leaveTime: time
            }

            connection.query(monitoring.update, [params, obj.id], (err, result) => {
              res.send({ res: true, message: '离开' + number })
            })
          }
        } else {
          res.send({ res: true, message: '未识别' })
        }
      })
    })
  }
}
