const express = require("express");
const auth = require("../wechat/auth");
const Router = express.Router;
const router = new Router();
const Wechat = require("../wechat/wechat");
const { url, appID, appsecret } = require("../config");
const { webAccessTokenUrl } = require("../utlis/api");
const { compareByProperty } = require("../utlis/tools");
const sha1 = require("sha1");
const QRCodeApi = require("../wechat/QRCode");
const Fetch = require("../wechat/fetchApi");
const rp = require("request-promise-native");
const QR = new QRCodeApi();
const FetchApi = new Fetch();
const wechatApi = new Wechat();
router.get("/search", async (req, res) => {
  const noncestr = Math.random()
    .toString()
    .split(".")[1];
  const timestamp = Date.now();
  const { ticket } = await wechatApi.fetchTicket();
  const signature = sha1(
    [
      `noncestr=${noncestr}`,
      `jsapi_ticket=${ticket}`,
      `timestamp=${timestamp}`,
      `url=${url}/search`
    ]
      .sort()
      .join("&")
  );
  res.render("search", { signature, noncestr, timestamp });
});
router.get("/intro", (req, res) => {
  res.render("intro");
});
router.get("/my", async (req, res) => {
  const { code } = req.query;

  console.log("data:" + req.session.userData);
  if (req.session.userData) {
    var data = req.session.userData;
  } else {
    var data = await wechatApi.fetchUserInfo(code);
    req.session.userData = data;
  }
  var marks = await FetchApi.getUserMarks(data.openid);
  var rank = await FetchApi.getRank(data.openid);
  res.render("my", { data, marks, rank });
});
router.get("/QR", async (req, res) => {
  const openid = req.session.userData.openid;
  // const qrurl = await QR.getQRImage(openid);
  var inviteCode = await FetchApi.getInvitecode(openid); //获取邀请码
  var inviteNum = await FetchApi.getInviteNum(openid); //获取共邀请了多少人
  res.render("invitecode", { inviteCode, inviteNum });
});
router.get("/rank", async (req, res) => {
  var ranks = await FetchApi.getMonthRank();
  res.render("rank", { ranks });
});
router.get("/mymark", async (req, res) => {
  const data = req.session.userData;
  const markData = await FetchApi.getAll("integral-items");
  await markData.sort(compareByProperty("weight"));
  var marks = await FetchApi.getUserMarks(data.openid);
  var userItemMark = await FetchApi.getUserItemMark(data.openid, markData);
  res.render("mark", { markData, data, marks, userItemMark });
});
router.get("/store", async (req, res) => {
  const goodsData = await FetchApi.getAll("goods");
  var data = req.session.userData;
  var marks = await FetchApi.getUserMarks(data.openid);
  var UserInfo = await FetchApi.getUserRealName(data.openid);
  res.render("store", { goodsData, marks, data, UserInfo });
});
router.get("/interest", async (req, res) => {
  // const data = req.session.userData;

  res.render("interest");
});
router.get("/list", async (req, res) => {
  const { type } = req.query;
  console.log(type);
  res.render("list", { type });
});
router.get("/passage", async (req, res) => {
  const { code } = req.query;
  if (req.session.userData) {
    var data = req.session.userData;
    var marks = await FetchApi.getUserMarks(data.openid);
  } else {
    var data = await wechatApi.fetchUserInfo(code);
    var marks = await FetchApi.getUserMarks(data.openid);
    req.session.userData = data;
  }

  res.render("passage", { data, marks });
});
router.get("/history", async (req, res) => {
  var data = req.session.userData;
  var exchanges = await FetchApi.getExchangeHistory(data.openid);
  res.render("history", { exchanges });
});
router.get("/business", async (req, res) => {
  res.render("business");
});
router.use(auth());

module.exports = router;
