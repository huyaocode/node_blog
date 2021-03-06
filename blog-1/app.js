const querystring = require('querystring')
const handleBlogRouter = require('./src/router/blog')
const handleUserRouter = require('./src/router/user')
const { get_redis, set_redis } = require('./src/db/redis')
const { access } = require('./src/util/log')

// 获取cookie过期时间
const getCookieExpires = () => {
  const d = new Date()
  d.setTime(d.getTime() + 24 * 60 * 60 * 1000)
  //转成这种格式： Wed, 20 Jul 1983 17:15:00 GMT
  return d.toGMTString()
}


// 用于处理Post data
const getPostData = req => {
  const promise = new Promise((resolve, reject) => {
    if (req.method !== 'POST') {
      resolve({})
      return
    }
    if (req.headers['content-type'] !== 'application/json') {
      resolve({})
      return
    }
    let postData = ''
    req.on('data', chunk => {
      postData += chunk
    })
    req.on('end', () => {
      if (!postData) {
        resolve({})
      }
      resolve(JSON.parse(postData))
    })
  })

  return promise
}

/**
 * 处理请求
 * @param {*} req
 * @param {*} res
 */
const serverHandle = (req, res) => {
  // 记录 access log
  access(`${req.method} -- ${req.url} -- ${req.headers['user-agent']} -- ${Date.now()}`)

  // 设置返回格式 JSON
  res.setHeader('Content-type', 'application/json')

  const url = req.url
  // 获取 path
  req.path = url.split('?')[0]

  // 获取 query
  req.query = querystring.parse(url.split('?')[1])

  // 解析 cookie
  req.cookie = {}
  const cookieStr = req.headers.cookie || ''
  cookieStr.split(';').forEach(item => {
    if (!item) {
      return
    }
    const arr = item.split('=')
    const key = arr[0].trim()
    const val = arr[1].trim()
    req.cookie[key] = val
  })

  // 解析 session （使用redis）
  let needSetCookie = false
  let userId = req.cookie.userid
  if (!userId) {
    needSetCookie = true
    userId = `${Date.now()}_${Math.random()}`
    // 初始化 redis 中的 session 值
    set_redis(userId, {})
  }

  // 获取session
  req.sessionId = userId
  get_redis(req.sessionId)
    .then(sessionData => {
      if (sessionData == null) {
        // 初始化 redis 中的 session 值
        set_redis(req.sessionId, {})
        // 设置 session
        req.session = {}
      } else {
        req.session = sessionData
      }
      // console.log('req.session', req.session)

      // 处理 post data
      return getPostData(req)
    })
    .then(postData => {
      req.body = postData

      // 处理 blog 路由
      const blogResult = handleBlogRouter(req, res)
      if (blogResult) {
        blogResult.then(blogData => {
          if (needSetCookie) {
            res.setHeader(
              'Set-Cookie',
              `userid=${userId}; path=/; httpOnly; expires=${getCookieExpires()};`
            )
          }
          res.end(JSON.stringify(blogData))
        })
        return
      }

      // 处理 user 路由
      const userResult = handleUserRouter(req, res)
      if (userResult) {
        userResult.then(userData => {
          if (needSetCookie) {
            res.setHeader(
              'Set-Cookie',
              `userid=${userId}; path=/; httpOnly; expires=${getCookieExpires()};`
            )
          }
          res.end(JSON.stringify(userData))
        })
        return
      }

      // 未命中， 返回404
      res.writeHead(404, { 'Content-type': 'text/plain' })
      res.write('404 Not Found')
      res.end()
    })
}

module.exports = serverHandle
