# 新碶成教后台管理系统

## 项目下载

```
git clone https://github.com/0818-Crystal/xcqc_wechat.git
```

## 项目运行

```
cd xcqc_wechat (进入项目)

yarn install (安装依赖包)`

nodemon app(启动服务)

在80端口启动
```

## 有关全局配置

在/config/index/中全局配置

```
module.exports = {

  token: "***",

  appID: "***",

  appsecret: "***",

  url: "***", //网页域名配置

  apiUrl: "***" //后台接口配置

};
```

若需要更改url配置，也请在以下文件中更改相应的配置

```
/public/js/mark.js

/public/js/my.js

/views/store.ejs

/wechat/auth.js 中的content


```

若需要更改apiUrl配置，也请在以下文件中更改相应的配置

```
/views/passage.ejs

/views/my.ejs 

/views/list.ejs

/views/video.ejs

/views/store.ejs

```

## 自定义菜单

为了方便测试，在自定义的菜单中加入了阅读原文的板块，请在正式上线前删除

配置文件：

```
/wechat/menu.js
```

