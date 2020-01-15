/**
 * 验证服务器有效性
 * 实现自动回复
 * 实现邀请码邀请
 */
const sha1 = require("sha1");
const config = require("../config");

const rp = require("request-promise-native");
const {
  getUserDataAsync,
  parseXmlAsync,
  formatJsDate
} = require("../utlis/tools");
// const SubscribeApi = require("./subscribe");
// const Subscribe = new SubscribeApi();
module.exports = () => {
  return async (req, res, next) => {
    // console.log(req.query);
    const { signature, echostr, timestamp, nonce } = req.query;
    const { token, apiUrl } = config;

    const sha1Str = sha1([timestamp, nonce, token].sort().join(""));
    // console.log(sha1Str);

    if (req.method === "GET") {
      if (sha1Str === signature) {
        res.send(echostr);
      } else {
        res.end("error");
      }
    } else if (req.method === "POST") {
      if (sha1Str !== signature) {
        res.end("error");
      }
      const xmlData = await getUserDataAsync(req);
      const jsData = await parseXmlAsync(xmlData);
      const message = formatJsDate(jsData);
      var content =
        "谢谢你的关注~\n在线课堂学习戳这里：<a href='http://xqcj.doublehh.cn/list?type=视频课堂'>跳转相应界面</a>\n签到积分换礼品戳这里：<a href='https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxea8d076aeb3375e4&redirect_uri=http://xqcj.doublehh.cn/my&response_type=code&scope=snsapi_userinfo&state=STATE#wechat_redirect'>跳转相应界面</a>";
      console.log(message);
      //设置用户关注事件对应的操作
      if (message.Event == "subscribe") {
        // var popularId = "";
        //是否从二维码扫码关注
        // if (message.EventKey.indexOf("qrscene_") != -1) {
        //   popularId = message.EventKey.split("_")[1];
        // }
        //在数据库中插入用户数据
        url = `${apiUrl}/user`;
        body = {
          openId: `${message.FromUserName}`
          // popularizerId: `${popularId}`
        };
        const { resultBody, errorMsg } = await rp({
          method: "POST",
          json: true,
          url,
          body: body
        });
        // console.log(result);
        if (errorMsg.length > 0) content += "\n" + errorMsg;
      }
      if (message.Event === "unsubscribe") {
        url = `${apiUrl}/user`;
        //改变数据库中用户关注状态
        body = {
          openId: `${message.FromUserName}`,
          followerState: "0"
        };
        const res = await rp({
          method: "POST",
          json: true,
          url,
          body: body
        });
        console.log(res);
        content = "取关成功";
      }

      if (message.MsgType === "text") {
        if (message.Content.match("你好")) {
          content = "你好哇~";
        }
        if (message.Content.match("邀请人：")) {
          code = message.Content.split("邀请人：")[1];
          url = `${apiUrl}/integralUsersAll/yaoqing`;
          body = {
            openId: `${message.FromUserName}`,
            invitationCode: code
          };
          const { resultBody, errorMsg } = await rp({
            method: "POST",
            json: true,
            url,
            body: body
          });
          if (errorMsg.length > 0) content = errorMsg;
          if (resultBody != null)
            content = "邀请人" + resultBody.object + "已邀请您加入我们！";
        }
      }
      //设置回复用户消息模板
      let replyMessage = `<xml>
      <ToUserName><![CDATA[${message.FromUserName}]]></ToUserName>
      <FromUserName><![CDATA[${message.ToUserName}]]></FromUserName>
      <CreateTime>${Date.now()}</CreateTime>
      <MsgType><![CDATA[text]]></MsgType>
      <Content><![CDATA[${content}]]></Content>
    </xml>`;
      res.send(replyMessage);
    } else {
      res.end("error");
    }
  };
};
