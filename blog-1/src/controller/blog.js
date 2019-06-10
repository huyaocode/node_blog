const { exec } = require('../db/mysql')

const getList = (author, keywords) => {
  // 加一个 1=1 来占个位，为了让语法正确，方便添加条件
  let sql = `select * from blogs where 1=1 `
  if (author) {
    sql += `and author='${author}' `
  }
  if (keywords) {
    sql += `and title like '%${keywords}%'`
  }
  sql += `order by createtime desc`
  // 返回 promise
  return exec(sql)
}

const getDetail = id => {
  const sql = `select * from blogs where id='${id}';`
  // 返回的是一个数组，我们只取也只能取第一个
  return exec(sql).then(rows => {
    return rows[0]
  })
}

const newBlog = (blogData = {}) => {
  // blogData 是一个博客对象，包含title content author属性
  const {title, content, author} = blogData
  const createTime = Date.now();
  
  const sql = `
    insert into blogs (title, content, createtime, author)
    values ('${title}', '${content}', ${createTime}, '${author}');
  `
  // 返回的是一个数据结构
  return exec(sql).then(insertData => {
    return {
      id: insertData.insertId
    }
  })
}

const updateBlog = (id, blogData = {}) => {
  const {title, content} = blogData;
  const sql = `
    update blogs 
    set title='${title}', content='${content}'
    where id='${id}';
  `;

  return exec(sql).then(updateData => {
    if(updateData.affectedRows > 0) {
      return true
    }
    return false
  })
}

const deleteBlog = (id, author) => {
  const sql = `delete from blogs where id='${id}' and author='${author}';`;
  return exec(sql).then(delData => {
    if(delData.affectedRows > 0) {
      return true
    }
    return false
  })
}

module.exports = {
  getList,
  getDetail,
  newBlog,
  updateBlog,
  deleteBlog
}
