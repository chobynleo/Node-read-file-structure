// const express = require('/usr/local/node/lib/node_modules/express');
// const iconv = require('/usr/local/node/lib/node_modules/iconv-lite/');
const express = require('express');
const path = require('path');
const routes = require('./src/routes');
const app = express();

// 设置静态文件目录
app.use(express.static(path.join(__dirname, 'public')));
// 路由
routes(app);

const server = app.listen(8080,'0.0.0.0', function () {
    const host = server.address().address;
    const port = server.address().port;
    //console.log(`应用实例，访问地址为 http://${host}:${port}`)
});