/**
 * 获取acess_token
 * 用户自定义菜单的删除和设置
 */
const { appID, appsecret } = require("../config");
const {
  accessTokenUrl,
  menuUrl,
  ticketUrl,
  webAccessTokenUrl,
  userInfoUrl
} = require("../utlis/api");
const rp = require("request-promise-native");
const menu = require("./menu");
const { writeFileAsync, readFileAsync } = require("../utlis/tools");
class Wechat {
  constructor() {}
  /**
   * 用来获取access_token
   */
  getAccessToken() {
    const url = `${accessTokenUrl}&appid=${appID}&secret=${appsecret}`;
    return new Promise((resolve, reject) => {
      rp({ method: "GET", url, json: true })
        .then(res => {
          console.log(res);
          //设置access_token的过期时间,提前5分钟
          res.expires_in = Date.now() + (res.expires_in - 300) * 1000;
          resolve(res);
        })
        .catch(err => {
          reject("getAccessToken has an error:" + err);
        });
    });
  }
  /**
   * 用来保存access_token
   * @param accessToken
   */
  saveAcessToken(accessToken) {
    return writeFileAsync(accessToken, "accessToken.txt");
  }
  /**
   * 用于读取access_token
   */
  readAccessToken() {
    return readFileAsync("accessToken.txt");
  }
  /**
   * 用于检测是否有效
   * @param  data
   */
  isValidAccessToken(data) {
    if (!data && !data.access_token && !data.expires_in) {
      return false;
    }
    return data.expires_in > Date.now();
  }

  /**
   * 获取新的access_token
   */
  fetchAccessToken() {
    if (this.access_token && this.expires_in && this.isValidAccessToken(this)) {
      return Promise.resolve({
        access_token: this.access_token,
        expires_in: this.expires_in
      });
    }
    return this.readAccessToken()
      .then(async res => {
        if (this.isValidAccessToken(res)) {
          return Promise.resolve(res);
        } else {
          const res = await this.getAccessToken();
          await this.saveAcessToken(res);

          return Promise.resolve(res);
        }
      })
      .catch(async err => {
        const res = await this.getAccessToken();
        await this.saveAcessToken(res);
        return Promise.resolve(res);
      })
      .then(res => {
        this.access_token = res.access_token;
        this.expires_in = res.expires_in;

        return Promise.resolve(res);
      });
  }
  /**
   * 创建自定义菜单
   */
  createMenu(menu) {
    return new Promise(async (resolve, reject) => {
      const data = await this.fetchAccessToken();
      const url = `${menuUrl.create}access_token=${data.access_token}`;
      const result = await rp({ method: "POST", json: true, url, body: menu });
      resolve(result);
    });
  }
  /**
   * 删除菜单
   */
  deleteMenu() {
    return new Promise(async (resolve, reject) => {
      const data = await this.fetchAccessToken();

      const url = `${menuUrl.delete}access_token=${data.access_token}`;
      const result = await rp({ method: "GET", json: true, url });
      resolve(result);
    });
  }
  /**
   * 获取jsapi_ticket
   */
  getTicket() {
    return new Promise(async (resolve, reject) => {
      const data = await this.fetchAccessToken();
      const url = `${ticketUrl}&access_token=${data.access_token}`;
      rp({ method: "GET", url, json: true })
        .then(res => {
          //设置ticket的过期时间,提前5分钟
          resolve({
            ticket: res.ticket,
            expires_in: Date.now() + (res.expires_in - 300) * 1000
          });
        })
        .catch(err => {
          reject("getTicket has an error:" + err);
        });
    });
  }
  /**
   * 用来保存jsapi_ticket
   * @param ticket
   */
  saveTicket(ticket) {
    return writeFileAsync(ticket, "ticket.txt");
  }
  /**
   * 用于读取ticket
   */
  readTicket() {
    return readFileAsync("ticket.txt");
  }
  /**
   * 用于检测ticket是否有效
   * @param  data
   */
  isValidTicket(data) {
    if (!data && !data.ticket && !data.ticket_expires_in) {
      return false;
    }
    return data.ticket_expires_in > Date.now();
  }

  /**
   * 获取新的ticket
   */
  fetchTicket() {
    if (this.ticket && this.ticket_expires_in && this.isValidTicket(this)) {
      return Promise.resolve({
        ticket: this.ticket,
        expires_in: this.ticket_expires_in
      });
    }
    return this.readTicket()
      .then(async res => {
        if (this.isValidTicket(res)) {
          return Promise.resolve(res);
        } else {
          const res = await this.getTicket();
          await this.saveTicket(res);

          return Promise.resolve(res);
        }
      })
      .catch(async err => {
        // console.log(err);
        const res = await this.getTicket();
        await this.saveTicket(res);
        return Promise.resolve(res);
      })
      .then(res => {
        this.ticket = res.ticket;
        this.ticket_expires_in = res.expires_in;

        return Promise.resolve(res);
      });
  }
  getWebAccessToken(code) {
    return new Promise((resolve, reject) => {
      const url = `${webAccessTokenUrl}appid=${appID}&secret=${appsecret}&code=${code}`;
      rp({ method: "GET", url, json: true })
        .then(res => {
          // console.log(res);
          resolve({
            accessToken: res.access_token,
            expires_in: Date.now() + (res.expires_in - 300) * 1000,
            openId: res.openid,
            refreshToken: res.refresh_token
          });
        })
        .catch(err => {
          reject("getWebAccessToken has an error:" + err);
        });
    });
  }

  fetchUserInfo(code) {
    return new Promise(async (resolve, reject) => {
      const { accessToken, openId } = await this.getWebAccessToken(code);
      const url = `${userInfoUrl}access_token=${accessToken}&openid=${openId}`;
      rp({ method: "GET", url, json: true })
        .then(res => {
          resolve(res);
        })
        .catch(err => {
          reject("fetchUserInfo has an error:" + err);
        });
    });
  }
}

(async () => {
  const w = new Wechat();
  let result = await w.deleteMenu();
  console.log(result);
  result = await w.createMenu(menu);
  console.log(result);
  const res = await w.fetchTicket();
  console.log(res);
})();

module.exports = Wechat;
