import express from 'express'
// 创建路由对象
const router = express.Router()
import server from './server'
import entry from './entry'
import orderRecord from './orderRecord'
import multer from 'multer'
import path from 'path'
const upload = multer({ dest: path.join(__dirname, '../public/images') })

router.post('/upload', upload.single('file'), server.upload)
router.post('/login', server.login)
router.get('/parkingSpace', server.parkingSpace)
//停车
router.put('/parkingSpace/VehicleSelection/:id', server.VehicleSelection)
router.put('/parkingSpace/VehicleDeparture/:plate', server.VehicleDeparture)
router.get('/parkingSpace/VehicleDuration', server.VehicleDuration)
//订单
router.get('/getOrderRecord', orderRecord.getOrderRecord)
router.get('/getSearchOrder', orderRecord.getSearchOrder)
router.post('/postSaveOrder', orderRecord.postSaveOrder)
router.get('/getAllOrder', orderRecord.getAllOrder)
router.post('/postNewType', orderRecord.postNewType)
router.delete('/deleType/:type', orderRecord.deleType)
//车位
router.post('/postSaveParking', server.postSaveParking)
router.get('/getSearchPark', orderRecord.getSearchPark)
//用户
router.get('/getAllUser', server.getAllUser)
router.delete('/deleteUserPlate/:id', server.deleteUserPlate)
router.post('/postNewUser', server.postNewUser)
router.put('/putUpdateUser', server.putUpdateUser)
router.get('/getChargeDetails', orderRecord.getChargeDetails)

router.get('/getAllBlack', server.getAllBlack)
router.delete('/deleteBlack/:id', server.deleteBlack)
router.post('/postBlack', server.postBlack)
router.put('/putBlack', server.putBlack)
router.get('/getBlackPlate', server.getBlackPlate)
router.put('/postBlackProcess', server.postBlackProcess)
router.put('/putUser', server.putUser)

router.post('/postMessage', server.postMessage)
router.get('/getAllMessage', server.getAllMessage)
router.delete('/deleteMessage/:id', server.deleteMessage)

router.post('/entry', entry.entry)
router.get('/getPlateImage', entry.getPlateImage)
router.put('/putForced/:plate', entry.putForced)
router.get('/history', entry.history)

router.get('/getParkingSpace', server.getParkingSpace)
router.get('/getFloor', server.getFloor)
export default router
