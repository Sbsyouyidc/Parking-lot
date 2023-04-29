import fs from 'fs'
import dayjs from 'dayjs'
import duration from 'dayjs/plugin/duration'
import { recognition, isExistence, Duration, IData, Price, connection } from './utils'
import { black, violation, userInfo, message } from './sql'
dayjs.extend(duration)

interface IParking {
  EndParkingTime: string
  ParkingPlate: string
  StartParkingTime: string
  coordinates: { X: number; Y: number }
  id?: number
  number: string
  status: string
  type: string
}
const search = (Table: string, Condition: string, id: string) => {
  return new Promise<any>((resolve, reject) => {
    connection.execute(
      `SELECT * FROM ${Table} where ${Condition} = '${id}'`,
      (err: any, results: IData[]) => {
        const res = results[0]
        resolve(res)
      }
    )
  })
}
const time = dayjs().format('YYYY-MM-DD HH:mm:ss')
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

    connection.query(`SELECT * FROM user WHERE username = '${username}'`, (err, results: any) => {
      if (results[0]) {
        res.send({
          message: '登陆成功',
          res: true,
          arr: results[0]
        })
      } else {
        res.send({
          message: '用户名不存在',
          res: true
        })
      }
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
    const { id } = req.params
    const { plate, status = 'parked', ReservationTime = '' } = req.body
    const time = ReservationTime ? ReservationTime : dayjs().format('YYYY-MM-DD HH:mm:ss')
    const boolean = await isExistence('parkingspace', 'ParkingPlate', plate)
    console.log(boolean, status)
    if (ReservationTime && boolean) {
      res.send({
        code: 200,
        message: '请取消已预约信息，重新预约',
        res: false
      })
    } else {
      connection.query(
        `UPDATE parkingspace SET ParkingPlate = '${plate}',status = '${status}' , StartParkingTime = '${time}' WHERE id = '${id}'`,
        (err: any, results: IData) => {
          if (err) throw new Error(err)
          res.send({
            code: 200,
            message: ReservationTime ? '预约成功' : '入场成功',
            res: true
          })
        }
      )
    }
  },
  //时长
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
    const { plate } = req.params
    const { status } = req.body

    const { type, id } = await search('parkingspace', 'ParkingPlate', plate)
    //将停车场的车牌变为null
    const boolean = await new Promise<boolean>((resolve, reject) => {
      connection.query(
        `UPDATE parkingspace SET ParkingPlate = Null , status = 'true' WHERE ParkingPlate = '${plate}'`,
        (err: any, results: IData) => {
          if (err) reject(err)
          resolve(true)
        }
      )
    })
    if (boolean) {
      //清零将开始时间和结束时间取出
      connection.query(
        `SELECT * FROM parkingspace where id = '${id}'`,
        async (err: any, results: IData[]) => {
          if (err) throw new Error(err)
          const { number, StartParkingTime, EndParkingTime } = results[0]
          console.log(results[0])

          const end = dayjs(EndParkingTime).format('YYYY-MM-DD HH:mm:ss')
          const start = dayjs(StartParkingTime).format('YYYY-MM-DD HH:mm:ss')
          const duration = Duration(dayjs(EndParkingTime).diff(dayjs(StartParkingTime)))
          const price =
            status == 'appointment'
              ? 0
              : await Price(dayjs(EndParkingTime).diff(dayjs(StartParkingTime)), type)

          connection.query(
            `UPDATE parkingspace SET StartParkingTime = Null WHERE number = '${number}'`
          )
          //将信息存入订单表
          connection.query(
            `INSERT INTO priceorder (LicensePlate, number, Price, StartParkingTime, EndParkingTime,conditionTime,status) VALUES ('${plate}', '${number}', '${price}', '${start}', '${end}','${end}','${status}')`,
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
        `INSERT INTO parkingspace( number,status, type ,coordinates) VALUES ( '${item.number}', '${item.status}', '${item.type}','${str}')`,
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
      console.log(err)

      if (err) {
        res.send({ res: false })
      } else {
        res.send({ res: true })
      }
    })
  },
  getBlackPlate: (req: any, res: any) => {
    const { plate } = req.query
    connection.query(black.select, [plate], (err, result) => {
      if (err) {
        res.send({ res: false })
      } else {
        res.send({ res: true, arr: result })
      }
    })
  },
  postBlackProcess: (req: any, res: any) => {
    const { params } = req.body
    const arr = JSON.parse(params)
    connection.query(violation.update, [{ status: 1 }, arr], (err, result) => {
      console.log(result)
      if (err) {
        console.log(err)
        res.send({ res: false })
      } else {
        res.send({ res: true })
      }
    })
  },
  putUser: (req: any, res: any) => {
    const { info, id } = req.body
    connection.query(userInfo.update, [info, id], (err, result) => {
      console.log(result)
      if (err) {
        console.log(err)
        res.send({ res: false })
      } else {
        res.send({ res: true })
      }
    })
  },

  //消息
  postMessage: (req: any, res: any) => {
    const { type, text } = req.body
    const params = {
      type,
      text,
      time
    }
    connection.query(message.insert, [params], (err, result) => {
      console.log(result)
      if (err) {
        console.log(err)
        res.send({ res: false })
      } else {
        res.send({ res: true, message: text })
      }
    })
  },

  getAllMessage: (req: any, res: any) => {
    const params: {
      abnormal: any[]
      Appointment: any[]
    } = {
      abnormal: [],
      Appointment: []
    }
    connection.execute(message.select, ['abnormal'], (err, result: any[]) => {
      params.abnormal = result
      connection.execute(message.select, ['Appointment'], (err, result: any[]) => {
        params.Appointment = result
        res.send({
          res: params
        })
      })
    })
  },

  deleteMessage: (req: any, res: any) => {
    const { id } = req.params
    console.log(req)

    connection.query(message.delete, [id], (err, result) => {
      res.send({
        res: true
      })
    })
  }
}
