export const black = {
  selectAll: 'SELECT * FROM black',
  select: 'SELECT * FROM black WHERE licenseplate = ?',
  insert: 'INSERT INTO black SET ?',
  update: 'UPDATE black SET ? WHERE id = ?',
  delete: 'DELETE FROM black WHERE id = ?'
}
export const violation = {
  selectAll: 'SELECT * FROM black',
  select: 'SELECT * FROM black WHERE licenseplate = ?',
  insert: 'INSERT INTO black SET ?',
  update: 'UPDATE black SET ? WHERE id in (?)',
  delete: 'DELETE FROM black WHERE id = ?'
}
export const userInfo = { update: 'UPDATE user SET ? WHERE `Id` = ?' }
