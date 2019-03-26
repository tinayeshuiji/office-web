// 登录注册
var num=1,
    totalnum=15,
    tnum = 1,
    checktime,
		turnurl = $('body').attr('url'),
		regm = /^[a-zA-Z0-9_\.-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/,
		regp = /^1\d{10}$/,
		count,
		countInterval;
$(function(){
	var username = getCookie("pc_un"),
			password = getCookie("pc_pw");
	if($('#login_wrap').attr("user_token") != '' || username == '' || username == null || password == '' || password == null ){
	}else{

		//cookieLogin(username,password);
	}
	if (getCookie('u') && getCookie('p')) {
		$('#login-username').val(getCookie('u'));
		$('#login-password').val(getCookie('p'));
		$('#remberPw').prop('checked', true);
	}else{
		$('#login-username').val('');
		$('#login-password').val('');
		$('#remberPw').prop('checked', false);
	}
	if ($('#login_wrap').attr('user_token')) {
		window.history.replaceState("","", window.location.href.replace("&login=1" ,""));
	}
	if(GetQueryString('login') ){
		loginFunc();
		$('.lr-mask').fadeIn(500);
	}
	$('#login_wrap').click(function(event) {
		event.stopPropagation()
		$('.lr-mask').fadeOut(600);
		window.history.pushState("","", window.location.href.replace("&login=1" ,""));
		clearTimeout(checktime);
	});

	$('.nav-reg').on('click', function(){
		$('.lr-mask').fadeIn(500);
		$('.reg-info-wrap').show().siblings().hide();
		$('.reg-wrap').hide().siblings().show();
		loginFunc();
	});

	$('.lr').on('click', function(event){
		event.stopPropagation();
	}).on('click', '.login-wx', function(event){
		// 微信扫码登录
		$('.wx-login').show().siblings().hide();
	}).on('click', '.to-reg, .reg-now', function(event) {
		// 去注册
		$('.reg-info-wrap').show().siblings().hide();
		$('.reg-wrap').hide().siblings().show();
	}).on('click', '.forgetPw', function(event) {
		// 忘记密码
		$('.login-info-wrap').hide().siblings('.findBackPw').show();
	}).on('click', '.account-login, .to-login', function(event) {
		// 返回账号登陆
		$('.login-info-wrap').show().siblings().hide();
		$('.reg-wrap').show().siblings().hide();
	}).on('click', '.reg-type span', function(event) {
		var $this = $(this), regType = $this.index();
		if ($this.hasClass('active')) {return;}
		$this.addClass('active').siblings().removeClass('active');
		switch(+regType){
			case 0:
				$('.person-reg').show().next().hide();
				break;
			case 1:
				$('.person-reg').hide().next().show();
				break;
		}
	}).on('click', '.changetype', function(event){
		// 切换找回方式
		var $this = $(this),  type = $(this).siblings('.findtype').attr('type');
		$this.parent().siblings().hide();
		switch(type){
			case 'email':
				$this.text('通过邮箱找回');
				$this.siblings('.findtype').text('手机找回').attr('type', 'phone');
				$this.parent().siblings('.findByPhone').show();
				break;
			case 'phone':
				$this.text('通过手机找回');
				$this.siblings('.findtype').text('邮箱找回').attr('type', 'email');
				$this.parent().siblings('.findByEmail').show();
				break;
		}
		$('.findBackPw').find('input').val('');
		clearInterval(countInterval);
		$('.getCode').text('获取验证码').removeClass('waiting');
	}).on('click', '#findByPhoneReset', function(event){
		// 确认找回
		var	byPhone = $('#by-phone').val().trim(),
				code = $('#phone-code-input').val().trim(),
				newPw1 = $('#PnewPw1').val().trim(),
				newPw2 = $('#PnewPw2').val().trim(),
 				param = {};
 		if (!byPhone) {
 				alertTip('请输入手机号');
 			$('#by-phone').focus();
 			return;
 		}
 		if (!code) {
 			alertTip('请输入验证码');
 			$('#phone-code-input').focus();
 			return;
 		}
 		if (newPw1 != newPw2) {
 			alertTip('两次输入的密码不一样，请重新输入');
 			$('#PnewPw2').focus();
 			return;
 		}

		param = {
			phone:byPhone, 
			password: newPw2, 
			code:code,
			pic_code:$('#findby-pic-code').val()
		}
		findByPhone(param);
	}).on('click', '#findByEmailReset', function(event) {
		// 确认找回
		var	byEmail = $('#by-email').val().trim(),
				code = $('#email-code-input').val().trim(),
				newPw1 = $('#EnewPw1').val().trim(),
				newPw2 = $('#EnewPw2').val().trim(),
 				param = {};
 		if (!byEmail) {
			alertTip('请输入注册邮箱');
 			$('#by-email').focus();
 			return;
 		}
 		if (!code) {
 			alertTip('请输入验证码');
 			$('#email-code-input').focus();
 			return;
 		}
 		if (newPw1 != newPw2) {
 			alertTip('两次输入的密码不一样，请重新输入');
 			$('#EnewPw2').focus();
 			return;
 		}

		param = { 
			password: newPw2, 
			code:code,
			email: byEmail,
		};
		findByEmail(param);
	}).on('click', '.login-now', function(event) {
		// 返回登录
		$('.login-info-wrap').show().siblings().hide();
	}).on('click', '.get-Phone-Code', function(event) {
		// 获取验证码
		if ($(this).hasClass('waiting')) {return;}
		var emailOrPhone = $('#by-phone').val().trim(),
				code = $('#findby-pic-code').val();
		if (!code) {
			$('#findby-pic-code').focus();
			alertTip('请输入右边图形验证码');
			return;
		}
		getPhoneCode({phone:emailOrPhone,  pic_code: code}, '.get-Phone-Code');
		
	}).on('click', '.getCode', function(event) {
		if ($(this).hasClass('waiting')) {return;}
		var emailOrPhone = $('#by-email').val().trim();
		if (!regm.test(emailOrPhone)) {
			$('#email-or-phone').focus();
			alertTip('请输入合法的邮箱');
			return;
		}
		getEmailCode(emailOrPhone, '.getCode');
	}).on('blur', '#newPw2', function(event) {
		if ($('#newPw1').val().trim() != $('#newPw2').val().trim()) {
			alertTip('两次输入的密码不一样，请重新输入');
			
			return;
		}
	}).on('click', '#login-btn', function(event) {
		// 登陆
		event.stopPropagation()
		var username = $('#login-username').val().trim(),
				password = $('#login-password').val().trim();
		if(username.length==0 || password.length==0){
			alertTip('用户名密码不能为空');
			// $('#login-error').text('用户名密码不能为空');
			return;
		}
		$('#login-error').text('');
		var passwordmd5 = password;
		$('#remberPw').prop('checked') ? rememberPw(username, password) : deletePw();
		$.ajax({
			url: '/index.php?r=Login/login',
			type: 'post',
			dataType: 'json',
			data: {username: username,password: passwordmd5},
			success:function(data){
				switch(data.status){
					case 0 :
						saveUsername(username , $.md5(passwordmd5));
							window.location.reload();
						break;
					case 1 :
						setTimeout(alertTip(data.data),3000);
						break;
					case 2 :
						// 未绑定微信
						alertTip('您未绑定微信，请扫描二维码绑定');
						$('.code-img').attr('src', data.data);
						$('.wx-login').show().siblings().hide();
						break;
				}
			},
			error:function(data){
				alertTip(data.data);
			}
		})
	}).on('click', '.getPhoneCode', function(event) {
		if ($(this).hasClass('waiting')) {return;}
		var regphone = $('#reg-phone').val();
		var code = $('#pic-code').val();
		if ($('#reg-phone-exist').hasClass('hasreged')) {
			alertTip('该号码已被注册');
			return;
		}
		if (!code) {
			$('#pic-code').focus();
			alertTip('请输入右边图形验证码');
			return;
		}
		getPhoneCode({phone:regphone, allow:1, pic_code: code}, '.getPhoneCode');
	}).on('click', '.reg-btn', function(event) {
		var param = {},
				phone = $('#reg-phone').val().trim(),
				pw1 = $('.reg-password').val().trim(),
				pw2 = $('.reg-conpassword').val().trim(),
				companyName = $('#reg-fullname').val().trim(),
				code = $('#phone-code').val().trim(),
				region = $('#area-select').val(),
				type = $('#reg-company-type').val(),
				inviteCode = $('#inviteCode').val().trim();


		if (!companyName) {
			alertTip('请输入您的企业名称');
			$('#reg-fullname').focus();
			return;
		}
		if (!phone) {
			alertTip('请输入手机号');
			$('#reg-phone').focus();
			return;
		}
		if (!regp.test(phone)) {
			alertTip('请输入合法的手机号');
			$('#reg-phone').focus();
			return;
		}
		if (!code) {
			alertTip('请输入验证码');
			$('#phone-code').focus();
			return;
		}
		if (pw1.length < 6 || pw1.length > 20) {
			alertTip('请输入6-20位密码');
			$('.reg-password').focus();
			return;
		}
		if (pw1 != pw2) {
			alertTip('两次输入的密码不一样，请重新输入');
			$('.reg-conpassword').focus();
			return;
		}
		if (!$('#area-select')) {
			alertTip('请选择所在地区');
			return;
		}
		param ={
			password:pw2,
			invite_code: inviteCode,
			code:code,
			phone:phone,
			name:companyName,
			type: type,
			region: region,
		}
		register(param);
	}).on('keydown', '.login-info-wrap', function(event) {
		if (event.keyCode==13){
			$('#login-btn').click();
		}
	}).on('change', '#province-select', function(event) {
		
    $('#city-select').empty().append('<option selected disabled>选择市</option>');
    $('#area-select').empty().append('<option selected disabled>选择区</option>').addClass('js-invalid');
    getArea('#city-select',$(this).val(),'请求市列表失败，请重试');
  }).on('change', '#city-select', function(event) {
    $('#area-select').empty().removeClass('js-invalid');
    $('#region-tip').text('');
    getArea('#area-select',$(this).val(),'请求区列表失败，请重试');
  }).on('blur', '#reg-phone', function(event) {
  	var regphone = $(this).val();
  	if (!regphone) {return;}
  	$.ajax({
			  		url: '/index.php?r=pc/Agent/CheckAccount',
			  		type: 'get',
			  		dataType: 'json',
			  		data: {account: regphone},
			  		success:function(data) {
			  			if (data.status != 0) {$('#reg-phone-exist').removeClass('hasreged').attr('src','http://cdn.jisuapp.cn/zhichi_frontend/static/login/images/ok.png');return;};
							$('#reg-phone-exist').addClass('hasreged').attr('src','http://cdn.jisuapp.cn/zhichi_frontend/static/login/images/error.png');
							alertTip('该号码已被注册');
			  		},
			  		error:function(data){

			  		}
			  	});
  		
  }).on('blur', '#by-phone', function(event) {
  	var regphone = $(this).val();
  	if (!regphone) {return;}
  	$.ajax({
			  		url: '/index.php?r=pc/Agent/CheckAccount',
			  		type: 'get',
			  		dataType: 'json',
			  		data: {account: regphone},
			  		success:function(data) {
			  			if (data.status != 0) {$('#find-phone-exist').removeClass('hasreged').attr('src','http://cdn.jisuapp.cn/zhichi_frontend/static/login/images/error.png');alertTip('该号码未被注册');return;};
							$('#reg-phone-exist').addClass('hasreged').attr('src','http://cdn.jisuapp.cn/zhichi_frontend/static/login/images/ok.png');
			  		},
			  		error:function(data){

			  		}
			  	});
  			
  }).on('blur', '#perfit-phone', function(event) {
  	var regphone = $(this).val();
  	if (!regphone) {return;}
  	$.ajax({
			  		url: '/index.php?r=pc/Agent/CheckAccount',
			  		type: 'get',
			  		dataType: 'json',
			  		data: {account: regphone},
			  		success:function(data) {
			  			if (data.status != 0) {$('#find-phone-exist').removeClass('hasreged').attr('src','http://cdn.jisuapp.cn/zhichi_frontend/static/login/images/ok.png');return;};
							$('#perfit-phone-exist').addClass('hasreged').attr('src','http://cdn.jisuapp.cn/zhichi_frontend/static/login/images/error.png');
							alertTip('该号码已被注册');
			  		},
			  		error:function(data){

			  		}
			  	});
  			
  }).on('click', '#perfit-info', function(event) {
  	var pPhone = $('#perfit-phone').val().trim(),
  			pPw1 = $('#perfit-pw1').val().trim(),
  			pPw2 = $('#perfit-pw2').val().trim(),
  			invcode = $('#perfit-invite').val().trim(),
  			code = $('#perfit-code').val();
  	if (!regp.test(pPhone) && !regm.test(pPhone)) {
  		$('#perfit-phone').focus();
  		alertTip('请输入合法的手机号或邮箱');
  		return;
  	}
  	if (pPw1 != pPw2) {
  		$('#perfit-pw2').focus();
  		alertTip('两次输入的密码不一样，请重新输入');
  		return;
  	}
  	if (!code) {
  		alertTip('请输入验证码');
  		$('#perfit-code').focus();
  		return;
  	}
  	perfitInfo({code:code, validate:1, username:pPhone, password:pPw2, invite_code: invcode,})
  }).on('click', '.getPerfitCode', function(event) {
  	var code = $('#perfit-pic-code').val();
  	if ($(this).hasClass('waiting')) {
  		return;
  	}
  	if (!code) {
  		$('#perfit-pic-code').focus();
  		alertTip('请输入右边图形验证码');
  		return;
  	}
  	var perfitPhone = $('#perfit-phone').val();
  	getPhoneCode({phone:perfitPhone, allow:1, pic_code:code}, '.getPerfitCode');
  });
  
	// 为了让浏览器提醒自动保存密码添加的form
	$('form').submit(function(event) {
		event.preventDefault();
	});
	getPicCode();
	$('.getPicCode').on('click', getPicCode);
});

function getPicCode(){
	$('.pic-code').attr('src', '/index.php?r=Login/GetIdentifyCode&i=' +parseInt(Math.random() * 10000000))
}

function cookieLogin(username,password){
	$.ajax({
		url: '/index.php?r=Login/login',
		type: 'post',
		dataType: 'json',
		data: {username: username,password: password,cookie_login:1},
		success:function(data){
			if(data.status == 0){
				window.location.reload();
			}else{
				$('.lr-mask').fadeIn(500);
			}
		},
		error:function(data){
		}
	})
}

function saveUsername(un , pw){
	setCookie('pc_un' , un , 24 * 3);
	setCookie('pc_pw' , pw , 24 * 3);
}

function rememberPw(u, p){
	setCookie('u' , u , 24 * 3);
	setCookie('p' , p , 24 * 3);
}

function deletePw(){
	setCookie('u','',0);
	setCookie('p','',0);
}

function perfitInfo(param){
	$.ajax({
		url:'/index.php?r=Usercenter/saveInfo',
		type:'post',
		data:param,
		dataType:'json',
		success:function(data){
			if (data.status !== 0) {alertTip(data.data);return;}
			alertTip('注册成功');
			setTimeout(function(){
				window.location.reload();
			}, 1500);
		}
	});
}

function findByPhone(param){
	$.ajax({
		url: '/index.php?r=Login/PhoneResetPassWord',
		type: 'get',
		dataType: 'json',
		data: param,
		success:function(data){
			if (data.status != 0) {alertTip(data.data);return;}
			alertTip('修改成功');
			window.location.reload();
		},
		error:function(data){
			alertTip(data.data)
		}
	});
}

function findByEmail(param){
	$.ajax({
		url: '/index.php?r=pc/Code/ModifyPasswordByCode',
		type: 'get',
		dataType: 'json',
		data: param,
		success:function(data){
			if (data.status != 0) {alertTip(data.data);return;}
			alertTip('修改成功');
			window.location.reload();
		},
		error:function(data){
			alertTip(data.data);
		}
	});
}

function register(param){
	$.ajax({
		url: '/index.php?r=Login/RegisterCompany',
		type: 'post',
		dataType: 'json',
		data: param,
		success: function(data){
			if (data.status != 0) {alertTip(data.data);return;}
			window.location.href='/index.php?r=pc/Index/apphome';
		},
		error:function(data){
			alertTip('网络错误，注册失败！'+data.data);
		}
	});
}

function getArea(container,pid,tip){
	
	$.ajax({
		url: '/index.php?r=Region/getRegionList',
		type: 'get',
		dataType: 'json',
		data: {pid: pid},
		success:function(data){
			if(data.status == 0){
				var list = data.data,
						listStr = '';
				$(list).each(function(index, item) {
					listStr += '<option value="'+item.id+'">'+item.name+'</option>';
				});
				$(container).append(listStr);
			}else{
				alertTip(tip);
			}
		},
		error: function(data){
			alertTip(tip);
		}
	})
}

function getEmailCode(email, el){
	afterGetCode(el);
	$.ajax({
		url: '/index.php?r=pc/Code/sendCode',
		type: 'get',
		dataType: 'json',
		data: {email: email},
		success:function(data){
			if (data.status == 0) {
				
			}else{
				alertTip(data.data);
			}
		},
		error:function(daata){

		}
	});
}

function getPhoneCode(param, el){
	
	$.ajax({
		url: '/index.php?r=Login/phoneResetCode',
		type: 'get',
		dataType: 'json',
		data: param,
		success:function(data){
			if (data.status == 1) {alertTip(data.data);getPicCode();return;}
			if (data.status == 2) {alertTip('图形验证码错误');getPicCode();return;}
			afterGetCode(el);	
		},
		error:function(data){
			alertTip(data.data);
		}
	});
}

function afterGetCode(el){
	$(el).addClass('waiting');
		count = 59;
		countInterval = setInterval(function(){
			$(el).text(count-- + 's');
		},1000);

	setTimeout(function(){
		$(el).text('获取验证码').removeClass('waiting');
		clearInterval(countInterval);
	},60000);
}

function cometRequest() {
    $.ajax({
    	async : true,
        type: 'get',
        dataType: 'json',
        url: '/index.php?r=Login/checkLogin',
        data: {}, //80秒后无论结果服务器都返回数据
        success: function (data, textStatus) {
          //从服务器得到数据，显示数据并继续查询
          if (data.status == '0') {
            $('#login-error').text('登录成功!');

            if(data.is_complete == 1){
							window.location.reload()
	
            }else if(data.is_complete == 2){
            	alertTip('请完善资料');
              $('.perfit-info').show().siblings().hide();
              $('.wx-login').hide().siblings('.reg-info-wrap').show();
            }
          } else if(data.status == '1'){
          	if(num<totalnum){
          		num++;
              	checktime = setTimeout(function(){
              		cometRequest();
              	}, 5000);
          	}else{
              if(tnum < 5){
                  loginFunc();
              	tnum++;
              }
          	}
          }
        },
        //Ajax请求超时，继续查询
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            setTimeout(function(){
                		cometRequest();
                	}, 5000);
        }
    });
}

function loginFunc(){
	// 获取省列表
	getArea('#province-select',0,'请求省列表失败，请刷新重试');
	$.ajax({
		url: '/index.php?r=Login/loginQrcode',
		type: 'get',
		dataType: 'json',
		data: {

		},
		success: function(data){
			if(data.status == 0){
				$('.code-img').attr('src',data.data);
			}else{
				alertTip('二维码请求失败 ' + data.data);
			}
		},
		error: function(data){
			alertTip('二维码请求失败 ' + data.data);
		}
	});
	num=1;
	cometRequest();
}

function GetQueryString(name){
     var reg = new RegExp('(^|&)'+ name +'=([^&]*)(&|$)');
     var r = window.location.search.substr(1).match(reg);
     if(r!=null)return  unescape(r[2]); return null;
}