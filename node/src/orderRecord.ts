import { connection } from './utils'
import fs from 'fs'
import path from 'path'
import request from 'request'
import dayjs from 'dayjs'
import duration from 'dayjs/plugin/duration'
import { isExistence, Duration, IData } from './utils'
import { type } from 'os'

dayjs.extend(duration)

export default {
  getOrderRecord: (req: any, res: any) => {
    connection.query(`SELECT * FROM priceorder`, (err: any, results: IData[]) => {
      if (err) throw new Error(err)

      res.send(results)
    })
  },
  getSearchOrder: (req: any, res: any) => {
    const { id = '%', number = '%', LicensePlate = '%' } = req.query
    connection.query(
      `SELECT * FROM priceorder where CONCAT(id,LicensePlate,number) LIKE  CONCAT('${id}','${LicensePlate}','${number}')`,
      (err: any, results: IData[]) => {
        if (err) throw new Error(err)

        res.send(results)
      }
    )
  },
  postSaveOrder: (req: any, res: any) => {
    const { params } = req.body
    const Object = JSON.parse(params)
    for (const key in Object) {
      const length = Object[key].group.length
      Object[key].group.forEach(
        async (element: { id: any; StartClock: any; EndClock: any; HourlyCharge: any }) => {
          const { id, StartClock, EndClock, HourlyCharge } = element
          const boolean = await isExistence('charge_standard', 'id', id)
          if (boolean) {
            connection.execute(
              `UPDATE charge_standard SET StartClock = '${StartClock}', EndClock = '${EndClock}', HourlyCharge = '${HourlyCharge}' WHERE id = '${id}'`
            )
          } else {
            connection.execute(
              `INSERT INTO charge_standard(id, type, StartClock, EndClock, HourlyCharge) VALUES ('${id}', '${key}', '${StartClock}', '${EndClock}', '${HourlyCharge}')`
            )
          }
        }
      )
      connection.execute(`SELECT * FROM charge_standard WHERE type = '${key}'`, (err, results) => {
        if (results.length > length) {
          for (let index = length + 1; index <= results.length; index++) {
            connection.execute(`DELETE FROM charge_standard WHERE id = '${index}'`)
          }
        }
      })
    }
    res.send({ code: 200 })
  },
  getAllOrder: (req: any, res: any) => {
    connection.execute(`SELECT * FROM charge_standard `, (err, result) => {
      if (err) throw new Error(err)
      const data = result.reduce((right, left) => {
        if (!right[left.type]) {
          right[left.type] = { group: [] }
        }
        right[left.type].group.push(left)

        return right
      }, {})

      res.send({ res: true, data })
    })
  },
  postNewType: async (req: any, res: any) => {
    const { type } = req.body
    const boolean = await isExistence('charge_standard', 'type', type)
    ;(boolean && res.send({ res: false, message: '已存在类别' })) ||
      connection.execute(
        `INSERT INTO charge_standard(id, type) VALUES (1, '${type}')`,
        (err, result) => {
          if (err) throw Error(err)
          res.send({ res: true, message: '新建成功' })
        }
      )
  },
  deleType: (req: any, res: any) => {
    const { type } = req.params
    console.log(type)

    connection.query(`DELETE FROM charge_standard WHERE type = '${type}'`, (err) => {
      res.send({ res: true, message: '删除成功' })
    })
  }
}
