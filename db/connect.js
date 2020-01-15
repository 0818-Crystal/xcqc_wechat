var mysql = require("mysql");


const pool = mysql.createPool({
  connectionLimit: 20, //连接池连接数
  host: "10.60.144.16",
  user: "root",
  password: "1234567890.-",
  database: "xqcx"
});
//返回一个Promise链接
const connectHandle = () =>
  new Promise((resolve, reject) => {
    pool.getConnection((err, connection) => {
      if (err) {
        console.error(
          "链接错误：" + err.stack + "\n" + "链接ID：" + connection.threadId
        );
        reject(err);
      } else {
        resolve(connection);
      }
    });
  });
module.exports = connectHandle;
