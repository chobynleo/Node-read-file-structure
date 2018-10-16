// 获取当前目录的文件夹json，不包括子目录

const path = require('path');
const fs= require('fs');
const util = require('util');

//引入资源路径
const dir = require('../../../constants/constants');

/*
 定义ServerUtil
 */
const ServerUtil = {};


ServerUtil.getCaseProduction = function(aPath,currentPage,pageSize){
    const newFiles = [];
    const files = fs.readdirSync(aPath);
    files.forEach(function(fileName, index) {
        const stat = fs.statSync(path.join(aPath,fileName));
        const aFile = {};
        if (stat.isDirectory()) {
            //给该级目录添加路径id
            aFile.id = path.join(aPath.replace(dir.sourcedir,""),fileName);
            //给文件命名
            aFile.name=fileName;
            //读取配置文件，如作者等详情
            let fileData = '';
            //读取作者头像配置，如作者头像.jpg
            let avatarData = '';
            try {
                fileData = fs.readFileSync(path.join(aPath,fileName, '_configs.json'), 'utf-8');
                avatarData = fs.readFileSync(path.join(dir.avatardir, '_configs.json'), 'utf-8');
                const configInfo = JSON.parse(fileData);
                const avatarInfo = JSON.parse(avatarData);
                aFile.author = configInfo.author;
                aFile.title = configInfo.title;
                //给案例作品首页的url
                aFile.cover = path.join(aPath.replace(dir.sourcedir,""),fileName,configInfo.cover);
                //自定义作者头像
                if(!avatarInfo[aFile.author]){
                    //配置中作者头像为空，默认在该文件夹查找与author名的图片
                    aFile.avatar = path.join(dir.avatardir.replace(dir.sourcedir,""),aFile.author+'.jpg');
                }else{
                    //读取配置，案例作品作者的头像
                    aFile.avatar = path.join(dir.avatardir.replace(dir.sourcedir,""),avatarInfo[aFile.author]);
                }
            }catch(e){
                aFile.fileError = '{"error":" File Not Found! 请检查配置文件的填写！"}';
                aFile.avatarData = '{"error":"Avatar Not Found! 请检查配置文件的填写！"}';
            }

        }else{
            if(fileName.match("^_") ){
                //忽略下划线开头的文件
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
    try {
        //将数据分组
        let result=[];
        pageSize = parseInt(pageSize);
        currentPage = parseInt(currentPage);
        for(let i=0,len=newFiles.length;i<len;i+=pageSize){
            result.push(newFiles.slice(i,i+pageSize));
        }
        // 返回分页后的数据给前端
        return {data:result[currentPage-1],total:newFiles.length}
    }catch (e) {
        res.status(404).send('Sorry, we cannot find that!');
    }

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

module.exports = ServerUtil.getCaseProduction;