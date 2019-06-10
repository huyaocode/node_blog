# blog-1 
使用纯NodeJS 来打造一个博客
```
│  app.js
│  package.json
│  README.md
│
├─bin
│      www.js
│
└─src
    ├─controller
    │      blog.js
    │
    ├─model
    │      resModel.js
    │
    └─router
            blog.js
            user.js
```

将业务拆分为4个模块

 - www.js
   - server逻辑做配置，如端口
 - app.js
   - 系统基本设置
 - router
   - 处理路由
 - controller
   - 仅关心数据