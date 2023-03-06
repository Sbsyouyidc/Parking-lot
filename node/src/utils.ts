import service from 'mysql2'
import fs from 'fs'
export const connection = service.createConnection({
  host: 'localhost',
  user: 'root',
  password: '52799454',
  database: 'parkinglot'
})

export const getFileContentAsBase64 = (path: string) => {
  try {
    return fs.readFileSync(path, { encoding: 'base64' })
  } catch (err: any | undefined) {
    throw new Error(err)
  }
}
