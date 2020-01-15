/**
 * 统一配置请求微信的url
 */
const prefix = "https://api.weixin.qq.com/cgi-bin/";
const webPrefix = "https://api.weixin.qq.com/sns/";
module.exports = {
  accessTokenUrl: `${prefix}token?grant_type=client_credential`,
  ticketUrl: `${prefix}ticket/getticket?type=jsapi`,
  menuUrl: {
    create: `${prefix}menu/create?`,
    delete: `${prefix}menu/delete?`
  },
  webAccessTokenUrl: `${webPrefix}oauth2/access_token?grant_type=authorization_code&`,
  userInfoUrl: `${webPrefix}userinfo?lang=zh_CN&`,

  QRCode: {
    QRTicket: `${prefix}qrcode/create?`,
    Image: `https://mp.weixin.qq.com/cgi-bin/showqrcode?`
  }
};
