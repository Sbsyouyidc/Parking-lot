import { connection } from './utils'

import dayjs from 'dayjs'
import duration from 'dayjs/plugin/duration'
import { isExistence, IData, PriceDetail } from './utils'

dayjs.extend(duration)

export default {
  getOrderRecord: (req: any, res: any) => {
    connection.query(`SELECT * FROM priceorder`, (err: any, results: IData[]) => {
      if (err) throw new Error(err)

      res.send(results)
    })
  },
  getSearchOrder: (req: any, res: any) => {
    const { id = '%', number = '%', LicensePlate = '%', StartParkingTime = '%' } = req.query
    connection.query(
      `SELECT * FROM priceorder where CONCAT(id,LicensePlate,number,StartParkingTime) LIKE  CONCAT('${id}','${LicensePlate}','${number}','%${StartParkingTime}%')`,
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
          const { id = null, StartClock, EndClock, HourlyCharge } = element
          if (id) {
            connection.execute(
              `UPDATE charge_standard SET StartClock = '${StartClock}', EndClock = '${EndClock}', HourlyCharge = '${HourlyCharge}' WHERE id = '${id}'`
            )
          } else {
            connection.execute(
              `INSERT INTO charge_standard( type, StartClock, EndClock, HourlyCharge) VALUES ( '${key}', '${StartClock}', '${EndClock}', '${HourlyCharge}')`
            )
          }
        }
      )
      connection.execute(`SELECT * FROM charge_standard WHERE type = '${key}'`, (err, results) => {
        if (results.length > length) {
          for (let index = length; index < results.length; index++) {
            connection.execute(`DELETE FROM charge_standard WHERE id = '${results[index].id}'`)
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
        `INSERT INTO charge_standard( type) VALUES ( '${type}')`,
        (err, result) => {
          if (err) throw Error(err)
          res.send({ res: true, message: '新建成功' })
        }
      )
  },
  deleType: (req: any, res: any) => {
    const { type } = req.params
    connection.query(`DELETE FROM charge_standard WHERE type = '${type}'`, (err) => {
      res.send({ res: true, message: '删除成功' })
    })
  },
  //车位查询
  getSearchPark: (req: any, res: any) => {
    const arr = Object.entries(req.query)[0]
    connection.query(
      `SELECT * FROM parkingspace where ${arr[0]} = '${arr[1]}'`,
      (err: any, results: IData[]) => {
        res.send(results)
      }
    )
  },

  //收费详细
  getChargeDetails: (req: any, res: any) => {
    const { id } = req.query
    connection.query(`SELECT * FROM priceorder WHERE id = ${id}`, (err, result_1: any) => {
      const { number, StartParkingTime, EndParkingTime, Price } = result_1[0]
      connection.query(
        `SELECT * FROM parkingspace WHERE number = '${number}'`,
        async (err, result_2: any) => {
          const { type } = result_2[0]
          const PriceDetails = await PriceDetail(
            dayjs(EndParkingTime).diff(dayjs(StartParkingTime)),
            type
          )
          res.send({
            res: true,
            PriceDetails,
            Price
          })
        }
      )
    })
  }
}
