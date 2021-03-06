// 获取当前目录下所有文件json，

const path = require('path');
const fs= require('fs');
const util = require('util');

//引入项目根路径
const dir = require('../../../constants/constants');

/*
 定义ServerUtil
 */
const ServerUtil = {};

ServerUtil.getDocumentDirectoryJson = function(aPath){
    const newFiles = [];
    const files = fs.readdirSync(aPath);
    files.forEach(function(fileName, index) {
        const stat = fs.statSync(path.join(aPath,fileName));
        const aFile = {};
        if (stat.isDirectory()) {
            aFile.name = fileName;
            // 把这段注释掉就可以获取当前目录
            aFile.children = ServerUtil.getDocumentDirectoryJson(path.join(aPath,fileName));
        }else{
            if(fileName.match("^_")){
                //忽略下划线开头的文件,以及首页图片
            }else{
                aFile.name=fileName;
            }
        }
        if(aFile.name){
            let sortID = aFile.name.match("[0-9]+-");
            if(sortID){
                sortID = sortID[0];
                sortID = sortID.split("-")[0];
                aFile.sortID = sortID;
                //剪掉aFile的name的n-
                aFile.name = aFile.name.split("-")[1];
                aFile.name = aFile.name.split(".")[0];
            }
            newFiles.push(aFile);
        }
    });
    newFiles.sort(function(a,b){
        if(a.sortID && b.sortID){
            return a.sortID-b.sortID;
        }else if(a.sortID){
            return -1;
        }else if(b.sortID){
            return 1;
        }
        return 0;
    });
    return newFiles
};
ServerUtil.sendError = function(req, res, error) {
    res.writeHead(500, {
        'Content-Type': 'text/html'
    });
    res.write('<!doctype html>\n');
    res.write('<head><meta charset="utf-8"></head>\n')
    res.write('<title>Internal Server Error</title>\n');
    res.write('<h1>Internal Server Error</h1>');
    res.write('<pre>' + escapeHtml(util.inspect(error)) + '</pre>');
    util.puts('500 Internal Server Error');
    util.puts(util.inspect(error));
};

// 过滤文件夹
const files = fs.readdirSync(__dirname);
files.forEach(function(fileName, index) {
    var stat = fs.statSync(__dirname + '/' + fileName);
    if (stat.isDirectory() && !fileName.match('^_')) {
        // console .log(fileName)
    }
});

module.exports = ServerUtil.getDocumentDirectoryJson;