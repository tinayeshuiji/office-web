 function IsNum(e) {
   var keynum = 0,
     keychar,
     numcheck;
   if (window.event) // IE
   {
     keynum = e.keyCode;
   } else if (e.which) // Netscape/Firefox/Opera
   {
     keynum = e.which || e.keyCode;
   }
   if ([0, 8, 46].indexOf(keynum) > -1) {
     return true;
   }
   keychar = String.fromCharCode(keynum);
   numcheck = /\d/;
   return numcheck.test(keychar);
 }
 $(function() {
   document.getElementById('back-top').onclick = function (){
      $("html,body").animate({scrollTop:0}, 500);
    }
    $('#senior').on('click', function(event) {
      $('#advanced-container').show()
    });
  $('#slides').slidesjs({
    width: 218,
    height: 387,
    navigation:{
      active: false,
      effect: 'slide'
    },
    pagination:{
      active:true,
      effect: 'slide'
    },
    play:{
      active: false,
      effect: 'fade',
      interval: 5000,
      auto: true,
      swap: false,
      pauseOnHover: false,
      restartDelay: 2500
    },
    effect:{
      slide:{speed: 500},
      fade: {
        speed: 500,
          // [number] Speed in milliseconds of the fade animation.
        crossfade: true
          // [boolean] Cross-fade the transition.
      }
    }
  })
  
   setTimeout(function() {
     $("#line_2").addClass("line_2");
   }, 1000);
   setTimeout(function() {
     $("#line_3").addClass("line_3");
   }, 2000);
   /*--------------区域代理和个人代理的切换-------------- start*/
   // $(".area_personal_tabs").on("click", ".area_tabs", function() {
   //   $(this).addClass("active").find("span").css({
   //     "color": "#FFF"
   //   });
   //   $(".personal_tabs").removeClass("active").find("span").css({
   //     "color": "#3091F2"
   //   });
   //   $(".area_agency_show").show();
   //   $(".personal_agency_show").hide();
   //   $(".personal-not-active-img").show();
   //   $(".personal-active-img").hide();
   //   $(".area-active-img").show();
   //   $(".area-not-active-img").hide();
   //   $(".immediate_join_btn").attr("href", "#immediate_join_us");
   // }).on("click", ".personal_tabs", function() {
   //   $(this).addClass("active").find("span").css({
   //     "color": "#FFF"
   //   });
   //   $(".area_tabs").removeClass("active").find("span").css({
   //     "color": "#3091F2"
   //   });
   //   $(".area_agency_show").hide();
   //   $(".personal_agency_show").show();
   //   $(".personal-not-active-img").hide();
   //   $(".personal-active-img").show();
   //   $(".area-active-img").hide();
   //   $(".area-not-active-img").show();
   //   $(".immediate_join_btn").attr("href", "#immediate_join_us_personal");
   // });
   /*--------------区域代理和个人代理的切换-------------- end*/

   function alertTip(html, callback, delay) {
     $.tooltip({
       'html': html || '',
       'delay': delay || 2000,
       'callback': callback || null
     });
   };
   $.tooltip = function(ops) {
     var ops = $.extend({
       html: '',
       delay: 2000,
       callback: null
     }, ops);
     var obj = null,
       text = ops.html,
       html = '<div id="tool_tip" style="position:fixed; max-width:300px; z-index:999999; top:0;' + ' left:0; opacity:1; padding:40px 60px; background:rgba(0,0,0,0.7);' + 'color:#fff; border-radius:8px; text-align:center; font-size:18px; font-weight:bold">' + text + '</div>';
     $('#tool_tip').remove();
     obj = $(html).appendTo('body');
     obj.css({
       '-webkit-transform': 'translate(-50%, -50%)',
       transform: 'translate(-50%, -50%)',
       left: '50%',
       top: '50%'
     });
     setTimeout(function() {
       obj.animate({
         opacity: 0
       }, 500, 'linear', function() {
         obj.remove();
         $.isFunction(ops.callback) && ops.callback();
       });
     }, ops.delay);
   };

   var $window = $(window),
     scrollfirst = [true, true, true, true, true];

   getArea('#province_Select', 0, '请求省列表失败，请刷新重试');
   $('#province_Select').on('change', function() {
     $('#city_Select').empty().append('<option selected disabled>选择市</option>');
     getArea('#city_Select', $(this).val(), '请求市列表失败，请重试');
   });
   getArea('#province_Select_personal', 0, '请求省列表失败，请刷新重试');
   $('#province_Select_personal').on('change', function() {
     $('#city_Select_personal').empty().append('<option selected disabled>选择市</option>');
     getArea('#city_Select_personal', $(this).val(), '请求市列表失败，请重试');
   });
   getArea('#agent_province_Select', 0, '请求省列表失败，请刷新重试');
  $('#agent_province_Select').on('change', function() {
    $('#agent_city_Select').empty().append('<option selected disabled>选择市</option>');
    getArea('#agent_city_Select', $(this).val(), '请求市列表失败，请重试');
  });
  getArea('#Suspension-province', 0, '请求省列表失败，请刷新重试');
  $('#Suspension-province').on('change', function() {
    $('#Suspension-city').empty().append('<option selected disabled>选择市</option>');
    getArea('#Suspension-city', $(this).val(), '请求市列表失败，请重试');
  });
   function dataAnimation() {
     var hasScroll = $window.scrollTop();
     if (hasScroll >= 646 && scrollfirst[0]) {
       scrollfirst[0] = false;
       $('.arrow_x').addClass('arrow_xAnima');
       $('.arrow_y').addClass('arrow_yAnima');
       $('.data_x1').addClass('data_xAnima');
       $('.data_y').addClass('data_yAnima');
       $('.data_x0').removeClass('data_x0');
       $('.arrow_z').css({
         'display': 'block'
       }).addClass('arrow_zAnima');
       setTimeout(function() {
         $('.data_1').css({
           'display': 'block'
         }).addClass('dataAnima');
       }, 1500)
       setTimeout(function() {
         $('#gear1').addClass('gearAnima');
         $('.data_2').css({
           'display': 'block'
         }).addClass('dataAnima');
       }, 2500);
       setTimeout(function() {
         $('#gear2').addClass('gearAnima');
         $('.data_3').css({
           'display': 'block'
         }).addClass('dataAnima');
       }, 3500);
       setTimeout(function() {
         $('#gear3').addClass('gearAnima');
         $('.data_4').css({
           'display': 'block'
         }).addClass('dataAnima');
       }, 4500);
       setTimeout(function() {
         $('#gear4').addClass('gearAnima');
       }, 5500);
     }
     // console.log(hasScroll);
     if (hasScroll >= 1200 && scrollfirst[1]) {
       scrollfirst[1] = false;
       $('.join_left').addClass('join_lAnima');
       $('.join_right').addClass('join_rAnima');
       $('.join_limg').addClass('join_lAnima');
       $('.join_rimg').addClass('join_rAnima');
     }
     if (hasScroll >= 3100 && scrollfirst[2]) {
       scrollfirst[2] = false;
       $('.assist1,.assist2').addClass('assistDAnima');
       $('.assist4,.assist5').addClass('assistFAnima');
     }
   }

   $window.on('scroll', dataAnimation);

   // container 根据pid获取列表存放的select;  pid ; tip 请求失败提示; targetPid（可选）当有值时 表示有初始值
   function getArea(container, pid, tip, targetPid) {
     $.ajax({
       url: '/index.php?r=Region/getRegionList',
       type: 'get',
       data: {
         pid: pid
       },
       dataType: 'json',
       success: function(data) {
         if (data.status == 0) {
           var list = data.data,
             listStr = '';
           $(list).each(function(index, item) {
             listStr += '<option value="' + item.id + '">' + item.name + '</option>';
           });
           $(container).append(listStr);
           if (targetPid) {
             $(container).find('option[value="' + targetPid + '"]').prop('selected', true);
           }
         } else {
           alertTip(tip);
         }
       },
       error: function(data) {
         alertTip(tip);
       }
     });
   }

   function testPhone(phone) {
     var regphone = /^(0|86|17951)?(13[0-9]|15[012356789]|17[5678]|18[0-9]|14[57])[0-9]{8}$/;
     return regphone.test(phone);
   }

   function testQQ(qq) {
     var regqq = /[\d]{6,11}$/;
     return regqq.test(qq);
   }
   // 0是二级 1是一级
   $('#join_btn').on('click', function() {
     var _name = $('#name').val(),
       _phone = $('#phone').val(),
       _qq = $('#qq').val(),
       region_id = $('#city_Select').val(),
       _company_main_product = $("#company_main_product").val(),
       _main_client = $("#main_client").val(),
       _localmarket_analysis_plan = $("#localmarket_analysis_plan").val(),
       _district_agent = $(".join_us_info input[name='agent']:checked").val(),
     _this = $(this);

     if (!_name) {
       alertTip("姓名未填写！");
       $('#name').focus();
       return;
     }
     if (!_phone) {
       alertTip("电话未填写！");
       $('#phone').focus();
       return;
     }
     if (!testPhone(_phone)) {
       alertTip("请填写正确的电话！");
       $('#phone').focus();
       return;
     }
    //  if (_qq && !testQQ(_qq)) {
    //    alertTip('请填写正确的QQ！');
    //    $('#qq').focus();
    //    return;
    //  }
     if (!region_id) {
       alertTip("地区未选择！");
       $('#city_Select').focus();
       return;
     }
     if (!_company_main_product) {
       alertTip("主营业务未填写！");
       $('#company_main_product').focus();
       return;
     }
    //  if (!_main_client) {
    //    alertTip("主要客户群体未填写！");
    //    $('#main_client').focus();
    //    return;
    //  }
      // if (!_localmarket_analysis_plan) {
      //   alertTip("对当地市场的分析和营销计划未填写！");
      //   $('#localmarket_analysis_plan').focus();
      //   return;
      // }
      // if (_localmarket_analysis_plan.length < 20) {
      //   alertTip("对当地市场的分析和营销计划的描述过少！");
      //   $('#localmarket_analysis_plan').focus();
      //   return;
      // }
       // if (_this.hasClass('js-ajax')) {
       //   return;
       // }
       // _this.addClass('js-ajax');
     var applyData = {
       name: _name,
       phone: _phone,
      //  qq: _qq,
        region_id: region_id,
        district_agent: 1,
       product: _company_main_product,
      //  target_customers: _main_client,
      //  project: _localmarket_analysis_plan,
     };

     $.ajax({
       url: '/index.php?r=pc/Biaodan/AgentApply',
       dataType: 'json',
       type: 'get',
       data: applyData,
       success: function(data) {
         if (data.status == 0) {
          //  alertTip("提交成功<br/>若初步审核通过，工作人员会在5个工作日内与您联系");
           // _this.text("已提交");
           window.location.href = "/joinin.html";
           $("#name").val("");
           $("#phone").val("");
           $("#qq").val("");
           $("#company_main_product").val("");
           $("#main_client").val("");
           $("#localmarket_analysis_plan").val("");
           $("#area_industry").val("");
           $(".join_us_info label input").css({
             "background": "#F7FAFA"
           });
           $("#province_Select option:first").prop("selected", true);
           $("#city_Select").empty().append("<option value=''>选择市</option>");
           $("#city_Select option:first").prop("selected", true);
         } else {
           alertTip(data.data);
           //  _this.removeClass('js-ajax');
         }
       },
       error: function(data) {
         alertTip(data.data);
         // _this.removeClass('js-ajax');
       }
     })
   })
   $('#agent_join_btn').on('click', function() {
    var _name = $('#agent_name').val(),
      _phone = $('#agent_phone').val(),
      
      region_id = $('#agent_city_Select').val(),
      _company_main_product = $("#agent_company_main_product").val(),
    _this = $(this);

    if (!_name) {
      alertTip("姓名未填写！");
      $('#agent_name').focus();
      return;
    }
    if (!_phone) {
      alertTip("电话未填写！");
      $('#agent_phone').focus();
      return;
    }
    if (!testPhone(_phone)) {
      alertTip("请填写正确的电话！");
      $('#agent_phone').focus();
      return;
    }
   
    if (!region_id) {
      alertTip("地区未选择！");
      $('#agent_city_Select').focus();
      return;
    }
    if (!_company_main_product) {
      alertTip("主营业务未填写！");
      $('#agent_company_main_product').focus();
      return;
    }
  
    var applyData = {
      name: _name,
      phone: _phone,
     
       region_id: region_id,
       district_agent: 1,
      product: _company_main_product,
     
    
    };

    $.ajax({
      url: '/index.php?r=pc/Biaodan/AgentApply',
      dataType: 'json',
      type: 'get',
      data: applyData,
      success: function(data) {
        if (data.status == 0) {
         //  alertTip("提交成功<br/>若初步审核通过，工作人员会在5个工作日内与您联系");
          // _this.text("已提交");
          window.location.href = "/joinin.html";
          $("#agent_name").val("");
          $("#agent_phone").val("");
          $("#agent_company_main_product").val("");
          
          $("#localmarket_analysis_plan").val("");
          $("#area_industry").val("");
          $(".join_us_info label input").css({
            "background": "#F7FAFA"
          });
          $("#agent_province_Select option:first").prop("selected", true);
          $("#agent_city_Select").empty().append("<option value=''>选择市</option>");
          $("#agent_city_Select option:first").prop("selected", true);
        } else {
          alertTip(data.data);
          //  _this.removeClass('js-ajax');
        }
      },
      error: function(data) {
        alertTip(data.data);
        // _this.removeClass('js-ajax');
      }
    })
  })



  $(window).scroll(function(){
    if($(document).scrollTop()>=50&&$(document).scrollTop()<=5100){
      $('.Suspension-bottom').fadeIn();
    }else{
      $('.Suspension-bottom').fadeOut();
    }
  })
 $('.Suspension-bottom .Suspension-delet').on('click',function(){
   $('.Suspension-bottom').hide();
 })
  $('#Suspension-join').on('click', function() {
    var _name = $('#Suspension-name').val(),
      _phone = $('#Suspension-phone').val(),
      
      region_id = $('#Suspension-city').val(),
      // _company_main_product = $("#agent_company_main_product").val(),
    _this = $(this);

    if (!_name) {
      alertTip("姓名未填写！");
      $('#Suspension-name').focus();
      return;
    }
    if (!_phone) {
      alertTip("电话未填写！");
      $('#Suspension-phone').focus();
      return;
    }
    if (!testPhone(_phone)) {
      alertTip("请填写正确的电话！");
      $('#Suspension-phone').focus();
      return;
    }
   
    if (!region_id) {
      alertTip("地区未选择！");
      $('#agent_city_Select').focus();
      return;
    }
    // if (!_company_main_product) {
    //   alertTip("主营业务未填写！");
    //   $('#agent_company_main_product').focus();
    //   return;
    // }
  
    var applyData = {
      name: _name,
      phone: _phone,
     
       region_id: region_id,
       district_agent: 1,
      product: '',
      is_jump:1
    
    };

    $.ajax({
      url: '/index.php?r=pc/Biaodan/AgentApply',
      dataType: 'json',
      type: 'get',
      data: applyData,
      success: function(data) {
        if (data.status == 0) {
         //  alertTip("提交成功<br/>若初步审核通过，工作人员会在5个工作日内与您联系");
          // _this.text("已提交");
          window.location.href = "/joinin.html";
          $("#Suspension-name").val("");
          $("#Suspension-phone").val("");
          // $("#agent_company_main_product").val("");
          
          
          $("#Suspension-province option:first").prop("selected", true);
          $("#Suspension-city").empty().append("<option value=''>选择市</option>");
          $("#Suspension-city option:first").prop("selected", true);
        } else {
          alertTip(data.data);
          //  _this.removeClass('js-ajax');
        }
      },
      error: function(data) {
        alertTip(data.data);
        // _this.removeClass('js-ajax');
      }
    })
  })
   // $("#person_join_us_btn").on("click", function() {
   //   var _name = $("#personal_name").val(),
   //     _phone = $("#personal_phone").val(),
   //     region_id = $("#city_Select_personal").val(),
   //     _qq = $("#personal_qq").val(),
   //     _industry = $("#personal_industry").val();
   //   _this = $(this);
   //   if (!_name) {
   //     alertTip("姓名未填写！");
   //     $('#personal_name').focus();
   //     return;
   //   }
   //   if (!_phone) {
   //     alertTip("电话未填写！");
   //     $('#personal_phone').focus();
   //     return;
   //   }
   //   if (!testPhone(_phone)) {
   //     alertTip("请填写正确的电话！");
   //     $('#personal_phone').focus();
   //     return;
   //   }
   //   if (_qq && !testQQ(_qq)) {
   //     alertTip('请填写正确的QQ！');
   //     $('#personal_qq').focus();
   //     return;
   //   }
   //   if (!region_id) {
   //     alertTip("地区未选择！");
   //     $("#city_Select_personal").focus();
   //     return;
   //   }

   //   if (!_industry) {
   //     alertTip("所属行业未填写！");
   //     $("#personal_industry").focus();
   //     return;
   //   }
   //   /* if (_this.hasClass('js-ajax')) {
   //      return;
   //    }
   //    _this.addClass('js-ajax');*/
   //   $.ajax({
   //     url: "/index.php?r=pc/Biaodan/AgentApply",
   //     type: "POST",
   //     data: {
   //       name: _name,
   //       phone: _phone,
   //       qq: _qq,
   //       region_id: region_id,
   //       district_agent: 0,
   //       industry: _industry
   //     },
   //     dataType: "JSON",
   //     success: function(data) {
   //       if (data.status == 0) {
   //         alertTip("提交成功<br/>若初步审核通过，工作人员会在5个工作日内与您联系");
   //         // _this.text("已提交");
   //         $("#personal_name").val("");
   //         $("#personal_phone").val("");
   //         $("#personal_qq").val("");
   //         $("#personal_industry").val("");
   //         $(".join_us_info label input").css({
   //           "background": "#F7FAFA"
   //         });
   //         $("#province_Select_personal option:first").prop("selected", true);
   //         $("#city_Select_personal").empty().append("<option value=''>选择市</option>");
   //         $("#city_Select_personal option:first").prop("selected", true);
   //       } else {
   //         alertTip(data.data);
   //         //  _this.removeClass('js-ajax');
   //       }
   //     },
   //     error: function(data) {
   //       alertTip(data.data);
   //       //  _this.removeClass('js-ajax');
   //     }

   //   })

   // });


    // $('.one_agent').on('click',function(){
    //   $('.agent-radio').eq(0).attr('checked',true);
    // })
    // $('.two_agent').on('click',function(){
    //   $('.agent-radio').eq(1).attr('checked',true);
    // })



    $('.support_tabList').on('click','.support_tab',function(){
      // 加盟支持点击
      $(this).addClass('active').siblings().removeClass('active');
      var id=$(this).attr('data-id');
      $('.support_wrap_sick:nth-child('+id+')').show().siblings().hide();
    })
    $('.process_list li').hover(function(){
      $(this).addClass('updown').siblings().removeClass('updown');
    },function(){
      $('.process_list li:nth-child(1)').addClass('updown').siblings().removeClass('updown');
    })
    $('.attract-years ul li').hover(function(){
      $(this).addClass('onlight').siblings().removeClass('onlight');
    },function(){
      $('.attract-years ul li:nth-child(1)').addClass('onlight').siblings().removeClass('onlight');
    })
 });