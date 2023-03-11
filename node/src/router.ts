import express from 'express'
// 创建路由对象
const router = express.Router()
import server from './server'
import multer from 'multer'
import path from 'path'
const upload = multer({ dest: path.join(__dirname, '../public/images') })

router.post('/recognition', server.recognition)
router.post('/upload', upload.single('file'), server.upload)
router.post('/login', server.login)
router.get('/parkingSpace', server.parkingSpace)
router.put('/parkingSpace/VehicleSelection/:id', server.VehicleSelection)
router.put('/parkingSpace/VehicleDeparture/:number/:plate', server.VehicleDeparture)
export default router
