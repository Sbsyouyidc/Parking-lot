import { connection } from './utils'
import fs from 'fs'
import path from 'path'
import request from 'request'
import { getFileContentAsBase64 } from './utils'
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
    request(options, (error, response) => {
      if (error) throw new Error(error)
      const { number } = JSON.parse(response.body).words_result
      if (number == licensePlate) {
        connection.query(
          `INSERT INTO card(image, LicensePlate) VALUES ('${licensePlate}', '${imagePath}')`,
          (err: any, results: IData) => {
            if (err) throw new Error(err)
            res.send({
              code: 200,
              res: true
            })
          }
        )
      } else {
        res.send({
          code: 200,
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
  }
}
