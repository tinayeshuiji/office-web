// 回到顶部
function goWindowTop(argument) {
  $(window).scrollTop(0);
}
// 二维码
$('#weixin-show').hover(function () {
  $("#weixin-qrcode").show();
}, function () {
  $("#weixin-qrcode").hide();
})