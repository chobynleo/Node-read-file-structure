const express = require('express');
const path = require('path');
const getProductionDetail = require('../../models/documents/getProductionDetail');
const router = express.Router();


//自己设定查找文件夹路径
//const defaultDocDir = path.join('E:\\project\\kuoyu-doc deploy\\documents\\1-第一软件开发中心\\1-一部\\1-华资浏览器');

//引入项目根路径
const dir = require('../../../constants/constants');

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
    res.write(JSON.stringify(getProductionDetail(defaultDocDir)));
    res.end();
});

module.exports = router;
