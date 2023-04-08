import fs from 'fs'
import dayjs from 'dayjs'
import duration from 'dayjs/plugin/duration'
import { recognition, isExistence, Duration, IData, Price, connection } from './utils'
import { black } from './sql'
dayjs.extend(duration)

interface IParking {
  EndParkingTime: string
  ParkingPlate: string
  StartParkingTime: string
  coordinates: { X: number; Y: number }
  creationTime: string
  id?: number
  number: string
  status: string
  type: string
}
export default {
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
    const { username, password } = req.body
    const boolean = await isExistence('user', 'username', username)
    ;(boolean &&
      connection.query(`SELECT * FROM user WHERE username = '${username}'`, (err, results: any) => {
        res.send({
          message: '登陆成功',
          res: true,
          arr: results[0]
        })
      })) ||
      res.send({
        code: 200,
        message: '用户不存在',
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
    console.log(number)
    const { plate, type } = req.body
    //将停车场的车牌变为null
    const boolean = await new Promise<boolean>((resolve, reject) => {
      connection.query(
        `UPDATE parkingspace SET ParkingPlate = Null WHERE number = '${number}'`,
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
          connection.query(
            `UPDATE parkingspace SET StartParkingTime = Null WHERE number = '${number}'`
          )
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

    const { oldItem, newItem, deletedItem } = JSON.parse(params)
    console.log(oldItem, newItem, deletedItem)

    oldItem.forEach((item: IParking) => {
      const str = JSON.stringify(item.coordinates)
      connection.execute(
        `UPDATE parkingspace SET number = '${item.number}', status = '${item.status}', type = '${item.type}' ,coordinates = '${str}' WHERE id = ${item.id}`,
        (err) => {
          if (err) throw new Error(err)
        }
      )
    })
    newItem.forEach((item: IParking) => {
      const str = JSON.stringify(item.coordinates)
      const time = dayjs().format('YYYY-MM-DD HH:mm:ss')
      connection.execute(
        `INSERT INTO parkingspace( number,status, type ,coordinates, creationTime) VALUES ( '${item.number}', '${item.status}', '${item.type}','${str}','${time}')`,
        (err) => {
          if (err) throw new Error(err)
        }
      )
    })

    deletedItem.forEach((item: IParking) => {
      connection.execute(`DELETE FROM parkingspace WHERE id = ${item.id}`, (err) => {
        if (err) throw new Error(err)
      })
    })

    res.send({
      res: true,
      message: '保存成功'
    })
  },

  //获取用户列表
  getAllUser: (req: any, res: any) => {
    connection.query('SELECT * FROM user', (err: any, result) => {
      if (err) throw new Error(err)
      res.send(result)
    })
  },

  //删除车牌
  deleteUserPlate: (req: any, res: any) => {
    const { id } = req.params
    connection.query(`DELETE FROM user WHERE Id = ${id}`, (err: any, result) => {
      if (err) throw new Error(err)
      res.send({
        res: true,
        message: '删除成功'
      })
    })
  },

  postNewUser: async (req: any, res: any) => {
    const { username, password, type, image = null } = req.body
    const boolean = await isExistence('user', 'username', username)
    if (boolean) {
      res.send({
        res: false,
        message: '用户名已存在'
      })
    } else {
      if (image) {
        try {
          const IdentificationRes = await recognition(image)
          connection.query(
            `INSERT INTO user(username, password, image, type, LicensePlate) VALUES ('${username}', '${password}','${image}', '${type}', '${IdentificationRes}')`,
            (err: any, result) => {
              if (err) throw new Error(err)
              res.send({
                res: true,
                message: IdentificationRes
              })
            }
          )
        } catch (error) {
          res.send({
            res: false,
            message: error
          })
        }
      } else {
        connection.query(
          `INSERT INTO user(username, password,type) VALUES ('${username}', '${password}', '${type}')`,
          (err: any, result) => {
            if (err) throw new Error(err)
            res.send({
              res: true
            })
          }
        )
      }
    }
  },

  putUpdateUser: (req: any, res: any) => {
    const { username, password, type, image: new_image, Id, LicensePlate } = req.body
    if (type == '管理员') {
      connection.query(
        `UPDATE user SET username = '${username}', password = '${password}',type = '${type}' ,image= Null , LicensePlate= Null WHERE Id = ${Id}`,
        (err: any, result) => {
          if (err) throw new Error(err)
          res.send({
            res: true,
            message: '修改成功'
          })
        }
      )
    } else {
      connection.query(`SELECT * FROM user where Id = '${Id}'`, async (err, result: any) => {
        const { image } = result[0]
        try {
          const IdentificationRes =
            image !== new_image ? await recognition(new_image) : LicensePlate
          console.log(IdentificationRes)

          connection.query(
            `UPDATE user SET username = '${username}', password = '${password}',type = '${type}' ,image='${new_image}' , LicensePlate='${IdentificationRes}' WHERE Id = ${Id}`,
            (err: any, result) => {
              if (err) throw new Error(err)
              res.send({
                res: true,
                message: '修改成功'
              })
            }
          )
        } catch (error) {
          res.send({
            res: false,
            message: error
          })
        }
      })
    }
  },

  //黑名单
  getAllBlack: (req: any, res: any) => {
    connection.query(black.selectAll, (err, result) => {
      if (err) {
        res.send({ res: false, result: [] })
      } else {
        res.send({ res: true, result })
      }
    })
  },
  deleteBlack: (req: any, res: any) => {
    const { id } = req.params
    connection.query(black.delete, [id], (err, result) => {
      if (err) {
        res.send({ res: false })
      } else {
        res.send({ res: true })
      }
    })
  },
  postBlack: (req: any, res: any) => {
    const params = req.body
    connection.query(black.insert, [params], (err, result) => {
      if (err) {
        res.send({ res: false })
      } else {
        res.send({ res: true })
      }
    })
  },
  putBlack: (req: any, res: any) => {
    const { id, ...params } = req.body
    console.log(id, params)
    connection.query(black.update, [params, id], (err, result) => {
      if (err) {
        res.send({ res: false })
      } else {
        res.send({ res: true })
      }
    })
  }
}
