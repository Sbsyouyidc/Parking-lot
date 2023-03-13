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
    console.log(req.query)

    const { id = '%', number = '%', LicensePlate = '%' } = req.query
    connection.query(
      `SELECT * FROM priceorder where CONCAT(id,LicensePlate,number) LIKE  CONCAT('${id}','${LicensePlate}','${number}')`,
      (err: any, results: IData[]) => {
        if (err) throw new Error(err)

        res.send(results)
      }
    )
  }
}
