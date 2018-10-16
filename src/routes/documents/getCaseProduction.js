const express = require('express');
const path = require('path');
const getCaseProduction = require('../../models/documents/getCaseProduction');
const router = express.Router();

//引入项目根路径
const dir = require('../../../constants/constants');

//自己设定查找文件夹路径、测试
//const defaultDocDir = path.join('E:\\project\\kuoyu-doc deploy\\public\\documents\\1-第一软件开发中心\\1-一部');

router.get('/',function (req,res) {
    res.writeHead(200, {
        'Content-Type': "Application/json;charset=utf-8",
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers':'Access-Control-Allow-Origin,X-Requested-With',
        'Access-Control-Allow-Methods':'GET',
        'Access-Control-Allow-Credentials':'true',
        'X-Powered-By':' 3.2.1'
    });
    const id = decodeURI(req.query.id);
    const defaultDocDir = path.join(dir.sourcedir,id);
    res.write(JSON.stringify(getCaseProduction(defaultDocDir,req.query.currentPage,req.query.pageSize)));
    res.end();
});

module.exports = router;
