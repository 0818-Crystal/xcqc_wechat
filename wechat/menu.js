/**
 * 自定义菜单
 */
const { url, appID } = require("../config");
const urlencode = require("urlencode");
const redirect_uri = urlencode(`${url}/my`);
const redirect_uri_passage = urlencode(`${url}/passage`);

module.exports = {
  button: [
    {
      name: "微教育",
      sub_button: [
        {
          type: "view",
          name: "老年教育",
          url: `${url}/list?type=老年教育`
        },
        {
          type: "view",
          name: "学历教育",
          url: `${url}/list?type=学历教育`
        },
        {
          type: "view",
          name: "社区教育",
          url: `${url}/list?type=社区教育`
        },
        {
          type: "view",
          name: "街道党校",
          url: `${url}/list?type=街道党校`
        },
        {
          type: "view",
          name: "家庭教育",
          url: `${url}/list?type=家庭教育`
        }
      ]
    },
    {
      name: "微服务",
      sub_button: [
        {
          type: "view",
          name: "通知公告",
          url: `${url}/list?type=通知公告`
        },
        {
          type: "view",
          name: "以赛促学",
          url: `${url}/list?type=以赛促学`
        },
        {
          type: "view",
          name: "报名通道",
          url: `${url}/list?type=报名通告`
        },
        {
          type: "view",
          name: "视频课堂",
          url: `${url}/list?type=视频课堂`
        },

        {
          type: "view",
          name: "阅读原文",
          url: `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${appID}&redirect_uri=${redirect_uri_passage}&response_type=code&scope=snsapi_userinfo&state=STATE#wechat_redirect`
        }
      ]
    },
    {
      type: "view",
      name: "签到有礼",
      url: `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${appID}&redirect_uri=${redirect_uri}&response_type=code&scope=snsapi_userinfo&state=STATE#wechat_redirect`
    }
  ]
};
