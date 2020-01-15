/**
 * 请求后台接口的api
 */
const rp = require("request-promise-native");
const { apiUrl } = require("../config");
const { stringify } = require("query-string");
/**
 * FetchApi类，请求后台接口的api
 * @constructor
 *
 */
class FetchApi {
  constructor() {}
  /**
   * 得到所有数据
   * @param {string} resource - 请求的数据名称
   */
  getAll(resource) {
    return new Promise(async (resolve, reject) => {
      const url = `${apiUrl}/${resource}/`;
      var { resultBody } = await rp({
        method: "GET",
        url,
        json: true
      });
      resolve(resultBody);
    });
  }
  /**
   * 获取用户总分
   * @param {string} openId - 用户openID
   */
  getUserMarks(openId) {
    return new Promise(async (resolve, reject) => {
      const url = `${apiUrl}/integralUsersAll/all_integral?openId=${openId}`;
      var { resultBody } = await rp({
        method: "GET",
        url,
        json: true
      });
      console.log(resultBody);
      resolve(resultBody);
    });
  }
  /**
   * 查看用户真实姓名
   * @param {string} openId - 用户openID
   */
  getUserRealName(openId) {
    return new Promise(async (resolve, reject) => {
      const url = `${apiUrl}/user/getUserBy?type=OPENID&value=${openId}`;
      var { resultBody } = await rp({
        method: "GET",
        url,
        json: true
      });
      console.log(resultBody);
      resolve(resultBody);
    });
  }
  /**
   * 获取用户邀请码
   * @param {string} openid - 用户openid
   */
  getInvitecode(openid) {
    return new Promise(async (resolve, reject) => {
      console.log("openid:" + openid);
      const url = `${apiUrl}/user/getInvitationCode?openId=${openid}`;
      var { resultBody } = await rp({ method: "GET", url, json: true });
      console.log(resultBody);

      resolve(resultBody.object);
    });
  }
  /**
   * 获取用户邀请人数
   * @param {string} openid -用户openid
   */
  getInviteNum(openid) {
    return new Promise(async (resolve, reject) => {
      const url = `${apiUrl}/user/getInvitationNum?openId=${openid}`;
      var { resultBody } = await rp({ method: "GET", url, json: true });
      console.log(resultBody);

      resolve(resultBody);
    });
  }
  /**
   * 获取本月排名
   */
  getMonthRank() {
    return new Promise(async (resolve, reject) => {
      var current_month = new Date().getMonth() + 1;
      var current_year = new Date().getFullYear();
      const url = `${apiUrl}/integralUsersMonth/rank?filter=%7B'current_year'%3A${current_year}%2C'current_month'%3A${current_month}%7D&range=%5B1%2C10%5D&sort=%5B'integral_num'%2C'DESC'%5D`;
      var { resultBody } = await rp({
        method: "GET",
        url,
        json: true
      });
      console.log(resultBody.records);
      resolve(resultBody.records);
    });
  }
  /**
   * 获取各个积分项的具体分数
   * @param {string} openId - 用户openID
   * @param {object} markData - 积分项
   */
  getUserItemMark(openId, markData) {
    return new Promise(async (resolve, reject) => {
      var markIds = [];
      markData.forEach((item, index) => {
        markIds[index] = item.id;
      });
      console.log(markIds);
      const query = {
        itemIds: JSON.stringify(markIds),
        openId: openId
      };
      const url = `${apiUrl}/integralUsersAll/items_integral?${stringify(
        query
      )}`;
      console.log(url);
      var { resultBody } = await rp({
        method: "GET",
        url,
        json: true
      });
      console.log(resultBody);
      resolve(resultBody);
    });
  }
  /**
   * 获取用户个人排名/总排名
   * @param {string} openId - 用户openID
   */
  getRank(openid) {
    return new Promise(async (resolve, reject) => {
      console.log("openid:" + openid);
      const url = `${apiUrl}/integralUsersAll/one_rank?openId=${openid}`;
      var { resultBody } = await rp({ method: "GET", url, json: true });
      console.log(resultBody);
      if (resultBody == null) {
        resolve(resultBody);
      } else {
        resolve(resultBody.map);
      }
    });
  }
  /**
   * 获取历史兑换的100条记录
   *@param {string} openId - 用户openID
   */
  getExchangeHistory(openid) {
    return new Promise(async (resolve, reject) => {
      const query = {
        sort: JSON.stringify(["create_time", "DESC"]),
        range: JSON.stringify([1, 100]),

        filter: JSON.stringify({ "UE.open_id": openid })
      };
      const url = `${apiUrl}/user-exchange?${stringify(query)}`;
      var { resultBody } = await rp({ method: "GET", url, json: true });
      console.log(resultBody.records);
      resolve(resultBody.records);
    });
  }
}
module.exports = FetchApi;
