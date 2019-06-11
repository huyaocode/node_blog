const { exec, escape } = require('../db/mysql')
const {genPassword} = require('../util/cryp')


const login = (username, password) => {
  username = escape(username)
  password = genPassword(password)
  password = escape(password)
  const sql = `
    select realname, username
    from users 
    where username=${username} and password=${password}
  `
  return exec(sql).then(rows => {
    return rows[0] || {}
  })
}

module.exports = {
  login
}