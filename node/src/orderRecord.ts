import { connection } from './utils'
import fs from 'fs'
import path from 'path'
import request from 'request'
import dayjs from 'dayjs'
import duration from 'dayjs/plugin/duration'
import { isExistence, Duration, IData } from './utils'

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
      Object[key].item.forEach(
        (element: { id: any; StartClock: any; EndClock: any; HourlyCharge: any }) => {
          console.log(element)
          const { id, StartClock, EndClock, HourlyCharge } = element
          connection.execute(
            `INSERT INTO charge_standard(id, type, StartClock, EndClock, HourlyCharge) VALUES ('${id}', '${key}', '${StartClock}', '${EndClock}', '${HourlyCharge}')`
          )
        }
      )
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
  getAddOrder: (req: any, res: any) => {
    const { type } = req.query
    connection.execute(
      `INSERT INTO charge_standard(type) VALUES ('${type}')`,
      (err: any, result: IData) => {
        if (err) throw new Error(err)
        const { insertId } = result
        connection.execute(
          `SELECT * FROM charge_standard  WHERE id = '${insertId}'`,
          (err, result) => {
            if (err) throw new Error(err)
            res.send({ res: true, result })
          }
        )
      }
    )
  }
}
