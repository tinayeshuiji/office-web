$('.notice .noticeClose').on('click', function(event) {
      $(this).closest('.notice').hide();
    });
    $('.newFun .noticeClose').on('click', function(event) {
      $(this).closest('.newFun').hide();
    });
    // data.type   1新功能   2公告
    $.ajax({
      url: '/index.php?r=pc/Index/MessageNoticeShow',
      type: 'get',
      dataType: 'json',
      data: {},
      success:function(data){
        if (data.data.length || data.data) {
          var ul = '';
          if (data.type == 1) {
            $('.newFun .count').text(data.count_total+'款 新功能上线！');
            $.each(data.data, function(index, val) {
              ul += '<li><a target="_blank" href="'+(val.url || '/index.php?r=pc/IndexNew/MessageNoticeShow')+'">'+(val.stat_date.slice(4,6) >= 10 ? val.stat_date.slice(4,6) : val.stat_date.slice(5,6) )+'月'+(val.stat_date.slice(6,8) >= 10 ? val.stat_date.slice(6,8) : val.stat_date.slice(7,8) ) + '日 '+val.title.split(' ')[1]+' 上线了</a></li>';
            });
            $('.newFun').show().find('ul').html(ul);
          } else {
            if((getCookie('notice') && +data.data[0].stat_date > +getCookie('notice')) || !getCookie('notice')){
              $.each(data.data, function(index, val) {
                ul += '<li><a target="_blank" href="'+val.url+'"><p style="color: #59607b;line-height: unset;height: auto;padding-top: 10px;">'+val.title+'</p><p style="color: #59607b;text-align: left; height: auto;line-height: 23px; padding-top: 10px; font-size: 12px;">'+val.content+'</p></a></li>';
                $('.notice .for-more').attr('href', val.url);
                setCookie('notice', val.stat_date, 24*31)
              });
              $('.notice').show().find('ul').html(ul);
            }
          }
          setTimeout(function(){
            $('.notice, .newFun').hide()
          }, 30000)
        }
      }
    })