import { connection } from './utils'
import fs from 'fs'
import path from 'path'

interface IData {
  [key: string]: string
}
;[]

export default {
  recognition: (req: any, res: any) => {
    console.log(req.body)
    res.send({
      code: 200
    })
  },
  upload: (req: any, res: any) => {
    const { originalname, path: filePath, destination } = req.file
    const newName = `${destination}\\${originalname}`
    fs.rename(filePath, newName, (err) => {
      if (err) {
        console.log(err)
      }
    })
    res.send({
      code: 200,
      path: `/static/images/${originalname}`
    })
  }
}
