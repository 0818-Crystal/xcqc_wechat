window.onpageshow = function(event) {
  //event.persisted 判断浏览器是否有缓存, 有为true, 没有为false
  if (event.persisted) {
    window.location.reload();
  }
};
const url = "http://xqcj.doublehh.cn";
$(".qrcode").on("tap", function() {
  window.open(`${url}/QR`);
});
var width = $(".menu-list").css("width");
$(".menu-list").css("height", width);
$(".menu-list").on("tap", function() {
  $(this)
    .children(".glyphicon")
    .css("color", "white");

  $(this)
    .children(".title")
    .css("color", "white");
  $(this).css("background", "#fa3c71");
  var target = $(this)
    .children(".title")
    .attr("class")
    .split(" ")[1];
  window.open(`${url}/${target}`);
});
