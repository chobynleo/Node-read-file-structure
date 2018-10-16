# 简介
这个是一个node的工具demo，它能够提取一个文件下的目录结构以json的格式进行返回  
如一个文件夹目录格式如下：  
```
documents  // 根目录
├── 第一中心  // 一级目录
│   └── 一部  //二级目录
│      └── 浏览器  // 三级目录
```

将返回`documents`文件下整个目录结构，如：  
```
[
    {
        "name": "第一中心",
        "children": [
            {
                "name": "一部",
                "children": [
                    {
                        "name": "浏览器",
                        "children": [
                            {

                            }
                        ]
                    }
                ]
            }
        ]
    }
]
```  
不仅如此，这个工具还支持`返回同级目录`和`同级目录下文件的分页查询`


# node服务的目录结构及设计说明
项目的目录结构，API设计等说明
## 一、目录介绍
本项目目录结构如下所示：  
```
server/
├── constants // 常量文件，存放有项目根路径，作者头像路径等
│   └── constants.js
├── node_modules // node的模块存放目录，安装了node模块后自动出现
└── readme.md // 本介绍文档
└── package.json // node的配置文件
└── server-8080.js // 项目入口文件
└── public // 存放静态资源，以及相关的资源的配置文件
│   └── _author // 存放作者的头像（*.jpg），以及作者头像的配置文件
│       └── _configs.json
│   └── documents // 展示demo 案例作品的文件夹
└── src // 源码目录
│   └── models // 处理业务逻辑的模型
│   └── routes // 路由，接收和转发请求
```
## 二、案例作品目录结构说明
1. 作者头像  
关于存放作者的头像统一放在`server/public/_author中`，图片建议以`作者名+.jpg`，`_configs.json`中以`作者名:当前目录下要显示的作者图片.jpg`配置对应的作者头像，如`"肖龙飞":"肖龙飞.jpg"`，如果不进行配置，系统默认以`作者名+.jpg`在该目录下查找作者头像图片  
2. 案例作品  
展示demo作品的文件夹在`server/public/documents`中，该目录下存放要相应的机构，文件夹命名以`数字+机构名`的方式，如`1-第一中心`，数字表示展示的顺序的先后。作品文件夹下存放部门，命名以`数字+部门名`的方式，如`1-一部`，该部门目录下存放要展示的作品，同样以`数字+作品名`，如`1-浏览器`。在作品文件夹下存放相应的作品详情图片和封面，以及一个配置文件`_configs.json`，其中必填项`author`，`title`，`cover`分别表示作者名，作品名以及封面图片，如下所示：
```
{
  "_config说明":"作品详情，非必填",
  "author": "肖龙飞",
  "title":"浏览器",
  "cover":"home.jpg"
}
```

## 三、API设计
### 1. 案例作品
目前案例作品的API主要有4个，分别是
* `/getDocumentDirectoryJson` // 获取documents整个文件夹下的目录结构
* `/getMenuDirectoryJson` // 前端点击案例作品后,获取左侧导航目录，如中心+部门的信息
* `/getCaseProduction` // 获取某个部门下的案例作品，其中有作者头像，作品名及封面等信息
* `/getProductionDetail` // 获取案例作品详情图片
以下表示这4个API的结构案例：

1.URL：http://localhost:8080/getDocumentDirectoryJson  
说明：获取documents整个文件夹下的目录结构  
格式示例：
```
[
    {
        "name": "第一中心",
        "children": [
            {
                "name": "一部",
                "children": [
                    {
                        "name": "浏览器",
                        "children": [
                            {

                            }
                        ]
                    }
                ]
            }
        ]
    }
]
```

2.URL：http://localhost:8080/getMenuDirectoryJson  
说明：获取案例作品左侧导航目录结构，即返回'中心'以及'部门'文件目录结构，不包括'部门'下的文件    
格式示例：
```
{
  "data":[
            {
                "name": "第一中心",
                "id": "documents\\1-第一中心",
                "children": [
                    {
                        "name": "一部",
                        "id": "documents\\1-第一中心\\1-一部",
                        "sortID": "1"
                    },
                    {
                        "name": "二部",
                        "sortID": "2"
                    }
                ],
                "sortID": "1"
              }
        ]
}
```  

3.URL: http://localhost:8080/getCaseProduction?currentPage=1&pageSize=2&id=documents%5C1-%E7%AC%AC%E4%B8%80%E4%B8%AD%E5%BF%83%5C1-%E4%B8%80%E9%83%A8  
说明：获取案例作品,currentPage表示当前页，pageSize表示总页数，total表示作品总数量，id后的字符串是`documents\\1-第一中心\\1-一部`，经过了encodeURI()编码后的处理  
格式示例：  
```  
{
  "data":[
              {
                "id": "documents\\1-第一中心\\1-一部\\1-浏览器",
                "name": "浏览器",
                "author": "肖龙飞",
                "title": "浏览器",
                "cover": "documents\\1-第一中心\\1-一部\\1-浏览器\\home.jpg",
                "avatar": "_author\\肖龙飞测试.jpg",
                "sortID": "1"
              }
        ],
  "total":1
}
```

4.URL：http://localhost:8080/getProductionDetail?id=documents%5C1-%E7%AC%AC%E4%B8%80%E4%B8%AD%E5%BF%83%5C1-%E4%B8%80%E9%83%A8%5C1-%E6%B5%8F%E8%A7%88%E5%99%A8  
说明：点击案例作品后，展开图片详情，id后的字符串是`documents\\1-第一中心\\1-一部\\1-浏览器`，同样经过了encodeURI()编码后的处理  
格式示例：
```
{
    "data": [
        {
            "name": "首页",
            "imgUrl": "documents\\1-第一中心\\1-一部\\1-浏览器\\1-首页.jpg",
            "sortID": "1"
        },
        {
            "name": "菜单",
            "imgUrl": "documents\\1-第一中心\\1-一部\\1-浏览器\\2-菜单.jpg",
            "sortID": "2"
        }
    ]
}
```

## 依赖
`express: ^4.16.3`

## 运行
`npm run start`
