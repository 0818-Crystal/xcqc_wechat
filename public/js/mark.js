var height = $(".top").css("height");
var store_height = $(".store").css("height");
var top1 = height.split("px")[0] - store_height.split("px")[0] / 2;
console.log(store_height.split("px")[0] / 2);
console.log(top1);
$(".store").css("top", top1);
$(".store").css("line-height", store_height);
const url = "http://xqcj.doublehh.cn";
$(".store").on("tap", function() {
  window.open(`${url}/store`);
});
$(".qrcode").on("tap", function() {
  window.open(`${url}/QR`);
});
$(".intro").on("tap", function() {
  window.open(`${url}/intro`);
});
