// 定义导航条
var navigatorLine = {
  el: document.createElement("span"),
  speed: 300,
  lineStyle: {
    "position": "absolute",
    "left": 0,
    "bottom": 0,
    "margin": "0 20px",
    "height": "2px",
    "width": "10%",
    "background": "#3091f2"
  },
  init: function () {
    var path = window.location.pathname + window.location.search;
    var isCate = $("body").attr("isCate") ? true : false;
    var isDetail = $("body").attr("isDetail") ? true : false;
    var isCourse = $("body").attr("isCourse") ? true : false;
    $("#navigator-menus .menu-item").each(function () {
      var href = $(this).attr('href');
     //debugger;
      if (path == '/index.php?r=pc/xcxCollege/collegeIndex' || path == '/') {
        $(this).addClass('active');
        return false;
      }
      if (isCate) {
        $("#menu-item-cate").addClass('active');
        return false;
      }
      if (isDetail) {
        $("#menu-item-reback").addClass('active');
        return false;
      }
      if (isCourse) {
        $("#menu-item-teacher").addClass('active');
        return false;
      }
      // href = href.replace(/\/index.php\?r\=pc/g, '');
      // href = href.replace(/\//g, '\/');
      var reg = new RegExp(href);
      if (reg.test(path)) {
        $(this).addClass('active');
        return false;
      }
      return true;
    })
    this.lineStyleSet();
    this.eventBind();
  },
  lineStyleSet: function () {
    var menuItemActive = $(".menu-item.active");
    if (menuItemActive.length) {
      this.lineStyle.width = menuItemActive.innerWidth() + 'px';
      this.lineStyle.left = menuItemActive.position().left;
      $(this.el).css(this.lineStyle);
      $("#navigator-menus").append($(this.el));
    }
  },
  lineMove: function () {
    if (!$(".menu-item.active").length) {
      return;
    }
    var left = $(".menu-item.active").position().left;
    var width = $(".menu-item.active").width();
    // $(this.el).stop().animate({"left": left}, this.speed);
    $(this.el).css({
      left: left,
      width: width
    })
  },
  lineBack: function () {
    if (!$(".menu-item.active").length) {
      return;
    }
    var left = $(".menu-item.active").position().left;
    var width = $(".menu-item.active").width();
    // $(this.el).stop().animate({"left": left}, this.speed);
    $(this.el).css({
      left: left,
      width: width
    })
  },
  eventBind: function () {
    var self = this;
    $(".menu-item").hover(function () {
      $(this).addClass('hover').siblings('.meun-item').removeClass('hover');
      self.lineMove();
    }, function () {
      $(this).removeClass('hover');
      if ($(".menu-item.active").length) {
        self.lineBack();
      }
    })
    // 浏览器窗口变化
    $(window).resize(function () {
      self.lineStyleSet();
    })
  }
}

navigatorLine.init();

// 菜单鼠标悬浮移动效果
var pow = Math.pow,
    PI = Math.PI,
    c1 = 1.70158,
    c3 = c1 + 1;
(function(){
  $.fn.moveline = function(options,callback){
    var _this = this;
    var $this = $(this);
    var defaultValue = {
      height:2,
      position:'',
      color:'#3091f2',
      animateTime:30,
      animateType:function (x) {return 1 + c3 * pow( x - 1, 3 ) + c1 * pow( x - 1, 2 );},
      zIndex:'0',
      top:54,
      customTop:true,
      randomColor:false,
      randomOpacity:1,
      click:function(){},
    }

    var opt = $.extend(defaultValue,options || {});		$this.css({			position:'relative',		});

    var li_width = $this.children().outerWidth();

    var li_height = opt.position === 'inner'? $this.children().outerHeight() - opt.height : $this.children().outerHeight();

    var li_left = $this.children().position().left;

    var li_marginLeft = Number($this.children().css('margin-left').replace(/[^0-9]+/g, ''));

    var randomColor = function(){var opacity = opt.randomOpacity || 1;var r=Math.floor(Math.random()*256);var g=Math.floor(Math.random()*256);var b=Math.floor(Math.random()*256);return "rgba("+r+','+g+','+b+','+opacity+")";
    };

    var color = opt.randomColor? randomColor() : opt.color;
    if(opt.customTop) li_height = opt.top;
    var zIndex = opt.height > 5 ? '-1':opt.zIndex;
    _this.moveLineDiv = $('<div class="nav_line"></div>').css({
      'position': 'absolute',
      'height': opt.height,
      'background': color,
      'top':li_height,
      'z-index':zIndex,
    }).appendTo($this);
    for(var i  = 0; i<$this.children().length;i++){
      if ($this.children().eq(i).hasClass('active')) {
        li_left = $this.children().eq(i).position().left;
        li_width = $this.children().eq(i).outerWidth();
      }
    }
    _this.moveLineDiv.stop().animate({
      width:li_width,
      left:li_left + li_marginLeft
    }, opt.animateTime,opt.animateType);
    $this.children().hover(function(){
      var li_marginLeft = Number($this.children().css('margin-left').replace(/[^0-9]+/g, ''));
      var li_width = $(this).outerWidth();
      var li_left = $(this).position().left;
      _this.moveLineDiv.stop().animate({
        width:li_width,
        left:li_left + li_marginLeft
      }, opt.animateTime,opt.animateType);
    },function(){
      for(var i  = 0; i<$this.children().length;i++){
        if ($this.children().eq(i).hasClass('active')) {
          li_left = $this.children().eq(i).position().left;
          li_width = $this.children().eq(i).outerWidth();
        }
      }
      _this.moveLineDiv.stop().animate({
        width:li_width,
        left:li_left + li_marginLeft
      }, opt.animateTime);
    });
    $this.children().on('click',function(){
      var ret = {
        ele:$(this),
        index:$(this).index(),
      }
      opt.click(ret);
    });
    return _this;
  }
})(jQuery);

function enter(x){
  x.setAttribute("src","http://cdn.jisuapp.cn/static/pc/index/img/message_new.png");
}
function leave(x){
  x.setAttribute("src","http://cdn.jisuapp.cn/static/pc/index/img/message_enter.png");
}

$(".nav-logo-img").click(function(){
  window.location.href = "/index.php?r=pc/index/AppHome";
});
if(window.location.href.replace(window.location.origin, '') == '/'  || window.location.href.replace(window.location.origin, '') == '/index.php?r=pc/index/AppHome'){
  pathname = '/index.php?r=pc/index/AppHome';
}else{
  pathname = window.location.href.replace(window.location.origin, '').split('?')[0]
}

function testHref(){
  var _href = window.location.pathname + window.location.search;
  console.log(_href)
  console.log($("li.menu-one,li.menu-one a,li.menu-one li"))
  $.each($("li.menu-one,li.menu-one a,li.menu-one li"),function(item,index){
    var aHref = $(this).attr("href") || $(this).attr("data");
    console.log(aHref)
    if(_href == "/" || aHref == "/index.php?r=pc/index/AppHome"){
      $(this).closest(".menu-one").addClass("active");
      $('.top-menu').moveline();
      return false;
    };
    if(aHref){
      aHref = aHref.replace("?","\\?");
      var reg = new RegExp("^"+aHref);
      // console.log(reg)
      if(reg.test(_href) && aHref != '/'){
        if($(this).hasClass("menu-one")){
          $(this).addClass("active").css("color","#3091f2");
          $('.top-menu').moveline();
          return false;
        }
        $(this).parents(".menu-one").addClass("active");
        $('.top-menu').moveline();
        return;
      }
    }
  });
}
testHref();

$(window).resize(function () {
  setZoom();
});
function setZoom(){
  var winw = window.outerWidth;
  _width = 'device-width';
  scale_w = 1;
  if (winw < 1400) {
    _width = 1400;
    scale_w  = winw /  1400;
  }else {
    _width = 'device-width';
    scale_w = 1;
  }
  var viewportContent = "width="+ _width +",initial-scale="+scale_w+",maximum-scale="+scale_w+", minimum-scale="+scale_w+", user-scalable=no";
  if (!$("#viewport").length) {
    var meta = document.createElement('meta');
    meta.name = 'viewport';
    meta.id = 'viewport';
    meta.content = viewportContent;
    $("head")[0].appendChild(meta);
  }else {
    $("#viewport").attr('content', viewportContent);
  }
}
setZoom();


// 兑换码弹窗
var is_login = $('body').attr('is_login');
$('.check_login').click(function(){
  var href = $(this).attr('data');
  if (is_login == 0) {
    //$('.lr-mask').show('slow');
    // $(".nav-lglogin").trigger("click");
    window.location.href = '/index.php?r=login/Ulogin';
  }else{
    window.location.href = href;
  }
});

// 兑换码弹窗
$('.exchange-btn').on('click',function(){
  exchangeGetVerification();
  $('#voucher').show();
})
function exchangeGetVerification() {
  $('.enterData .VerificationImg').attr(
      'src',
      '/index.php?r=Login/GetNewIdentifyCode&i=' + parseInt(Math.random() * 1000)
  );
}
$('body').on('click','.purchaseExchange .purchase-btn',function(){
  window.open(purchaseHref, '_blank');
}).on('click','.voucherCancel',function(){
  $('#voucher').hide();
}).on('click','.purchaseExchange .exchange-btn',function(){
  exchangeGetVerification();
  $('#voucher .enterData').show().siblings().hide();
  $('#voucher .enterData').find('input').val('');
}).on('click','.enterData .VerificationImg',function(){
  exchangeGetVerification()
}).on('click','.enterData .goBack-btn',function(){
  $('#voucher .purchaseExchange').show().siblings().hide();
}).on('click','.enterData .sureData',function(){
  var voucherCode = $('.enterData .VoucherCode').val(),
      VerificationCode = $('.enterData .VerificationCode').val();
  if (!voucherCode) {
    alertTip('请输入兑换码');
    return;
  }
  if (!VerificationCode) {
    alertTip('请输入验证码');
    return;
  }
  $.ajax({
    url: '/index.php?r=pc/TencentMarket/QueryVoucherCode',
    type: 'POST',
    dataType: 'json',
    data: {
      voucherCode: voucherCode,
      code: VerificationCode
    },
    success: function(data) {
      if (data.status == 0) {
        if (data.data.status == 1) {
          $('#voucher .isRedeemed').show().siblings().hide();
          $('#voucher .isRedeemed .exchangeName').text(data.data.name + data.data.cycle + data.data.spec);
        } else if (data.data.status == 0) {
          alertTip('兑换码已使用');
        } else if (data.data.status == 2) {
          alertTip('购买商品已退款');
        }
      } else {
        exchangeGetVerification();
        alertTip(data.data);
      }
    }
  })
}).on('click','.sureSubmit',function(){
  var voucherCode = $('.enterData .VoucherCode').val();
  $.ajax({
    url: '/index.php?r=pc/TencentMarket/UseVoucherCode',
    type: 'POST',
    dataType: 'json',
    data: {
      voucherCode: voucherCode,
    },
    success: function(data) {
      if (data.status == 0) {
        alertTip('兑换成功');
        $('#voucher').hide();
      } else if (data.status == 666) {
        $('#voucher .specialExchange').show().siblings().hide();
      } else {
        alertTip(data.data);
      }
    }
  })
}).on('click','.sureSpecialExchange,.RedeemedCancel',function(){
  $('#voucher').hide();
})

$('.summit_link').on('click',function(){
  $.ajax({
    url:"/index.php?r=pc/Index/Signup",
    type:"post",
    dataType:"json",
    data:{type:'nav'},
    success:function(data){
      if(data.status!=0){
        alertTip(data.data);
        return;
      }
      window.location.href="http://www.jisuapp.cn/2018/summit.html";
    }
  })
})
// 开关状态
function stateNav (){
  if('tg.jisuapp.cn' != window.location.hostname){
    return;
  }
  $.ajax({
    url:'/index.php?r=pc/Index/GetAgentJoinSwitch',
    data:{},
    dataType:'json',
    type:'post',
    success:function(data){
      if (data.status != 0) {
        alertTip(data.data);
        return;

      }
      data.data && $.each(data.data,function(index,item){
        if(item.id == '1'){
          if(item.status == '1'){
            $('.app-join-nav').css({'display':'block'});
          }else{
            $('.app-join-nav').css({'display':'none'});
          }
        }
      })
    },
    error:function(data){

    }
  })
}

stateNav();




