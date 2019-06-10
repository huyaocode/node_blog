const {
  getList,
  getDetail,
  newBlog,
  updateBlog,
  deleteBlog
} = require('../controller/blog')
const { SuccessModel, ErrorModel } = require('../model/resModel')

const handleBlogRouter = (req, res) => {
  const { method, url, path, query } = req
  const id = query.id
  // 获取博客列表
  if (method === 'GET' && path === '/api/blog/list') {
    const author = query.author || ''
    const keyword = query.keyword || ''
    const listData = getList(author, keyword)

    return new SuccessModel(listData)
  }

  // 获取博客详情
  if (method === 'GET' && path === '/api/blog/detail') {
    const data = getDetail(id)
    return new SuccessModel(data)
  }

  // 新建博客
  if (method === 'POST' && path === '/api/blog/new') {
    const data = newBlog(req.body)
    return new SuccessModel(data)
  }

  // 更新博客
  if (method === 'POST' && path === '/api/blog/update') {
    const result = updateBlog(id, req.body)
    if (result) {
      return new SuccessModel(result)
    } else {
      return new ErrorModel('更新失败')
    }
  }

  // 删除博客
  if (method === 'POST' && path === '/api/blog/del') {
    const result = deleteBlog(id)
    if (result) {
      return new SuccessModel(result)
    } else {
      return new ErrorModel('删除失败')
    }
  }
}

module.exports = handleBlogRouter
