//progress-index点击切换
$(".progress-index").on("click","li",function(){
  var idx = $(this).index();
  $(this).addClass('active').siblings('li').removeClass('active');
  $(".progress-list li").eq(idx).show().siblings('li').hide();
})
$(".progress-index li").hover(function(){
  var idx = $(this).index();
  $(this).addClass('active').siblings('li').removeClass('active');
  $(".progress-list li").eq(idx).show().siblings('li').hide();
})
//点击播放视频
var played = false, oVideo = $(".banner-video-player")[0];
$(".paly-btn").click(function(){
  $(".banner-video").addClass("banner-video-in");
  $(".banner-video").removeClass("banner-video-out");
  oVideo.play();
})
$(".banner-video-player").click(function(){
  if (played){
    this.pause();
  }else{
    this.play();
  }
  played = !played;
})
$(".banner-video-btn-close").click(function(){
  oVideo.pause();
  $(".banner-video").addClass("banner-video-out");
  $(".banner-video").removeClass("banner-video-in");
})
