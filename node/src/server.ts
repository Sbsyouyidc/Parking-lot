import { connection } from './utils'
import fs from 'fs'
import path from 'path'
import request from 'request'
import dayjs from 'dayjs'

import { getFileContentAsBase64, isExistence } from './utils'
interface IData {
  [key: string]: string
}
;[]

export default {
  recognition: async (req: any, res: any) => {
    const { licensePlate, imagePath } = req.body
    const image = getFileContentAsBase64(path.join(__dirname, '../public/images', imagePath))
    const options = {
      method: 'POST',
      url: 'https://aip.baidubce.com/rest/2.0/ocr/v1/license_plate?access_token=24.d4b8277a543061c7899826015549c5e4.2592000.1680698095.282335-30317694',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Accept: 'application/json'
      },
      form: {
        image
      }
    }
    request(options, async (error, response) => {
      if (error) throw new Error(error)
      const { number } = JSON.parse(response.body).words_result
      if (number == licensePlate) {
        const boolean = await isExistence(licensePlate)
        ;(boolean &&
          res.send({
            code: 200,
            message: '已存在车牌',
            res: false
          })) ||
          connection.query(
            `INSERT INTO card(LicensePlate,image ) VALUES ('${licensePlate}', '${imagePath}')`,
            (err: any, results: IData) => {
              if (err) throw new Error(err)
              res.send({
                code: 200,
                message: '注册成功',
                res: true
              })
            }
          )
      } else {
        res.send({
          code: 200,
          message: '车牌识别不匹配',
          res: false
        })
      }
    })
  },

  //上传
  upload: (req: any, res: any) => {
    const { originalname, path: filePath, destination } = req.file
    const newName = `${destination}\\${originalname}`
    fs.rename(filePath, newName, (err: any) => {
      if (err) {
        throw new Error(err)
      }
    })
    res.send({
      code: 200,
      path: `/${originalname}`
    })
  },

  //登录
  login: async (req: any, res: any) => {
    const { licensePlate } = req.body
    console.log(licensePlate)
    const boolean = await isExistence(licensePlate)
    console.log(boolean)
    ;(boolean &&
      res.send({
        code: 200,
        message: '登陆成功',
        res: true
      })) ||
      res.send({
        code: 200,
        message: '车牌未存在；请先注册，绑定车牌',
        res: false
      })
  },

  //车位信息
  parkingSpace: (req: any, res: any) => {
    connection.execute('SELECT * FROM parkingSpace LIMIT 0,1000', (err: any, results: IData) => {
      if (err) throw new Error(err)
      res.send(results)
    })
  }
}
