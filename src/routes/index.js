module.exports = function (app) {
    app.get('/', function (req, res) {
        //重定向首页
        //res.redirect('/homePage')
    });

    // 获取该文件下的整个目录结构
    app.use('/getDocumentDirectoryJson', require('./documents/getDocumentDirectoryJson'));

    //点击案例作品后,获取左侧导航目录(即获取中心机构以及部门，不获取部门下的作品)
    app.use('/getMenuDirectoryJson', require('./documents/getMenuDirectoryJson'));
    //获取某个部门下的案例作品
    app.use('/getCaseProduction', require('./documents/getCaseProduction'));
    //获取案例作品详情
    app.use('/getProductionDetail', require('./documents/getProductionDetail'))

};