// 获取案例作品左侧导航目录

const express = require('express');
const path = require('path');
const getDocumentDirectoryJson = require('../../models/documents/getDocumentDirectoryJson');
const router = express.Router();


//自己设定查找文件夹路径
const defaultDocDir = path.join(__dirname, '../../../public/documents');

router.get('/',function (req,res) {
    res.writeHead(200, {
        'Content-Type': "Application/json;charset=utf-8",
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers':'Access-Control-Allow-Origin,X-Requested-With',
        'Access-Control-Allow-Methods':'GET',
        'Access-Control-Allow-Credentials':'true',
        'X-Powered-By':' 3.2.1'
    });
    res.write(JSON.stringify(getDocumentDirectoryJson(defaultDocDir)));
    res.end();
});

module.exports = router;
