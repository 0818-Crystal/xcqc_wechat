/**
 * 关注事件的数据库处理
 * 已废弃不用
 */
const connectHandler = require("../db/connect");
class Subscribe {
  constructor() {}
  checkUserExist(message) {
    return new Promise(async (resolve, reject) => {
      const connection = await connectHandler();
      var sql = `select * from user where open_id = '${message.FromUserName}'`;
      connection.query(sql, function(err, result) {
        if (err) {
          console.log("[INSERT USER ERROR] - ", err.message);
          reject(err.message);
        }
        resolve(result);
      });
    });
  }
  addMarkByQR(message) {
    return new Promise(async (resolve, reject) => {
      const result = await this.checkUserExist(message);
      if (result.length == 0) {
        this.insertUser(message);
      }

      var sqlparamsEntities = [
        `UPDATE all_users_marks SET mark_num=1+mark_num ,useful_num=1+useful_num WHERE open_id='${message.FromUserName}'`
      ];
      sqlparamsEntities.forEach(async function(sql_param) {
        const connection = await connectHandler(); // 得到链接

        connection.query(sql_param, function(e, result) {
          if (e) {
            return connection.rollback(() => {
              reject("插入失败数据回滚");
            });
          } else {
            connection.commit(error => {
              if (error) {
                reject("事务提交失败");
              }
            });
          }
          connection.release();
          resolve(result);
        });
      });
    });
  }
  insertUser(message) {
    return new Promise(async (resolve, reject) => {
      var sqlparamsEntities = [
        `insert into user (open_id,popularizer_id) values ('${message.FromUserName}','${message.EventKey}')`,
        `insert into month_users_marks (open_id,current_year,current_month) values ('${message.FromUserName}',YEAR(now()),MONTH(NOW()))`,
        `insert into all_users_marks (open_id) values ('${message.FromUserName}')`
      ];
      sqlparamsEntities.forEach(async function(sql_param) {
        const connection = await connectHandler(); // 得到链接

        connection.query(sql_param, function(e, result) {
          if (e) {
            return connection.rollback(() => {
              reject("插入失败数据回滚");
            });
          } else {
            connection.commit(error => {
              if (error) {
                reject("事务提交失败");
              }
            });
          }
          connection.release();
          resolve(result);
        });
      });
    });
  }
  updateFollowState(message) {
    return new Promise(async (resolve, reject) => {
      const connection = await connectHandler();
      var sql = `UPDATE user SET follower_state = 0 WHERE open_id = '${message.FromUserName}'`;
      connection.query(sql, function(err, result) {
        if (err) {
          console.log("[INSERT USER ERROR] - ", err.message);
          reject(err.message);
        }

        console.log(result);
        resolve(result);
      });
    });
  }
}
module.exports = Subscribe;
