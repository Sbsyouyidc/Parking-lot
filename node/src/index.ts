/* eslint-disable no-undef */
import express from 'express'
const app = express()
import path from 'path'
import cors from 'cors'
import router from './router'

app.use(express.urlencoded({ extended: true }))
app.use(cors())
app.use('/static', express.static(path.join(__dirname, '../public')))
app.use('/api', router)

//错误
app.use((err: { message: string }, req: any, res: { send: (arg0: string) => void }, next: any) => {
  res.send('错误' + err.message)
})
app.listen(3000, () => {
  console.log('http://localhost:3000')
})
