$(function(){
	var num=1,
			totalnum=15,
			tnum = 1,
			checktime,
			regEmail = /^[a-zA-Z0-9_\.-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/,
			regTel = /^1\d{10}$/,
			turnurl = GetQueryString('turnurl') || $('body').attr('url'),
			isreg = GetQueryString('reg'),
			isFpw = GetQueryString('fpw'),
			third = GetQueryString('third'),
			pinless = getCookie('phone_bound'),
			bind_type = GetQueryString('bind_type'),
			countInt;

	var re = /r=login\/ulogin/i;
	var isZhao=$('body').attr('isZhao');
	// 第三方跳转手机绑定
	if (third == 1) {
		var bound_user = $('#bound_user')[0];
	    switch(pinless){
	    	case '1':
	    bound_user.innerHTML = '微信';
	     break;
			default:
				if(bind_type == 1){
					bound_user.innerHTML  = 'QQ';
				}
				if(bind_type == 2){
	    bound_user.innerHTML  = '微博';
				}
	     break;
	    // 	case '2':
	    // bound_user.innerHTML  = 'QQ';		
	    //  break; 
	    // 	case '3':
	    // bound_user.innerHTML  = '微博';
	    //  break;
	    }
	     $('.bound_tex,.long-line,.w_phone').show();
   }

	if (re.test(turnurl)) {
		turnurl = window.location.origin;
	}
	if (getCookie('u') && getCookie('p')) {
		$('#login-username').val(getCookie('u'));
		$('#login-password').val(getCookie('p'));
		$('#save-PW').prop('checked', true);
		$('.checkbox_yes').show();
	}else{
		$('#login-username').val('');
		$('#login-password').val('');
		$('#save-PW').prop('checked', false);
		$('.checkbox_no').show();
	}
	setTimeout(cookieLogin,2000);
	// cookieLogin();
	// loginFunc();

	if(third){
		getThirdData();
		$('#register-nav').removeClass('hide').siblings('div').addClass('hide');
		$('#register-detail').removeClass('hide').siblings('div').addClass('hide');
		$('#scan-after').removeClass('hide').siblings('#scan-before').addClass('hide');
		$('#company-reg, #reg-type').addClass('hide');

	}
	//省市区列表
	getArea('#provinceSelect', 0, '请求省列表失败，请刷新重试');
	$('#provinceSelect').on('change',function(){
		$('#citySelect').empty().append('<option selected disabled>选择市</option>');
    $('#areaSelect').empty().append('<option selected disabled>选择区</option>');
    getArea('#citySelect',$(this).val(),'请求市列表失败，请重试');
	});
	$('#citySelect').on('change',function(){
		$('#areaSelect').empty();
    getArea('#areaSelect',$(this).val(),'请求市列表失败，请重试');
	});
	/*登录部分*/

	//切换登录
	$('#login-nav').on('click', '.title', function(){
		var $this = $(this),
				index = $this.index();
		if (index == 2) {
			$('.qrcode .qrcode-title, #qrcode-login').hide();
			$('#com-login-img').css('display','block');
		} else {
			$('.qrcode .qrcode-title, #qrcode-login').show();
			$('#com-login-img').hide();
		}
		if ($this.hasClass('active')) {
			return;
		};
		$this.addClass('active').siblings('.title').removeClass('active');
		$('#login-btn').attr('login-type',$this.attr('login-type'));
		// $('#login-type').text($this.text());
		$('#to-reg').attr('register-type',$this.attr('login-type'));
	});
	//切换注册
	$('#reg-type').on('click', 'span', function(){
		var $this = $(this),
				regIndex = $this.index();
		if ($this.hasClass('active')) {
			return;
		};
		$this.addClass('active').siblings().removeClass('active');
		if (regIndex == 0) {
			$('#company-reg').hide();
			$('#person-reg').show();
		} else {
			$('#person-reg').hide();
			$('#company-reg').show();
		}
	});
	// 微信扫描登录
	$('.login-wx').click(function(event) {
		$('.login-form').hide();
		$('.wx-login').show().css({
			background: '#fff',
			padding: '95px 73px',
		});
	});
	$('.account-login').click(function(event) {
		$('.login-form').show();
		$('.wx-login').hide();
	});
	// 短信登录
	$('.sms-landing').click(function(event) {
		$('.password-input,.PW-operate,.form-title-text,.sms-landing,#login-btn').hide();
		$('.graphic-verification,.dynamic-cipher,.account-password-login,.registration-agreement,#SMS-landing,#registration-prompts').show();
		$("#login-username").attr('isSMS', 1);
		$("#login-username").attr({'isSMS': 1, 'placeholder': '手机号'});
		phoneVerify($("#login-username").val());
		getPicCode();
	});
	$('.account-password-login').click(function(event) {
		$('.graphic-verification,.dynamic-cipher,.account-password-login,.registration-agreement,#SMS-landing,#registration-prompts').hide();
		$('.password-input,.PW-operate,.form-title-text,.sms-landing,#login-btn').show();
		$("#login-username").attr({'isSMS': 0,'placeholder': '邮箱/手机'});
	});
	$('.perfect-information-close').click(function(event){
    $('.perfect-information').hide();
	})
	// 短信登录确认
	$('#SMS-landing').on('click', function(event) {
  	var phone =$('#login-username').val().trim(),
  	    code = $('#login-pic-code').val().trim(),
				pw = $('#dynamic-cipher').val().trim();
				if (!phone) {
					alertTip('请输入手机号');
					return;
				}
				if (!code) {
					alertTip('请输入图形验证码');
					return;
				}
				if (!pw) {
					alertTip('请输入动态密码');
					return;
				}
				
  	    if(!$('#registration-agreement').prop('checked')){
  	    	alertTip('请勾选同意用户注册协议');
  	    	return false;
  	    }
				if(phone.indexOf(" ")!=-1){
				alertTip("手机号不能有空格");
				return false;
				}
				if(code.indexOf(" ")!=-1){
				alertTip("验证码不能有空格");
				return false;
				}
				if(pw.indexOf(" ")!=-1){
				alertTip("密码不能有空格");
				return false;
				}
				if (!regTel.test(phone)) {
							alertTip('请输入正确手机号');
							return;
						}
  	$.ajax({
			url: '/index.php?r=Login/SMSLogin',
			type: 'post',
			dataType: 'json',
			data: {phone: phone,sms_code: pw},
			success:function(data){
					if (data.status == 0) {
						alertTip(data.data);
						isShowPackageRenewalBox();
						return;
					}
					if (data.status == 1) {
						alertTip(data.data);
						return;
					}
					if (data.status == 2) {
						$('.perfect-information').show();
						return;
					 }
					},
		})		
	});
	// 短信登录弹框确认
	$('.perfect-information-confirm').click(function(event) {
			var	SMS_cipher = $('#SMS-cipher').val().trim(),
		     	pw = $('#dynamic-cipher').val().trim(),
			    phone =$('#login-username').val().trim();
			 if (!SMS_cipher) {
				alertTip('请输入密码');
				return;
			}
			if(SMS_cipher.indexOf(" ")!=-1){
				alertTip("密码不能有空格");
				return;
				}
			 $.ajax({
				url: '/index.php?r=Login/SMSLogin',
				type: 'post',
				dataType: 'json',
				data: {phone: phone,sms_code: pw,passwd:SMS_cipher},
				success:function(data){
						if (data.status == 0) {
							// alertTip(data.data);
							window.location.href= '/regsuccess.html';
						}else{
							alertTip(data.data);
						}
					},
			})		
	});
	// 是否为新号码
	$("#login-username").on('input', function () {

		var _this = $(this),
		isSMS = _this.attr('isSMS') == 1 ? true : false;
		if (!isSMS) {
			return;
		}

		var val = _this.val();
		
		if (val.length == 11) {
			phoneVerify(val);
		}
		});

	//手机号判断
	function phoneVerify(val) {
			$.ajax({
				url: '/index.php?r=Login/doesPhoneReg',
				type: 'post',
				dataType: 'json',
				data: {phone: val},
				success:function(data){
						if (data.status == 0) {

							$('.registration-prompts').show();
						}else{
							$('.registration-prompts').hide();
						}
					},
			})		
		}
	// 获取动态密码
	$('.get-password').on('click', function(){
		var phone =$('#login-username').val().trim(),
	    	$this = $(this),
				code = $('#login-pic-code').val().trim();
				if ($this.hasClass('invalid-btn')) {
					return;
				}
				if (!phone) {
					alertTip('请输入手机号');
					return;
				}
				if (!code) {
					alertTip('请输入图形验证码');
					return;
				}
				if(phone.indexOf(" ")!=-1){
					alertTip("手机号不能有空格");
					return false;
					}
				if(code.indexOf(" ")!=-1){
					alertTip("验证码不能有空格");
					return false;
					}
				if (!regTel.test(phone)) {
					alertTip('请输入正确手机号');
					return;
				}
		$.ajax({
			url: '/index.php?r=Login/SendPhoneCode',
			type: 'post',
			dataType: 'json',
			data: {phone: phone,pic_code: code},
			success:function(data){
					if (data.status == 0) {
						alertTip(data.data);
						var count = 59;
						$this.addClass('invalid-btn');
						var countInterval = setInterval(function(){
							$this.text(count-- +'s后重新获取').css({'background':'#D5D5DE'});
						}, 1000);
						setTimeout(function(){
							clearInterval(countInterval);
							$this.text('重新获取').css({'background':'#3091f2'});
							$this.removeClass('invalid-btn');
						},60000);
					}else{
						alertTip(data.data);
						getPicCode();
					}	  
				},
		})		
	});
	//去注册
	$('#to-reg').on('click', function(){
		var $this = $(this),
				regTpye = $this.attr('register-type');
		$('#register-detail').removeClass('hide').siblings('div').addClass('hide');
		// $('#register-nav').removeClass('hide').siblings().addClass('hide');
		// $('.w_phone,#register-nav,#foot_bottom,.foot_line,.login_phone').show();
		// $('.w_enter').hide();
		$('.w_phone,#login_in,.w_enter,.bound_text,.w_pw,#foot_bottom').hide();
	  $('.w_register,#login_enroll,.w_register,#register-nav,.login_reset,nav,.nav').show();

	});

	if (isreg) {
		$('#to-reg').trigger('click');
	}

	if ( $('body').attr('istm') == 1 ) {
		$('#to-reg').trigger('click');
		$('#reg-type').find('span').eq(1).trigger('click');
	}
  // 注册
  $('#login_enroll').on('click', function(event) {
  	var phone =$('#reg-contact').val().trim(),
  	    code = $('#perfit-pic-code').val().trim(),
				pw = $('#register_pw').val().trim(),
				message = $('#get-complete-code').val().trim();
				if(!phone){
					alertTip('请输入手机号');
					return false;
				}
				if (!regTel.test(phone)) {
					alertTip('请输入正确手机号');
					return;
				}
				if(!pw){
					alertTip('请输入密码');
					return false;
				}
				if(!code){
					alertTip('请输入图形验证码');
					return false;
				}
				if(!message){
					alertTip('请输入短信验证码');
					return false;
				}
  	    if(!$('#register_deal').prop('checked')){
  	    	alertTip('请勾选同意用户注册协议');
  	    	return false;
  	    }
  	if(phone.indexOf(" ")!=-1){
		alertTip("手机号不能有空格");
		return false;
		}
		if(message.indexOf(" ")!=-1){
		alertTip("验证码不能有空格");
		return false;
		}
		if(pw.indexOf(" ")!=-1){
		alertTip("密码不能有空格");
		return false;
		}
		var extension_user_register=GetQueryString('extension_user_register');
		if(extension_user_register){
			$.ajax({
				url: '/index.php?r=Login/UnionRegister',
				type: 'get',
				dataType: 'json',
				data: {phone: phone,code: message,password:pw,extension_user_register:1},
				success:function(data){
						if (data.status != 0) {
							alertTip(data.data);
							return;
						}
					setTimeout(function(){
						
							window.location.href= '/regsuccess.html';
						
						
					});
						},
	
			})		
		}else{
			$.ajax({
				url: '/index.php?r=Login/UnionRegister',
				type: 'get',
				dataType: 'json',
				data: {phone: phone,code: message,password:pw},
				success:function(data){
						if (data.status != 0) {
							alertTip(data.data);
							return;
						}
					setTimeout(function(){
						window.location.href= '/regsuccess.html';
					});
						},
	
			})		
		}
  	
  });
	//忘记密码
	$('#forget-PW').on('click', function(){
		getPicCode();
		// $('#findPW-nav').removeClass('hide').siblings().addClass('hide');
		$('#findPW-detail').removeClass('hide').siblings('div').addClass('hide');
		$('.w_register,#register-nav,.login_tab,.find-password,#foot_bottom,nav,.long-line,.w_pw,.nav').show();
		$('.verify_login,.reset_login,.verify_text,.w_register,.existing_account,.w_enter,.foot_bottom').hide();
		$('#login-reset').css({'background-color': '#eaeaee','color' : '#59607b','border-top' : 'none','border-left' : 'none','border-bottom' : 'none','border-right-color' :'#fff'});
		$('.login_modification').css({'background-color': '#eaeaee','color' : '#59607b','border' : 'none'});
	});
	$('#login-detail').on('keydown', function(event) {
		if (event.keyCode==13){
			if($('#SMS-landing:visible').length){
				$('#SMS-landing').click();
			}else{
				$('#login-btn').click();
		}
		}
	});
	if (isFpw) {
		$('#forget-PW').trigger('click');
	}
	//登录按钮
	$('#login-btn').on('click', function(){
		var that = $(this);

		if (that.hasClass('malicious_click')) {
			return
		};
		var username = $('#login-username').val().trim(),
				password = $('#login-password').val().trim(),
			  login_pic_code = $('#login-pic-code').val().trim();          

		if(username.length==0 || password.length==0){
			alertTip('用户名/密码不能为空');
			return;
		}
		if (! (regTel.test(username) || regEmail.test(username)) ) {
					alertTip('请输入正确手机号或邮箱');
					return;
				}
		if(username.indexOf(" ")!=-1){
		alertTip("手机号不能有空格");
		return false;
		}
		if(password.indexOf(" ")!=-1){
		alertTip("密码不能有空格");
		return false;
		}
		if(login_pic_code.indexOf(" ")!=-1){
		alertTip("验证码不能有空格");
		return false;
		}
		// var passwordmd5 = password;
    var passwordmd5 = $.md5($('#login-password').val());


		$('#save-PW').prop('checked') ? rememberPw(username, password) : deletePw();
		that.addClass('malicious_click');
                // alertTip("正在登录...");
		$.ajax({
			url:'/index.php?r=Login/login',
			type:'post',
			data:{
				username: username,
				password: password,
				pic_code: login_pic_code,
				human_click:1,
			},
			dataType:'json',
			success:function(data){
				that.removeClass('malicious_click');
				switch(data.status) {
					case 0:
						if($('#save-PW').prop('checked')){
	        				saveUsername(username,passwordmd5);
	        			}
                        if (data.is_new == 1) {
							window.location.href = '/index.php?r=pc/IndexNew/showUserInfo&is_new=' + data.is_new + '#accountSafe';
						} else {
							isShowPackageRenewalBox();
							// window.location.href = turnurl
						}		
                        break;
					case 1:
              getPicCode();
              alertTip(data.data);

						break;
					case 2:
						alertTip('您未绑定微信，请扫描二维码绑定');
						$('#qrcode-login').attr('src',data.data);
						$('#scan-before img').attr('src',data.data);
						break;
				}
				if(data.need_pic_code == 1){
					$('.graphic-verification').show();
					getPicCode();
				}
			},
			error:function(data){

			}
		});
	});
  $('.pw-S-F').on('click', function(event) {
  	if ($('#save-PW').prop('checked')) {
  		 $('.checkbox_yes').show();
  	}else{
  		 $('.checkbox_yes').hide();
  	}
  	
  });
	// 去登录
	$('#to-login').on('click', function(){
		$('#login-detail').removeClass('hide').siblings('div').addClass('hide');
		$('#login-nav, #reg-type').removeClass('hide').siblings().addClass('hide');
		$('#login-nav').children('.title').eq(0).addClass('active').siblings().removeClass('active');
		$('#scan-after').addClass('hide').siblings('#scan-before').removeClass('hide');
		$('#register-nav,.w_register,.login_tab,.find-password,.w_phone,nav,.long-line,.reset_login,.verify_text').hide();
		$('.w_enter,#foot_bottom,.fill_in_login,.foot_line,#foot_bottom').show();

	});


	// 注册
	// $('.get-complete-code').on('click', function(){
	// 	var _this = $(this);
	// 	if (_this.hasClass('waiting')) {return;}
	// 	if (!$('#reg-contact').val()){
	// 		alertTip('请输入手机号');
	// 		$('#reg-contact').focus()
	// 		return;
	// 	}
	// 	var code = $('#perfit-pic-code').val();
	// 	if (!code) {
	// 		alertTip('请输入验证码');
	// 		return;
	// 	}
	// 	$.ajax({
	// 		url: '/index.php?r=Login/phoneResetCode',
	// 		type: 'get',
	// 		dataType: 'json',
	// 		data: {phone:$('#reg-contact').val(), allow:1, pic_code: code},
	// 		success:function(data){
	// 			if (data.status != 0) {alertTip(data.data);return;}
	// 			afterGetCode(_this);
	// 		},
	// 		error:function(data){
	// 			alertTip(data.data);
	// 		}
	// 	});
	// })

	// 手机绑定
	$('#login_in').on('click', function(){
		var username = $('#reg-contact').val().trim(),
				password = $('#register_pw').val().trim(),
				// inviteCode = $('#get-complete-code').val(),
				code = $('#get-complete-code').val().trim(),
				param;
		if (!username) {
			alertTip('请输入手机号');
			return;
		}
		if (!code) {
			alertTip('请输入验证码');
			$('#complete-code').focus();
			return;
		}
		if (!regTel.test(username)) {
			alertTip('请输入正确的手机号');
			return;
		}
		if(username.indexOf(" ")!=-1){
		alertTip("手机号不能有空格");
		return false;
		}
		if(password.indexOf(" ")!=-1){
		alertTip("密码不能有空格");
		return false;
		}
		if(code.indexOf(" ")!=-1){
		alertTip("验证码不能有空格");
		return false;
		}
		if(!$('#register_deal').prop('checked')){
  	    	alertTip('请勾选同意用户注册协议')
  	    	return false;
  	    }
		param = {
			username:username,
			password:password,
			// invite_code: inviteCode,
			code:code,
			validate:1,
		}
		$.ajax({
			url:'/index.php?r=Usercenter/saveInfo',
			type:'post',
			data:param,
			dataType:'json',
			success:function(data){
				if (data.status !== 0) {
					alertTip(data.data);
					return;
				}
				alertTip('注册成功');
				setTimeout(function(){
					window.location.href= turnurl;
				}, 1500);
			}
		})
	// 	$('.w_phone,#login_in').hide();
	// $('.w_register,#login_enroll').show();
	});
// 手机绑定获取验证码
$('#pic-code').on('click', function(event) {
	getBoundPhoneCode($(this));
});
// 密码显示/隐藏
$('.login_corner_mark').mouseover(function(event) {
	$("#register_pw").attr('type','text');
});
$('.login_corner_mark').mouseout(function(event) {
	$("#register_pw").attr('type','password');
});
	//企业注册
	$('#reg-com-btn').on('click', function(){
		var pw1 = $('#reg-com-pw1').val(),
				code = $('#reg-code').val(),
				pw2 = $('#reg-com-pw2').val(),
				comName = $('#reg-com-name').val(),
				tel = $('#reg-com-tel').val(),
				type = $('#companyType').val(),
				voucherCode = $('#exchangeCode').val(),
				region = $('#areaSelect').val();
		if (!regTel.test(tel)) {
			alertTip('请输入正确的联系方式');
			$('#reg-com-tel').css('border','1px solid red').focus();
			return;
		}
		if (!code){
			alertTip('请输入验证码');
			return;
		}
		if (pw1.length < 6 || pw1.length > 16) {
			alertTip('请输入6-16位的密码');
			$('#reg-com-pw1').css('border','1px solid red').focus();
			return;
		}
		if (pw1 != pw2) {
			alertTip('请输入确认密码');
			$('#reg-com-pw1').css('border','1px solid red').focus();
			return;
		}
		if (!comName) {
			alertTip('请输入企业名称');
			$('#reg-com-name').css('border','1px solid red').focus();
			return;
		}
		if (!type) {
			alertTip('请选择行业');
			return;
		}
		if (!region) {
			alertTip('请选择城市');
			return;
		}
		if ($('body').attr('istm') == 1 && !voucherCode) {
			alertTip('请输入兑换码');
			return;
		}
		$.ajax({
			url:'/index.php?r=Login/RegisterCompany',
			type:'post',
			data:{
				password : pw1,
				phone : tel,
				name : comName,
				type : type,
				code:code,
				region : region,
				invite_code: $('#inv-code').val(),
				voucherCode:voucherCode,
				share_reg_user_token : GetQueryString('share_reg_user_token'),
			},
			dataType:'json',
			success:function(data){
				if (data.status != 0) {
					alertTip(data.data);
					return;
				}
				alertTip('注册成功');
				window.location.href = turnurl;
			},
			error:function(data){
				alertTip(data.data);
			}
		})
	});
	// $('.get-reg-code').on('click', function(){
	// 	var _this = $(this);
	// 	if (_this.hasClass('waiting')) {return;}
	// 	if (!$('#reg-com-tel').val()){
	// 		alertTip('请输入手机号');
	// 		$('#reg-com-tel').focus()
	// 		return;
	// 	}
	// 	var code = $('#pic-code').val();
	// 	if (!code) {
	// 		alertTip('请输入验证码');
	// 		return;
	// 	}
	// 	$.ajax({
	// 		url: '/index.php?r=Login/phoneResetCode',
	// 		type: 'get',
	// 		dataType: 'json',
	// 		async: false,
	// 		data: {phone:$('#reg-com-tel').val(), allow:1, pic_code: code},
	// 		success:function(data){
	// 			if (data.status != 0) {
	// 				alertTip(data.data);
	// 				if(data.need_pic_code == 1){
 //          $('.register_verify').show();
	// 					}
	// 				return;
	// 			}
	// 			afterGetCode(_this);
	// 		},
	// 		error:function(data){
	// 			alertTip(data.data);
	// 		}
	// 	});
	// })
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
	// 兑换码验证
	$('#voucherCode').on('click', function(){
		checkVoucherCode();
	});
	/*注册部分 end*/

	/*******************************/

	/*找回密码部分*/
	//切换找回方式
	$('#change-type').on('click', function(){
		var $this = $(this),
				type = $('#findPW-detail').attr('type');
		$('#findPW-detail').find('input').val('');
		if (type == 'phone') {
			$('.getpic-code').hide();
			$('#findPW-detail').attr('type','email');
			$('#find-type').text('邮箱找回');
			$this.text('通过手机找回');
			$('#email-phone').attr('placeholder','请输入邮箱/手机');
		} else if (type == 'email') {
			$('.getpic-code').show();
			$('#findPW-detail').attr('type','phone');
			$('#find-type').text('手机找回');
			$this.text('通过邮箱找回');
			$('#email-phone').attr('placeholder','请输入邮箱/手机');
		}
	});
  $('.package-renewal-box').on('click','.close-renewal-box',function(){
    if($('#notRemind').prop('checked')){
      var data = '';
      if($('.package-renewal-box').attr('data-day') <= 7 && $('.package-renewal-box').attr('data-day') >= 0){
        data = 65536;
      }else if($('.package-renewal-box').attr('data-day') == -1){
        data = 131072;
	  }else if($('.package-renewal-box').attr('data-day') == -2){
		data = 262144;
      }
      $.ajax({
        url: '/index.php?r=pc/IndexNew/AddPackageExpireRemindMark',
        type: 'post',
        data: {
          mark_id: data
        },
        dataType: 'json',
        success: function(data){
          if(data.status != 0){
            alertTip(data.data);
            return;
          }
          window.location.href = turnurl;
        }
      })
    }else{
      window.location.href = turnurl;
    }
    $('.package-renewal-box').hide();
  }).on('click','.package-renewal-btn',function(){
    window.open ( "/vip/" , "_blank") ;
  })
	// 返回登录或注册
	$('#findPW-nav').on('click', '.title', function(){
		var $this = $(this),
				index = $this.index();
		if(index == 0){
			$('#login-nav').removeClass('hide').siblings().addClass('hide');
			$('#login-detail').removeClass('hide').siblings('div').addClass('hide');
		} else {
			$('#register-nav').removeClass('hide').siblings().addClass('hide');
			$('#register-detail').removeClass('hide').siblings('div').addClass('hide');
		}
	});
	//获取手机/邮箱验证码
	$('#get-code').on('click', function(){
		the_verification($(this));	
		
		// var $this = $(this),
		// 		$type = $('.login_phone select').val(),
		// 		email = $('#email-phone').val().trim(),
		// 		code = $('#findby-pic-code').val(),
		// 		countTime = 59;
		// switch($type) {
		// 	case '1':
		// 		if(email.length==0){
		// 			alertTip('请输入您的注册邮箱账号');
		// 			return;
		// 		}
		// 		if (!regEmail.test(email)) {
		// 			alertTip('请输入正确邮箱');
		// 			return;
		// 		}
		// 		$.ajax({
		// 			url:'/index.php?r=Login/NewEmailCode',
		// 			type:'get',
		// 			data:{email:email,reset_flag:1,pic_code:3},
		// 			dataType:'json',
		// 			success:function(data){
		// 				if (data.status == 0) {
		// 					$this.addClass('non');
		// 					var countInt = setInterval(function(){
		// 						$this.text(countTime+'s后重新获取');
		// 						countTime--;
		// 					},1000);
		// 					setTimeout(function(){
		// 						clearInterval(countInt);
		// 						$this.removeClass('non');
		// 						$this.text('获取验证码');
		// 					}, 60000);
		// 				}
		// 			},
		// 		})
		// 		break;
		// 	case '0':
		// 		if(email.length==0){
		// 			alertTip('请输入您的注册手机账号');
		// 			return;
		// 		}
		// 		if (!regTel.test(email)) {
		// 			alertTip('请输入正确手机号');
		// 			return;
		// 		}
		// 		if (!code) {
		// 			alertTip('请输入验证码');
		// 			return;
		// 		}
		// 		$.ajax({
		// 			url:'/index.php?r=Login/phoneResetCode',
		// 			type:'get',
		// 			data:{phone:email, pic_code: code,},
		// 			dataType:'json',
		// 			success:function(data){
		// 				if (data.status == 0) {
		// 					$this.addClass('non');
		// 					countInt = setInterval(function(){
		// 						$this.text(countTime+'s后重新获取');
		// 						countTime--;
		// 					},1000);
		// 					setTimeout(function(){
		// 						clearInterval(countInt);
		// 						$this.removeClass('non');
		// 						$this.text('获取验证码');
		// 					}, 60000);
		// 				}else if(data.status == 2){
		// 					alertTip('图形验证码错误');
		// 					$('#findby-pic-code');
		// 					getPicCode();
		// 				}
		// 			},
		// 		});
		// 		break;
		// }
	});

  function isShowPackageRenewalBox(){
    $.ajax({
      url: '/index.php?r=pc/IndexNew/GetPackageExpireRemind',
      type: 'post',
      dataType: 'json',
      success: function(data){
        if(data.status == 0){
          if(data.data){
            $('.package-renewal-box').show();
            var packageVersion = {
              1: '个人VIP版',
              2: '企业基础版',
              3: '企业高级版',
              4: '企业尊享版',
              5: '旗舰版'
            },
            packageName = '';
            remainDay = data.data.day;
            if(data.data.vip_group == 0){
              packageName = '套餐已过期';
            }else{
              packageName += packageVersion[data.data.vip_group] + '套餐';
              if((remainDay == -1) || (remainDay == 0)){
                packageName += '今天过期，';
              }else if(remainDay == -2){
	        packageName += '已过期，';  
              }else {
                packageName += remainDay + '天到期，'
              }
            }
            $('.package-renewal-box').attr('data-day',remainDay);
			      $('.package-renewal-box .package-version').text(packageName);
          }else{
            window.location.href = turnurl
          }
        }
      }
    })
  }
	// 验证手机验证码
  function verifyPhoneCode() {
		var phone = $('#email-phone').val().trim();
		    code  = $('#code').val().trim();
		if(!code){
					alertTip('请输入验证码');
					return;
				}
	$.ajax({
					url:'/index.php?r=Login/VerifyNewPhone',
					type:'get',
					data:{phone:phone,reset_flag:1,code:code},
					dataType:'json',
					success:function(data){
					if (data.status != 0) {
						alertTip(data.data);
						return;
					}
							// $this.addClass('non');
							// var countInt = setInterval(function(){
							// 	$this.text(countTime+'s后重新获取');
							// 	countTime--;
							// },1000);
							// setTimeout(function(){
							// 	clearInterval(countInt);
							// 	$this.removeClass('non');
							// 	$this.text('获取验证码');
							// }, 60000);
			 $('.login_reset,.reset_login').show();
		   $('.fill_in_login,.verify_login').hide();
					},
				})
}
// 验证邮箱验证码
function verifyEmailCode() {
		var email = $('#email-phone').val().trim();
		    code  = $('#code').val().trim();
		if(!code){
					alertTip('请输入验证码');
					return;
				}
	$.ajax({
					url:'/index.php?r=Login/VerifyNewEmail',
					type:'get',
					data:{email:email,reset_flag:1,code:code},
					dataType:'json',
					success:function(data){
					if (data.status != 0) {
						alertTip(data.data);
						return;
					}
							// $this.addClass('non');
							// var countInt = setInterval(function(){
							// 	$this.text(countTime+'s后重新获取');
							// 	countTime--;
							// },1000);
							// setTimeout(function(){
							// 	clearInterval(countInt);
							// 	$this.removeClass('non');
							// 	$this.text('获取验证码');
							// }, 60000);
			 $('.login_reset,.reset_login').show();
		   $('.fill_in_login,.verify_login').hide();
					},
				})
}
	// 填写账号
	$('#find-btn').on('click',function(event) {
		var username = $('#user-phone').val().trim();
		     code = $('#code').val().trim();
		 if(username.length==0){
			alertTip('请输入手机号');
			return;
		}
		if (code.length==0) {
			alertTip('请输入验证码');
			return;
		}
		if(username.indexOf(" ")!=-1){
		alertTip("手机号不能有空格");
		return false;
		}
		if(code.indexOf(" ")!=-1){
		alertTip("验证码不能有空格");
		return false;
		}
		$.ajax({
			url: '/index.php?r=Login/UnionResetPasswd',
			type: 'get',
			dataType: 'json',
			data: {username: username,code: code,step:0},
			success:function(data){
					if (data.status != 0) {
						alertTip(data.data);
						return;
					}
			$('.fill_in_login,.find-password').hide();
		  $('.login_verify,.reset_login,.verify_login,.login_reset').show();
		  $('#login-reset').css({'background-color': '#3091f2','color': "#fff"});
		  $('.login_fill_in').css({'border-bottom': 'none','border-left': 'none','border-top': 'none','border-right-color': '#fff'});
					},

		})	
			
	});
	//确认找回
	// $('#find-btn').on('click', function(){
	// 	var type = $('#findPW-detail').attr('type'),
	// 			email = $('#email-phone').val().trim(),
	// 			code = $('#code').val().trim(),
	// 			newPW1 = $('#new-pw1').val(),
	// 			newPW2 = $('#new-pw2').val();
	// 	if(code.length==0){
	// 		alertTip('请输入验证码');
	// 		return;
	// 	}
	// 	if (newPW1.length < 6 || newPW1.length > 16) {
	// 		alertTip('请输入6-16位的密码');
	// 		return;
	// 	}
	// 	if(newPW1 != newPW2){
	// 		alertTip('两次输入的密码不一致');
	// 		return;
	// 	}
	// 	switch(type) {
	// 		case 'email':
	// 			$.ajax({
	// 				url:'/index.php?r=pc/Code/ModifyPasswordByCode',
	// 				type:'get',
	// 				data:{email:email,code:code,password:newPW2},
	// 				dataType:'json',
	// 				success:function(data){
	// 					if (data.status != 0) {
	// 						alertTip(data.data);
	// 						return;
	// 					}
	// 					alertTip('修改成功');
	// 					setTimeout(function(){
	// 						$('#findPW-nav').find('.title').eq(0).trigger('click');
	// 					},1500)
	// 				},
	// 				error:function(){
	// 					alertTip(data.data);
	// 					return;
	// 				}
	// 			})
	// 			break;
	// 		case 'phone':
	// 			$.ajax({
	// 				url:'/index.php?r=Login/PhoneResetPassWord',
	// 				type:'get',
	// 				data:{
	// 					phone:email,
	// 					code:code,
	// 					password:newPW2
	// 				},
	// 				dataType:'json',
	// 				success:function(data){
	// 					if (data.status != 0) {
	// 						alertTip(data.data);
	// 						return;
	// 					}
	// 					alertTip('修改成功');
	// 					setTimeout(function(){
	// 						$('#findPW-nav').find('.title').eq(0).trigger('click');
	// 					},1500)
	// 				},
	// 				error:function(){
	// 					alertTip('修改失败'+data.data);
	// 					return;
	// 				}
	// 			})
	// 			break;
	// 	}
	// });
	// $('.login_phone select').on('change',function(event) {

	// 	var index=$(this).val();
	// 	if(index=='0'){
 //       $('.login_phone input').attr("placeholder","请输入手机号");
 //       $('.login_phone select').css({background: 'url(//cdn.jisuapp.cn/static/login/images/login_phone.png) no-repeat','background-position': '6px 8px'});
 //       $('.email_text').hide();
	// 	}else if(index=='1'){
	// 		$('.login_phone input').attr("placeholder","请输入邮箱");
	// 		$('.login_phone select').css({background: 'url(//cdn.jisuapp.cn/static/login/images/login_mail.png) no-repeat','background-position': '6px 8px'});
	// 		$('.email_text').show();
	// 	}
	// })
	// 清空input
			$(".login_eliminate").click(function(){
				$(this).prev("input").val("");
				$(this).hide();
			})
      $("input").keyup(function(){
				var val = $(this).val();
				if(val.length>0){
					$(this).next(".login_eliminate").show();
				}else{
					$(this).next(".login_eliminate").hide();
				}
			})
	// 身份验证
	// $('#find_verify_btn').on('click', function(event) {
	// 	 if($('.login_phone select').val() == "0"){
	// 	 verifyPhoneCode();
	// 	}else if($('.login_phone select').val() == "1"){
	// 	 verifyEmailCode();
	// 	}
	// });
	// 密码重置
	$('#find_reset_btn').on('click', function(event) {
		var new_pw1 = $('#new-pw1').val().trim(),
		    new_pw2 = $('#new-pw2').val().trim(),
		    username = $('#user-phone').val().trim(),
		    code = $('#code').val().trim();
		    graph_code = $('#perfit-pic-code').val().trim();

		$('#new-pw1, #new-pw2').attr('type', 'text').val('');
		if (username.indexOf(" ") != -1) {
			alertTip("手机号不能有空格");
			return false;
		}
		if (new_pw1.indexOf(" ") != -1) {
			alertTip("密码不能有空格");
			return false;
		}
		if (new_pw2.indexOf(" ") != -1) {
			alertTip("密码不能有空格");
			return false;
		}
		$.ajax({
			url: '/index.php?r=Login/UnionResetPasswd',
			type: 'get',
			dataType: 'json',
			data: {
				username: username,
				passwd: new_pw1,
				passwd_again: new_pw2,
				code: code,
				step: 1,
				'pic_code': graph_code
			},
			success: function(data) {
				if (data.status != 0) {
					alertTip(data.data);
					return;
				}
				$('.verify_login,.reset_login').hide();
				$('.login_modification').css({
					'border-bottom': 'none',
					'border-left': 'none',
					'border-top': 'none',
					'background-color': '#3091f2',
					'color': '#fff'
				});
				$('.modification_login,.verify_text').show();
				setTimeout(function() {
					window.location = '/index.php?r=login/Ulogin';
				}, 3000);
			},

		})

	});

	getPicCode();
	$('.getPicCode').on('click', getPicCode);
	function getPicCode(){
		$('.pic-code').attr('src', '/index.php?r=Login/GetNewIdentifyCode&i=' + parseInt(Math.random() * 10000000))
	}
	/*找回密码部分 end*/
	// 完善资料弹窗
	$('#perfect-for-vip').on('click', '.cancel-btn', function(){
		$('#perfect-for-vip').hide();
	}).on('click', '.get-tel-code', function(){
		var bindPhone = $(this).siblings('input').val(),
				$this = $(this);
		if ($this.hasClass('invalid-btn')) {
			return;
		}
		if (bindPhone.length == 0) {
			alertTip('请输入要绑定的手机号');
			return;
		}
		if (!regTel.test(bindPhone)) {
			alertTip('请输入正确手机号');
			return;
		}
		getPhoneCode(bindPhone, $this);
	}).on('click', '.sure-btn', function(){
		var bindPhone = $('#bindphone').val(),
				bindqq = $('#bindqq').val(),
				phoneCode = $('#phone-code').val();
		if (phoneCode.length==0) {
			alertTip('请输入验证码');
			return;
		}
		if (condition) {
			expression
		}
		bindPhone (bindPhone, phoneCode, bindqq)
	});


	function rememberPw(u, p){
		setCookie('u' , u , 24 * 7);
		setCookie('p' , p , 24 * 7);
	}
	function deletePw(){
		setCookie('u','',0);
		setCookie('p','',0);
	}
	// 获取手机验证码
	function getPhoneCode() {
		var phone = $('#email-phone').val().trim();
		if(!phone){
					alertTip('请输入您的注册手机账号');
					return;
				}
				if (!regTel.test(phone)) {
					alertTip('请输入正确手机号');
					return;
				}
				// if (!code) {
				// 	alertTip('请输入验证码');
				// 	return;
				// }
		$.ajax({
			url:'/index.php?r=login/NewPhoneCode',
			type:'get',
			data:{phone: phone,reset_flag:1,pic_code: ''},
			dataType:'json',
			success:function(data){
				if(data.status == 0){
					alertTip('发送成功');
				// 	var count = 59;
				// 	$this.addClass('invalid-btn');
				// 	var countInterval = setInterval(function(){
				// 		$this.text(count-- +'s后重新获取').css({'background':'#c6c6c6'});
				// 	}, 1000);
				// 	setTimeout(function(){
				// 		clearInterval(countInterval);
				// 		$this.text('点此免费获得').css({'background':'#93eb34'});
				// 		$this.removeClass('invalid-btn');
				// 	},60000);
				// }else{
				// 	$this.removeClass('invalid-btn');
				// 	alertTip(data.data);
				}
			},
			error:function(data){
				$this.removeClass('invalid-btn');
				alertTip('请输入正确的手机号码');
			}
		});
	}
	// 获取绑定手机验证码
	function getBoundPhoneCode($this) {
		var phone = $('#reg-contact').val().trim(),
		    code = $('#perfit-pic-code').val().trim();
				if ($this.hasClass('invalid-btn')) {
					return;
				}
		if(!phone){
					alertTip('请输入手机号');
					return;
				}
				if (!regTel.test(phone)) {
					alertTip('请输入正确手机号');
					return;
				}
				// if (!code) {
				// 	alertTip('请输入验证码');
				// 	return;
				// }
		$.ajax({
			url:'/index.php?r=Login/PhoneResetCode',
			type:'get',
			data:{phone: phone,allow:1,pic_code: code},
			dataType:'json',
			success:function(data){
				if(data.status == 0){
					alertTip(data.data);
					var count = 59;
					$this.addClass('invalid-btn');
					var countInterval = setInterval(function(){
						$this.text(count-- +'s后重新获取').css({'background':'#D5D5DE'});
					}, 1000);
					setTimeout(function(){
						clearInterval(countInterval);
						$this.text('重新获取').css({'background':'#3091f2'});
						$this.removeClass('invalid-btn');
					},60000);
				// }else{
				// 	$this.removeClass('invalid-btn');
				// 	alertTip(data.data);
				}else if(data.status  && data.need_pic_code == 1){
					alertTip(data.data);
					 // $('.register_verify').show();
					 getPicCode();
				}else{
          getPicCode();
					alertTip(data.data);
				}

			},
			error:function(data){
				$this.removeClass('invalid-btn');
				alertTip('请输入正确的手机号码');
			}
		});
	}
	// 获取邮箱验证码
	function getEmailCode() {
		var email = $('#email-phone').val().trim();
		if(email.length==0){
					alertTip('请输入您的注册邮箱账号');
					return;
				}
				if (!regEmail.test(email)) {
					alertTip('请输入正确邮箱');
					return;
				}
	$.ajax({
					url:'/index.php?r=Login/NewEmailCode',
					type:'get',
					data:{email:email,reset_flag:1,pic_code:''},
					dataType:'json',
					success:function(data){
						if (data.status == 0) {
							// $this.addClass('non');
							// var countInt = setInterval(function(){
							// 	$this.text(countTime+'s后重新获取');
							// 	countTime--;
							// },1000);
							// setTimeout(function(){
							// 	clearInterval(countInt);
							// 	$this.removeClass('non');
							// 	$this.text('获取验证码');
							// }, 60000);
						}
					},
				})
}
// 账号验证
function the_verification($this){
	var username = $('#user-phone').val().trim(),
	    code = $('#verification_code').val().trim();
			if ($this.hasClass('invalid-btn')) {
				return;
			}
	$.ajax({
		url: '/index.php?r=Login/ResetPasswdSendCode',
		type: 'get',
		dataType: 'json',
		data: {username:username,pic_code:code},
		success:function(data){
     if (data.status == 0) {
     	alertTip(data.data);
     	var count = 59;
					$this.addClass('invalid-btn');
					var countInterval = setInterval(function(){
						$this.text(count-- +'s后重新获取').css({'background':'#D5D5DE'});
					}, 1000);
					setTimeout(function(){
						clearInterval(countInterval);
						$this.text('重新获取').css({'background':'#3091f2'});
						$this.removeClass('invalid-btn');
					},60000);
				}else{
					alertTip(data.data);
          getPicCode();
     }
		}
	})
	
}
	// 确认绑定手机 
	function bindPhone (phone, code, qq){
		$.ajax({
			url:'/index.php?r=Login/CompleteInfo',
			type:'post',
			data:{phone: phone ,code: code, qq:qq},
			dataType:'json',
			success:function(data){
				if(data.status == 0){
					alertTip('绑定成功');
				}else{
					alertTip('绑定成功'+data.data);
				}
			},
			error:function(data){
				alertTip(data.data);
			}
		});
	}
	// 兑换码
	function checkVoucherCode (){
		var vouchercode = $('#exchangeCode').val();
		$.ajax({
			url:'/index.php?r=pc/TencentMarket/QueryVoucherCode',
			data:{voucherCode:vouchercode},
			dataType:'json',
			type:'post',
			success:function(data){
				if (data.status != 0) {
					alertTip(data.data)
					return;
				}
				alertTip(data.data);
			},
			error:function(data){

			}
		})
	}
	// 第三方资料获取 
	function getThirdData(){
		$.ajax({
			url:'/index.php?r=Usercenter/getInfo',
			type:'post',
			data:{},
			dataType:'json',
			success:function(data){
				if (data.status == 0) {
					$('#reg-contact').val(data.data.phone);
				}
			}
		})
	}

	function saveUsername(un , pw , type){
		setCookie('pc_un' , un , 24 * 7);
		setCookie('pc_pw' , pw , 24 * 7);
		// setCookie('pc_lgtype' , type , 24 * 3);
	}

	function loginFunc(){
		$.ajax({
			url: '/index.php?r=Login/loginQrcode',
			type: 'get',
			dataType: 'json',
			data: {},
			success: function(data){
				if(data.status == 0){
					$('.code-img').attr('src',data.data);
					$('#qrcode-login').attr('src',data.data);
					$('#scan-before img').attr('src',data.data);
				}else{
					alertTip('二维码请求失败 ' + data.data);
				}
			},
			error: function(data){
				alertTip('二维码请求失败 ' + data.data);
			}
		});
		num = 1;
		cometRequest();
  }

  function cometRequest(){
    $.ajax({
    	async : true,
      type: 'get',
      dataType: 'json',
      url: '/index.php?r=Login/checkLogin',
      data: {}, //80秒后无论结果服务器都返回数据
      success: function (data, textStatus) {
        //从服务器得到数据，显示数据并继续查询
        if (data.status == 0) {
          if(data.is_complete == 1){
						window.location.href= turnurl;						
          }else if(data.is_complete == 2){
          	$('#reg-contact').val(data.username);
          	// $('#reg-type').hide();
          	// $('#scan-after').removeClass('hide').siblings('div').addClass('hide');
          	// $('#to-reg').trigger('click');
          	$('#to-reg').on('click', function(event) {
            $('#login_enroll,.w_enter,#login_enroll').hide();
	          $('.w_register,.w_register,#foot_bottom,#register-nav,.w_phone').show();
          	});
          }
        } else if(data.status == 1){
        	if(num < totalnum){
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
	
	// container 根据pid获取列表存放的select;  pid ; tip 请求失败提示; targetPid（可选）当有值时 表示有初始值
	function getArea(container,pid,tip,targetPid){
		$.ajax({
			url:'/index.php?r=Region/getRegionList',
			type:'get',
			data:{pid: pid},
			dataType:'json',
			success:function(data){
				if(data.status == 0){
					var list = data.data,
							listStr = '';
					$(list).each(function(index, item) {
						listStr += '<option value="'+item.id+'">'+item.name+'</option>';
					});
					$(container).append(listStr);
					if(targetPid){
						$(container).find('option[value="'+targetPid+'"]').prop('selected', true);
					}
				}else{
					alertTip(tip);
				}
			},
			error:function(data){
				alertTip(tip);
			}
		});
	}

	function cookieLogin(){
		var username = getCookie("pc_un"),
			password = getCookie("pc_pw"),
			// type = getCookie("pc_lgtype"),
			url = ['/index.php?r=Login/login','/index.php?r=Login/LoginCompany'];
		if (!username || !password  || $("#automatic_login").attr("is_login") == 2 || $("#automatic_login").attr("is_login") == 1) {
			return false;
		}
		$.ajax({
			url:'/index.php?r=Login/login',
			type:'post',
			data:{username: username,password: password,cookie_login:1,human_click:0},
			dataType:'json',
			success:function(data){
				if(data.status == 0){
                    var pathname = window.location.href;
                    var re = /r=login\/ulogin/i;
                    if (!re.test(pathname)) { // 非登录页面直接刷新
                    	window.location.reload();
					} else {
                        window.location.href = turnurl;
					}
				}
			}
				
		});
	}

	function GetQueryString(name){
		 var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
		 var r = window.location.search.substr(1).match(reg);
		 if(r!=null){
		 	return  unescape(r[2]);
		 }else{
		 	return null;
		 }
	}

	$.tooltip = function(ops){
		var ops = $.extend({
		        html    : '',
		        delay   : 2000,
		        callback: null
		    }, ops);
	  var obj = null,
	      text= ops.html,
	      html= '<div id="tool_tip" style="position:fixed; max-width:300px; z-index:9999999; top:0;'
	          + ' left:0; opacity:1; padding:40px 60px; background:rgba(0,0,0,0.7);'
	          + 'color:#fff; border-radius:8px; text-align:center; font-size:18px; font-weight:bold">'
	          + text +'</div>';

	  $('#tool_tip').remove();
	  obj = $(html).appendTo('body');
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
	};
	function alertTip(html, callback, delay) {
    $.tooltip({
      'html'    : html || '',
      'delay'   : $.isNumeric(callback) ? callback : (delay ? delay : 1500),
      'callback': $.isFunction(callback) ? callback : null
    });
	}

});