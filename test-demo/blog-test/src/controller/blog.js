const getList = (author, keywords) => {
  return [
    {
      id: 1,
      title: '标题 1',
      createTime: 123412341234,
      author: '张三'
    },
    {
      id: 2,
      title: '标题 2',
      createTime: 2222222222222,
      author: '李四'
    }
  ]
}

const getDetail = id => {
  return {
    id: 1,
    title: '标题 1',
    createTime: 123412341234,
    author: '张三',
    content: '司搭街坊拉萨的JFK了解阿瑟东'
  }
}

const newBlog = (blogData = {}) => {
  // blogData 是一个博客对象，包含title content 属性
  console.log('new Blog: ', blogData)
  return {
    id: 3
  }
}

const updateBlog = (id, blogData = {}) => {
  console.log('update blog: ', id, blogData)
  return true;
}

const deleteBlog = id => {
  console.log('delete blog: ', id)
  return true;
}

module.exports = {
  getList,
  getDetail,
  newBlog,
  updateBlog,
  deleteBlog
}
