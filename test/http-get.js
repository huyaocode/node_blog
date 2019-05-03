const http = require("http");
const querystring = require("querystring");

const server = http.createServer((req, res) =>{
  let url = req.url;
  let query_obj = querystring.parse(url.split('?')[1]);
  res.end(JSON.stringify(query_obj));
})

server.listen('3000');