import { connection } from './utils'
import fs from 'fs'
import path from 'path'
import request from 'request'
import dayjs from 'dayjs'
import duration from 'dayjs/plugin/duration'
import { getFileContentAsBase64, isExistence, Duration, IData, Price } from './utils'

dayjs.extend(duration)

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
        const boolean = await isExistence('card', 'licensePlate', licensePlate)
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
    const boolean = await isExistence('card', 'licensePlate', licensePlate)
    ;(boolean &&
      res.send({
        code: 200,
        message: '登陆成功',
        res: true,
        licensePlate
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
  },

  VehicleSelection: async (req: any, res: any) => {
    const time = dayjs().format('YYYY-MM-DD HH:mm:ss')

    const { plate } = req.body
    const { id } = req.params
    const boolean = await isExistence('parkingspace', 'parkingPlate', plate)
    ;(boolean &&
      res.send({
        code: 200,
        message: '车辆已停放',
        res: false
      })) ||
      connection.query(
        `UPDATE parkingspace SET ParkingPlate = '${plate}' , StartParkingTime = '${time}' WHERE id = '${id}'`,
        (err: any, results: IData) => {
          if (err) throw new Error(err)
          res.send({
            code: 200,
            message: '入场成功',
            res: true
          })
        }
      )
  },

  VehicleDuration: async (req: any, res: any) => {
    const { number } = req.query
    connection.query(
      `SELECT * FROM parkingspace where number = '${number}'`,
      (err: any, results: IData[]) => {
        if (err) throw new Error(err)
        const { StartParkingTime, type } = results[0]
        const end = dayjs().format('YYYY-MM-DD HH:mm:ss')
        const start = dayjs(StartParkingTime).format('YYYY-MM-DD HH:mm:ss')
        const duration = Duration(dayjs(end).diff(dayjs(start)))
        res.send({ res: true, duration, end, start, number, type })
      }
    )
  },

  VehicleDeparture: async (req: any, res: any) => {
    const { number } = req.params
    const { plate, type } = req.body
    //将停车场的车牌变为null
    const boolean = await new Promise<boolean>((resolve, reject) => {
      connection.query(
        `UPDATE parkingspace SET ParkingPlate = null WHERE number = '${number}'`,
        (err: any, results: IData) => {
          if (err) reject(err)
          resolve(true)
        }
      )
    })
    if (boolean) {
      //清零将开始时间和结束时间取出
      connection.query(
        `SELECT * FROM parkingspace where number = '${number}'`,
        async (err: any, results: IData[]) => {
          if (err) throw new Error(err)
          const { number, StartParkingTime, EndParkingTime } = results[0]
          const end = dayjs(EndParkingTime).format('YYYY-MM-DD HH:mm:ss')
          const start = dayjs(StartParkingTime).format('YYYY-MM-DD HH:mm:ss')
          const duration = Duration(dayjs(EndParkingTime).diff(dayjs(StartParkingTime)))
          const price = await Price(dayjs(EndParkingTime).diff(dayjs(StartParkingTime)), type)

          //将信息存入订单表
          connection.query(
            `INSERT INTO priceorder (LicensePlate, number, Price, StartParkingTime, EndParkingTime,conditionTime) VALUES ('${plate}', '${number}', '${price}', '${start}', '${end}','${end}')`,
            (err: any, results: any) => {
              if (err) throw new Error(err)
              res.send({ res: true, message: '离场成功', duration, end, start, number, price })
            }
          )
        }
      )
    }
  },

  //保存车位信息
  postSaveParking: (req: any, res: any) => {
    const { params } = req.body
    const array = JSON.parse(params)

    array.forEach(
      async (item: { id: any; number?: any; status?: any; type?: any; coordinates?: any }) => {
        const { id, number, status, type, coordinates } = item
        const boolean = await isExistence('parkingspace', 'id', id)
        const objStr = JSON.stringify(coordinates)
        if (boolean) {

          connection.execute(
            `UPDATE parkingspace SET number = '${number}', status = '${status}', type = '${type}' ,coordinates = '${objStr}' WHERE id = ${id}`,
            (err) => {
              if (err) throw new Error(err)
            }
          )
        } else {
          const time = dayjs().format('YYYY-MM-DD HH:mm:ss')
          connection.execute(
            `INSERT INTO parkingspace(id, number,status, type ,coordinates, creationTime) VALUES (${id}, '${number}', '${status}', '${type}','${objStr}','${time}')`,
            (err) => {
              if (err) throw new Error(err)
            }
          )
        }
      }
    )
    res.send({
      res: true,
      message: '保存成功'
    })
  }
}
