import service from 'mysql2'
import fs from 'fs'
export const connection = service.createConnection({
  host: 'localhost',
  user: 'root',
  password: '52799454',
  database: 'parkinglot'
})

type IData = {
  [key: string]: string
}[]

export const getFileContentAsBase64 = (path: string) => {
  try {
    return fs.readFileSync(path, { encoding: 'base64' })
  } catch (err: any | undefined) {
    throw new Error(err)
  }
}

export const isExistence = (id: string) => {
  return new Promise<boolean>((resolve, reject) => {
    connection.execute(
      `SELECT * FROM card where licensePlate = '${id}'`,
      (err: any, results: IData) => {
        if (err) {
          reject(err)
        } else {
          const res = results.length !== 0 ? true : false
          resolve(res)
        }
      }
    )
  })
}
