import service from 'mysql2'

export const connection = service.createConnection({
  host: 'localhost',
  user: 'root',
  password: '52799454',
  database: 'parkinglot'
})
