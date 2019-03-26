//is_mobile 传参  0全部 1手机 2电脑    返回is_mobile  0电脑 1手机 2快速生成
var template = '<li class="intt_list" int-id="${app_id}" usertoken=${user_token}>'
			 +'<img class="intt_feng" src="${cover}" onerror="erroritt(this)">'
			 // +'<p class="inv-time" >${add_time}</p>'
			 +'<div class="intt_setwrap"><p title="${app_name}">${app_name}</p>'
			 +'<p class="itt_au" style="${is_mobile}"><span class="inv-author" title="${nickname}">${nickname}</span>'
			 +'<span class="inv-count">${view_count}</span></p></div>'
			 +'<div class="intt_mask"><img src="${qrcode}">'
			 +'<button class="itt_preview">预览</button>${message}'
			 +'</div></li>',

	default_cover = 'http://cdn.jisuapp.cn/zhichi_frontend/static/pc/index/img/in4.jpg',
	isAdmin = 0,
	InvData= {
		page: 1,
		order_by: '',
		start_time: '',
		end_time: '',
		category_id: 0,
		word:'',
		page_size: 16,
		nickname: ''
		};

function erroritt(that){
	that.src = 'http://cdn.jisuapp.cn/zhichi_frontend/static/pc/index/img/in4.jpg';
}

function GetQueryString(name){
	 var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
	 var r = window.location.search.substr(1).match(reg);
	 if(r!=null)return  unescape(r[2]); return null;
}

function parseTemplate(data , type){
	var html = template.replace(/\$\{(\w+)\}/g, function($0, $1){
		switch($1){
			// case 'nickname': return data[$1].length > 5 ? (data[$1].substring(0,4) + '..')
			// 				 : data[$1];
			case 'adminUser' : return isAdmin == 1 ? '' : 'display:none';
			case 'view_count' : return (data[$1]>10000) ? (Math.floor(data[$1]/10000)+'万') : data[$1];
			case 'cover_thumb': return data[$1] || default_cover;
			case 'message': return isAdmin == 1 ? '<button class="message">留言</button>' : '';
			case "user_token": return isAdmin == 1 ? data[$1] : '';
			case "is_mobile" : return (data[$1] == 1 ? 'background: url(http://cdn.jisuapp.cn/zhichi_frontend/static/pc/index/img/mobile.png) no-repeat 97%;' :  (data[$1] == 2 ? 'background: url(http://cdn.jisuapp.cn/zhichi_frontend/static/pc/index/img/mobileQuick.png) no-repeat 97%;' : ''));
			default : 	return data[$1];
		}
	});
	return html;
}

function getIntData() {
	removeLoading();
	showLoading($("body"));
	$("#tip").remove();
	$.ajax({
		url: '/index.php?r=pc/AppCase/GetListByCond',
		type: 'get',
		dataType: 'json',
		data: InvData,
		success: function(data) {
			// console.log(data)
			if (data.status == 0) {
				var int_li = '';
				$(data.data).each(function(index, item) {
					int_li += parseTemplate(item);
				});
				//$('#list').append(int_li);
				if(data.is_more == 0){
					$("#list_wrap").append('<p class="tip" id="tip">没有了</p>');
					removeLoading();
					return ;
				}else{
					$(".all_wrap").removeClass('loading');
				}
			}
			removeLoading();
		},
		error: function() {
			removeLoading();
		}
	});
}


// 轮播
window.onload = function() {
	
	var bannerObj = {
		durTime: 5000,
		bannerArr: [],
		bannerSize: 0,
		activeIdx: 0,
		stop: false,
		init: function () {
			//检测轮播有多少组图片
			var $this = this;
			$this.bannerSize = $('#banner-images-area .banner-image-item').length;
			if ($this.bannerSize < 2) {
				return;
			}
			for (var i = 0; i < $this.bannerSize; i++) {
				$this.bannerArr.push(i == 0 ? 1 : 0);
			}
			$this.startInterVal();
			$this.eventBind();
		},
		startInterVal: function () {
			var $this = this;
			setInterval(function () {
				if ($this.stop) {
					return;
				}
				$this.bannerArr.unshift($this.bannerArr.pop());
				$this.bannerChangeAction();
			},$this.durTime)
		},
		bannerChangeAction: function () {
			var $this = this;
			$this.bannerArr.some(function (item, index) {
				if (item === 1) {
					$this.activeIdx = index;
					$('#banner-images-area .banner-image-item').eq(index).addClass('active')
					.siblings('.banner-image-item').removeClass('active');
					$('#banner-pagination-area .banner-pagination-item').eq(index).addClass('active')
					.siblings('.banner-pagination-item').removeClass('active');
					return true;
				}
				return false;
			})
		},
		bannerChangeActiveIdx: function (index) {
			this.bannerArr = this.bannerArr.map(function (bItem, bIndex) {
				var res = bIndex == index ? 1 : 0;
				return res;
			})
			this.bannerChangeAction();
		},
		eventBind: function () {
			var $this = this;
			$('#banner-section').on('mouseenter', function () {
				$this.stop = true;
			}).on('mouseleave', function () {
				$this.stop = false;
			}).on('click', '.banner-pagination-item', function () {
				var pIndex = $(this).index();
				$this.bannerChangeActiveIdx(pIndex);
			}).on('click', '.banner-btn', function (item, index) {
				var _this = $(this),
				activeIdx = $this.activeIdx;
				if (_this.hasClass('banner-btn-prev')) {
					activeIdx = activeIdx == 0 ? ($this.bannerSize - 1) : (activeIdx - 1);
				}else {
					activeIdx = (activeIdx == $this.bannerSize - 1) ? 0 : (activeIdx + 1);
				}
				$this.bannerChangeActiveIdx(activeIdx);
			});
		}
	}
	bannerObj.init();
}
$(function(){
	$('.slider_zong').height(490 / 1900 * $(window).width());
	$(window).resize(function(){
		$('.slider_zong').height(490 / 1900 * $(window).width());
	});
	isAdmin =$("body").attr("isAdmin") || 0;
	var swiper = new Swiper('.slider_zong.swiper-container', {
		pagination: '.swiper-pagination',
		nextButton: '.swiper-button-next',
		prevButton: '.swiper-button-prev',
		slidesPerView: 1,
		paginationClickable: true,
		loop: true,
		grabCursor: true,
		autoplay: 15000,
		autoplayDisableOnInteraction : false,
		preventLinksPropagation : true,
	});

	//getIntData();

	/*$("#navul").on('click', 'span', function(event) {
		event.preventDefault();
		var _this = $(this);
		_this.siblings().children().removeClass('Triangle-up-active');
		_this.siblings().removeClass('tab-active');
		// _this.siblings().css({'color': '#959595', 'border-bottom': '4px #fff'});
		_this.addClass('tab-active');
		// _this.css({'color': '#09a3e9','border-bottom': '4px solid #09a3e9'});
		_this.children().addClass('Triangle-up-active');
		$('#list').empty();
		InvData.category_id =  _this.attr("data-id");
		InvData.word = '';
		InvData.start_time = '';
		InvData.end_time = '';
		InvData.page = 1;
		InvData.nickname = '';
		getIntData();
	});
	$("#sortlabel").on('click', 'label', function(event) {
		event.preventDefault();
		$(this).addClass('active').siblings('label').removeClass('active');
		$('#list').empty();
		InvData.page = 1;
		InvData.order_by = $(this).attr("data-id");
		InvData.is_mobile = $(this).attr("data-isMobile");
		getIntData();
	});
	$("#search").on('keydown', function(event) {
		if (event.keyCode==13){
			$("#searchBtn").click();
		}
	});
	$("#searchBtn").click(function(event) {
		var _val = $("#search").val();
		$('#list').empty();
		InvData.page = 1;
		InvData.word = _val;
		getIntData();
	});
	$("#sortingBtn").click(function(event) {
		var _starttime = $("#starttime").val(),
			_endtime = $("#endtime").val(),
			_nickname = $("#nicknameinput").val();

		$('#list').empty();

		InvData.page = 1;
		InvData.word = '';
		InvData.start_time = _starttime;
		InvData.end_time = _endtime;
		InvData.nickname = _nickname;
		getIntData();
	});

	$(".all_wrap").scroll(function(event) {
		var $this = $(this);
		var scTop = $this.scrollTop() + 150;

		var scheight = $(".intt_wrap").height() - $this.height();
		if(scTop >= scheight){
			if ($this.hasClass('loading')) {
				return;
			}
			$this.addClass('loading');
			InvData.page ++;
			getIntData();
		}
	});*/

	// 预览 
	$("#list").on('click', '.itt_preview', function(event) {
		event.preventDefault();
		// window.open('//cdn.jisuapp.cn/index.php?r=pc/Webapp/preview&id='+$(this).parent().parent().attr('int-id'));
		window.open('/make/app/'+$(this).parent().parent().attr('int-id')+'.html');

		event.stopPropagation();
	});
	$(".scrollTop").click(function(event) {
		$(".all_wrap").scrollTop(0);
	});
	// 进入管理页面
	$("#list").on('click', '.intt_setwrap', function(event) {
		event.preventDefault();
		if(isAdmin == 1){
			if ($(event.target).hasClass('inv-author')){
				window.open('/index.php?r=pc/Webapp/myapp&user_token=' + $(this).parent().attr("usertoken"));
			}else if($(event.target).hasClass('inv-count')){
				window.open('/index.php?r=pc/User/showUsers&user_token=' + $(this).parent().attr("usertoken"));
			} else if ($(event.target)[0].nodeName.toLowerCase() === 'p'){
				window.open('/index.php?r=pc/AppMgr/manager&_app_id=' + $(this).closest('.intt_list').attr("int-id"));
			}
		}
	});
	// 留言 
	var user_id = '';
	$("#list").on('click', '.message', function(event) {
		event.preventDefault();
		$(".msg_wrap").show();
		user_id = $(this).parent().parent().attr("usertoken");
		event.stopPropagation();
	});

	$("#msg_confrim").click(function(event) {
		$.ajax({
			url: '/index.php?r=Usercenter/NewMsg',
			type: 'post',
			dataType: 'json',
			data: {
				replied_user_id: user_id,
				content: $("#msg_text").val()
			},
			success: function(data) {
				if(data.status == 0){
					alert("发送成功!");
					$(".msg_wrap").hide();
					$("#msg_text").val('');
				}else{
					alert("发送失败！");
				}
			}
		});
	});
	$("#msg_cancel").click(function(event) {
		$(".msg_wrap").hide();
	});
});