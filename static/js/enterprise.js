$(".advanced-button").click(function(){

	var name = $('#name').val(),
			company_name = $('#company').val(),
			phone = $('#telephone').val(),
			work_name = $('#technicalTitle').val();

			if(!(name.length <=15)) {

				alertTip("姓名不能超过15个字");
				return;
			}
			if(!(company_name.length <=50)) {

				alertTip("公司名称不能超过50个字");
				return;
			}
			if(!(work_name.length <=10)) {

				alertTip("职称不能超过10个字");
				return;
			}

			if(!name){
				alertTip("请输入姓名(15个字以内）");
				return;
			}
				if(!phone){
				alertTip("请输入电话");
				return;
			}
			if(!company_name){
				alertTip("请输入公司名称(50字以内)");
				return;
			}
			if(!work_name){
				alertTip("请输入职称(10字以内)");
				return;
			}
			if(!(/^1[3|4|5|6|7|8][0-9]\d{4,8}$/.test(phone))){
        alertTip("请输入合法的电话号码");
				 return false;
				}
			if(name.indexOf(" ")!=-1){
			alertTip("姓名不能有空格");
			return false;
			}
			if(company_name.indexOf(" ")!=-1){
			alertTip("公司名不能有空格");
			return false;
			}
			if(work_name.indexOf(" ")!=-1){
			alertTip("职称不能有空格");
			return false;
			}
			// if($('body').attr('is_login')!=1){
			// 	alertTip('请先登录');
      // 	return;
			// }
				submitInfo({ name: $('#name').val(), company_name: $('#company').val(), phone: $('#telephone').val(), work_name: $('#technicalTitle').val()})
})

 $('#advanced-container').on("click",function(event){
   $('#advanced-container').hide();
   $('#advanced-container .main input').val('');
  }).on('click', '.main', function(event){
  	event.stopPropagation();
  })

	$('#technicalTitle').keydown(function(){
		if (event.keyCode==13){
			submitInfo({ name: $('#name').val(), company_name: $('#company').val(), phone: $('#telephone').val(), work_name: $('#technicalTitle').val()})
		}
	})

function submitInfo(param){
	$.ajax({
		url: '/index.php?r=pc/Index/addUserExperience',
		type:'get',
		dataType:'json',
		data:param,
		success:function(data){
			if(data.status==0){
				alertTip("提交成功！");
				$('#advanced-container').hide();
			}else{
				alertTip(data.data)
			}
		}
	});
}
