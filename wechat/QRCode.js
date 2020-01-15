/**
 * 获取用户带参数的二维码
 */
const rp = require("request-promise-native");
const { QRCode } = require("../utlis/api");
const urlencode = require("urlencode");

const Wechat = require("./wechat");
const WechatApi = new Wechat();

class QRCodeApi {
  constructor() {}
  getTicket(openid) {
    return new Promise(async (resolve, reject) => {
      const config = {
        expire_seconds: 604800,
        action_name: "QR_STR_SCENE",
        action_info: { scene: { scene_str: openid } }
      };
      const { access_token } = await WechatApi.fetchAccessToken();
      const url = `${QRCode.QRTicket}access_token=${access_token}`;
      // console.log(config);
      const { ticket } = await rp({
        method: "POST",
        url,
        json: true,
        body: config
      });
      // console.log(res);
      resolve(ticket);
    });
  }
  getQRImage(openid) {
    return new Promise(async (resolve, reject) => {
      var ticket = await this.getTicket(openid);
      const ticketEncode = urlencode(ticket);
      const url = `${QRCode.Image}ticket=${ticketEncode}`;

      resolve(url);
    });
  }
}
// (async () => {
//   const w = new QRCodeApi();
//   w.getQRImage();
// })();
module.exports = QRCodeApi;
