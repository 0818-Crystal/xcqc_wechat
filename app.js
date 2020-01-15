const express = require("express");
const app = express();
const path = require("path");
const router = require("./router");
const cookieParser = require("cookie-parser");
const session = require("express-session");
app.set("view engine", "ejs"); //设置ejs模板引擎
app.set("views", "./views");
app.use(cookieParser());
app.use(
  session({
    name: "wechat",
    secret: "wechat",
    cookie: {
      maxAge: 2592000000
    },
    resave: false,
    saveUninitialized: true //本应用中是将session存储到内存中。
  })
);
//设置静态文件目录
app.use(express.static(path.join(__dirname, "public")));
app.use(router);
//监听80端口
app.listen(80, () => {
  console.log("starting to listen");
});
