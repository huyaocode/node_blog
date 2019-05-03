const handleUserRouter = (req, res) => {
  const {method, url, path} = req;

  if(method === 'POST' && path === '/api/user/login') {
    return {
      msg: '登陆'
    }
  }
}

module.exports = handleUserRouter;