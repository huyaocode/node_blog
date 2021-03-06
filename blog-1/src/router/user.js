const { login } = require('../controller/user')
const { SuccessModel, ErrorModel } = require('../model/resModel')
const { set_redis } = require('../db/redis')

const handleUserRouter = (req, res) => {
  const { method, url, path } = req

  if (method === 'POST' && path === '/api/user/login') {
    const { username, password } = req.body
    const result = login(username, password)
    return result.then(data => {
      if (data.realname) {
        // 设置session
        req.session.username = data.username
        req.session.realname = data.realname

        // 同步到 redis中
        set_redis(req.sessionId, req.session)

        return new SuccessModel(data.realname)
      } else {
        return new ErrorModel('登录失败')
      }
    })
  }

  // 登录验证的测试
  if (method === 'GET' && req.path === '/api/user/login-test') {
    if (req.session.username) {
      return Promise.resolve(new SuccessModel({
        session: req.session
      }))
    }
    return Promise.resolve(new ErrorModel('尚未登陆'))
  }
}

module.exports = handleUserRouter
