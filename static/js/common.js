// 展示loading
function showLoading(goal){
    var _goal = goal || $("body");
    var loading = '<div class="loading_spinner loading_logo"><div class="spinner-container container1">'
                + '<div class="circle1"></div><div class="circle2"></div>'
                + '<div class="circle3"></div><div class="circle4"></div></div>'
                + '<div class="spinner-container container2"><div class="circle1"></div>'
                + '<div class="circle2"></div><div class="circle3"></div>'
                + '<div class="circle4"></div></div><div class="spinner-container container3">'
                + '<div class="circle1"></div><div class="circle2"></div><div class="circle3"></div>'
                + '<div class="circle4"></div></div></div>';
    _goal.append(loading);
}
// 移除loading
function removeLoading(){
    // setTimeout(function(){
        $('.loading_logo') && $('.loading_logo').eq(0).remove();
    // }, 300);
}
// 获取链接参数
function GetQueryString(name){
  var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
  var r = window.location.search.substr(1).match(reg);
  if(r!=null){ 
    return  unescape(r[2]);
  }
  return '';
}

String.prototype.times = function(n) {
return Array.prototype.join.call({length:n+1}, this);
}

function objectLength(object){
    var num =0;
    for (var i in object){
        if(i!="undefined"){
            num++;
        }
    }
    return num;
}
function getFirstObject(object){
    var index = 0;
    for (var i in object){
        if(i!='undefined'){
            return object[i];
        }
    }
}

function getLastObject(object){
    var index;
    for(var item in object){
        if(object.hasOwnProperty(item)){
            index = item;
        }
    }
    return object[index];
}

(function($){
    // 提示框组件 author: anle
    $.tooltip = function(ops){
        var ops = $.extend({
                html    : '',
                delay   : 2000,
                callback: null
            }, ops);
            // tool = {
            //     remove : function(){
            //         obj.remove();
            //     }
            // };

        var obj = null,
            text= ops.html,
            html= '<div id="tool_tip" style="position:fixed; max-width:300px; z-index:9999999; top:0;'
                + ' left:0; opacity:1; padding:40px 60px; background:rgba(0,0,0,0.7);'
                + 'color:#fff; border-radius:8px; text-align:center; font-size:18px; font-weight:bold">'
                + text +'</div>';

        $('#tool_tip').remove();
        obj = $(html).appendTo('body');

        // obj.css({'margin-left': '-' + obj.width()/2 + 'px', 'margin-top':'-'+obj.height()/2+'px',
        obj.css({'-webkit-transform': 'translate(-50%, -50%)', transform : 'translate(-50%, -50%)',
                 left:'50%', top:'50%'});

        setTimeout(function(){
            obj.animate({
                opacity : 0
            }, 500, 'linear', function(){
                obj.remove();
                $.isFunction(ops.callback) && ops.callback();
            });
        }, ops.delay);

        // return tool;
    };

    //
    var defaultSettings = {
      width            : 300,
      height           : 'auto',
      minHeight        : 150,
      title            : '',
      shadow           : true,
      close            : null,
      btnText          : '确定',
      submit           : null
    };
    $.fn.zDialog = function(options) {
      return this.each(function() {
        var _dialog = $(this).find('.zhichi-content'),
            settings = $.extend({}, defaultSettings, options),
            marginLeft = -settings.width/2,
            marginTop = -settings.height/2,
            titleObject = $('<header class="zhichi-title"><span class="zhichi-title-content">'+settings.title+'</span></header>'),
            closeObject = $('<span class="zhichi-close"></span>');

        (!settings.shadow) && _dialog.parent().css('background-color','transparent');

        _dialog.css({
          'width'      : settings.width,
          'height'     : settings.height,
          'min-height' : settings.minHeight,
          'margin-left': marginLeft,
          'margin-top' : marginTop
        });

        closeObject.appendTo(titleObject);
        titleObject.prependTo(_dialog);
        if( $.isFunction(settings.submit) ){
          $('<span class="zhichi-submit-btn">'+settings.btnText+'</span>').appendTo(_dialog).click(function(event) {
            /* Act on the event */
            settings.submit();
          });
        }

        closeObject.click(function(event) {
          /* Act on the event */
          $.isFunction(settings.close) && settings.close();
          _dialog.parent().hide('slow');
        });
      });
    }

})(jQuery);

//弹默认提示框
function alertTip(html, callback, delay) {
    $.tooltip({
        'html'    : html || '',
        'delay'   : $.isNumeric(callback) ? callback : (delay ? delay : 1500),
        'callback': $.isFunction(callback) ? callback : null
    });
}

//请求error提示框
function requestErrorTip() {
    alertTip('请求异常');
}
// 请求超时提示框
function requestTimeoutTip() {
    alertTip('网络状况可能不太好喔');
}

function $ajax(url, type, data, dataType, success, error){
    removeLoading();
    showLoading();
    $.ajax({
        url : url,
        type: type || 'get',
        data: data || {},
        timeout : 30000,
        dataType: 'json',
        success: function(data){
            removeLoading();
            $.isFunction(success) && success(data);
        },
        error: function(jqXHR, textStatus, errorText){
            removeLoading();
            if (textStatus === 'timeout') {
                requestTimeoutTip();
            } else {
                requestErrorTip();
            }
            $.isFunction(error) && error(arguments);
        }
    });
}


// 活动封面错误时使用默认图片 矩形
function errorActCover(that){
  that.src = 'http://cdn.jisuapp.cn/zhichi_frontend/static/pc2/common/images/errorActCover.jpg';
}
// 活动封面错误时使用默认图片 正方形
function errorActCoverSquare(that){
  that.src = 'http://cdn.jisuapp.cn/zhichi_frontend/static/pc2/common/images/errorActCoverSquare.jpg';
}
// 圈子封面错误时使用默认图片 矩形
function errorGroupCover(that){
  that.src = 'http://cdn.jisuapp.cn/zhichi_frontend/static/pc2/common/images/errorGroupCover.jpg';
}
// 圈子封面错误时使用默认图片 正方形
function errorGroupCoverSquare(that){
  that.src = 'http://cdn.jisuapp.cn/zhichi_frontend/static/pc2/common/images/errorGroupCoverSquare.jpg';
}
// 微页封面错误时使用默认图片
function errorWeiyeCover(that){
  that.src = 'http://cdn.jisuapp.cn/zhichi_frontend/static/pc2/common/images/errorWeiyeCover.jpg';
}
// 微页封面错误时使用默认图片
function errorImage(that){
  that.src = 'http://cdn.jisuapp.cn/zhichi_frontend/static/pc2/common/images/iconfont-tupian.svg';
}

/*******
 * 表单校验
 *
 */

// 是否为空
function isEmpty(val){
    return val.trim().length > 0 ? false : true ;
}
//电话
function testPhone(phone) {
  var regphone = /^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/;
  return regphone.test(phone);
}
//邮箱
function testEmail(email) {
  var regemail = /\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/;
  return regemail.test(email);
}

// 分页
function showPaginator(el, totalPages, numPage, fun, funArgu, isreset){
  // selector分页页面元素， totalPages 总页码， fun 点击页面执行函数 funArgu fun里面传到后台的参数 , isreset 是否重置
  totalPages == 0 ? totalPages = 1 : totalPages;
  var pagesOptins = {
    currentPage:1,
    totalPages:totalPages,
    numberOfPages: numPage,
    size:'normal',
    alignment:"center",
    itemTexts: function (type, page, current) {  
      switch (type) {
        case "first":  
          return "<span class='left-line'></span><span class='left-trangle'></span>";
        case "prev":
          return "<span class='left-trangle'></span>";
        case "next":
          return "<span class='right-trangle'></span>";
        case "last":
          return "<span class='right-trangle'></span><span class='right-line'></span>";
        case "page":
          return  page;
      }
    },
    tooltipTitles: function(type, page, current) {
      switch (type) {
        case "first":
          return "首页";
        case "prev":
          return "上一页";
        case "next":
          return "下一页";
        case "last":
          return "末页";
        case "page":
          return page === current ? "当前是第" + page  + '页' : "到第" + page + '页'
      }
    },
    onPageClicked: function (e, originalEvent, type, page) {
      e.stopPropagation();
      if($(originalEvent.target).closest('li').hasClass('active')){
        return;
      };
      funArgu.page = page;
      fun(funArgu, 0);
    }  
  };
  if (isreset  || el.find('.total-page').text() != totalPages) {el.bootstrapPaginator(pagesOptins);}
  
}

//是否确认提示函数
function confirmTip(data){
  var options = {
    text : data.text || "",   //提示文字
    CancelText : data.CancelText || '取消',  //取消按钮文字
    ConfirmText : data.ConfirmText || '确定', //确定按钮文字
    CancelFunction : data.CancelFunction || function(){}, //取消按钮回调
    ConfirmFunction : data.ConfirmFunction || function(){}, //确定按钮回调
    CloseFunction : data.CloseFunction || function(){}, //关闭×按钮回调
  }

  var _div = '<div style="position: fixed;left: 0;top: 0;width: 100%;height: 100%;'
      +'background:rgba(0,0,0,0.5); z-index: 9999998;">'
      +'<div style="position: absolute; left: 50%; top: 25%; max-width: 50%; min-width: 250px; border-radius: 5px; opacity: 1;'
      +' box-shadow: rgba(0, 0, 0, 0.498039) 0px 5px 15px; background: #fff; padding: 20px 0;text-align: center;">'
      +'<p style="border-radius: 5px; font-size: 16px; padding: 20px 10px;text-align: center;">'
      + options.text + '</p><span class="tip-close" style="position: absolute; display: block; width: 30px; height: 30px;'
      +' top: 0; right: 0; text-align: center; cursor: pointer; font-size: 30px; color: #A5A5A5;">×</span>'
      +'<button class="tip-combtn" style="width: 89px; height: 35px;font-size: 18px;border: none;color: #FFF;cursor: pointer;'
      +'margin-left: 20px;margin-top: 10px;background-color: #286090;border-radius: 4px;">'+options.ConfirmText+'</button>'
      +'<button class="tip-canbtn" style="width: 89px; height: 35px;font-size: 18px;border: none;color: #FFF;cursor: pointer;'
      +'margin-left: 20px;margin-top: 10px;background-color: #B4B4B4;border-radius: 4px;">'+options.CancelText+'</button></div></div>';

  _div = $(_div);
  _div.find('.tip-combtn').click(function(event) {
    options.ConfirmFunction();
    _div.remove();
  });
  _div.find('.tip-canbtn').click(function(event) {
    options.CancelFunction();
    _div.remove();
  });
  _div.find('.tip-close').click(function(event) {
    options.CloseFunction();
    _div.remove();
  });
  $('body').append(_div);
  _div.children('div').css('margin-left', '-'+_div.children('div').width()/2+'px');
}