# MySQL基础操作

## SQL操作

### 登录mysql 
```
mysql -u root -p
再输入密码
```

### 键选择
使用`MySQL Workbench`工具辅助建表

mysql workbench建表时的一些选项
 - PK: primary key (column is part of a pk) 主键
 - NN: not null (column is nullable) 非空
 - UQ: unique (column is part of a unique key) 唯一
 - AI: auto increment (the column is auto incremented when rows are inserted) 自增
 - BIN: binary (if dt is a blob or similar, this indicates that is binary data, rather than text) 二进制(比text更大的二进制数据)
 - UN: unsigned (for integer types, see docs: “10.2. Numeric Types”) 整数
 - ZF: zero fill (rather a display related flag, see docs: “10.2. Numeric Types”)值中最有意义的字节总为0，并且不保存。


###建表
其中，如果要加一个外键的话，这个外键得不一定是其他表的主键，但必须是唯一性索引。
```sql
CREATE TABLE `myblog`.`users` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `username` VARCHAR(20) NOT NULL,
  `password` VARCHAR(20) NOT NULL,
  `realname` VARCHAR(20) NOT NULL,
  PRIMARY KEY (`id`)
);
CREATE TABLE `myblog`.`blogs` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `title` VARCHAR(50) NOT NULL,
  `content` LONGTEXT NOT NULL,
  `createtime` BIGINT(20) NOT NULL,
  `author` VARCHAR(20) NOT NULL,
  PRIMARY KEY (`id`)
);
```

###插入
```sql
insert into users(username, `password`, realname) values ('zhangsan', '123', '张三');

insert into blogs
	(title, content, createtime, author)
values
	('标题C', '内容C', 1559564297147, 'lisi');
```

###查询
```sql
-- 查全部
select * from users;
-- 查某些列
select id, username from users;
-- 条件查询
select * from users where username='zhangsan' and `password`='123';
-- 模糊查询
select * from users where username like '%zhang%';
-- 查询结果排序(desc为倒序)
select * from users order by username desc;
```

###更新
```sql
update users 
set realname='李四四' 
where username='lisi';
```
更新时报错：
> Error Code: 1175. You are using safe update mode and you tried to update a table without a WHERE that uses a KEY column To disable safe mode, toggle the option in Preferences -> SQL Queries and reconnect.

在使用mysql执行update的时候，如果不是用主键当where语句，会报如下错误，使用主键用于where语句中正常。

这是因为MySql运行在safe-updates模式下，该模式会导致非主键条件下无法执行update或者delete命令，执行命令`SET SQL_SAFE_UPDATES = 0;`

###删除
```sql
delete from users where username='lisi';
```
但是一般的删除操作都不是真的去把数据删掉，而是把状态改为删除。
```sql
update users set state=0 where username='lisi';
```

## node中使用mysql
```js
const mysql = require('mysql');

// 创建链接对象
const con = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'root',
  port: '3306',
  database: 'myblog'
})

// 开始连接
con.connect()

// 执行SQL语句
const sql = 'select * from users;'
con.query(sql, (err, result) => {
  console.log(result);
})

// 关闭链接
con.end()
```
### 更新
```js
const sql = `update users set realname='李四四' where username='lisi'`
con.query(sql, (err, result) => {
  console.log(result);
})
```

输出结果：
其中`affectedRows`为影响行数，`changedRows`为改变行数， `insertId`为插入时的id。
```json
OkPacket {
  fieldCount: 0,
  affectedRows: 1,
  insertId: 0,
  serverStatus: 34,
  warningCount: 0,
  message: '(Rows matched: 1  Changed: 1  Warnings: 0',
  protocol41: true,
  changedRows: 1 }
```