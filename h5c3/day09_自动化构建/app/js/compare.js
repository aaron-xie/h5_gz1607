var product_defaultid,product_chooseid;
$(document).ready(function(){
	compare_init(123);
	product_defaultid=$(".toplist li.choose").eq(0).val();		//Back 初始选择的保险id
	
	$(".toplist li").click(function(){
		var choosenum=$(".toplist li.choose").length;	//Back 选中的条目
		if($(this).hasClass("choose"))
		{
			if(choosenum==2)		//Back 已经存在2个比较
			{
				$(this).removeClass("choose");
				Remove_Class_half();
				Set_compare_header(1);
				Set_tapone(1);
				Set_taptwo(1);
			}
			//alert($(this).index());
		}
		else
		{
			if(choosenum<2)			//Back 比较的条目不能大于2
			{
				$(this).addClass("choose");
				var product_chooseid=$(this).val();			//Back 设置选中的对比保险id
				//alert($(this).val());
				Set_compare_header(2);
				Set_tapone(2);
				Set_taptwo(2);
				Set_Class_half();
				
			}
		}
	})
});
function two_close(product_id)
{
	Remove_Class_half();
	compare_init(product_id);
}
function compare_init(product_id)
{
	$(".toplist li").removeClass("choose");
	for(var i=0;i<$(".toplist li").length;i++)
	{
		if($(".toplist li").eq(i).val()==product_id)
		{
			$(".toplist li").eq(i).addClass("choose");
		}
	}
	//product_id;				//Back 需要初始化的保险id
	Set_compare_header(1);
	Set_tapone(1);
	Set_taptwo(1);
}

function Set_Class_half() //Back 设置对比class
{
	$("#tap_one").addClass("half");
	$("#tap_two").addClass("half");
	$("#tap_three").addClass("half");
	$("#tap_four").addClass("half");
	$(".compare_header").addClass("half");
}
function Remove_Class_half() //Back 设置对比class
{
	$("#tap_one").removeClass("half");
	$("#tap_two").removeClass("half");
	$("#tap_three").removeClass("half");
	$("#tap_four").removeClass("half");
	$(".compare_header").removeClass("half");
}
function Get_compare_header(backsign)
{
	var str="";
	var product_id="123";					//Back 关闭的保险id
	str+='<div class="compare_header">';
	if(backsign!=null&&backsign!="")
	{
		str+='<div class="close_btn"><a href="list.html" rel="external">X</a></div>';
	}
	else
	{
		str+='<div class="close_btn"><a onclick="two_close('+product_id+');">X</a></div>';
	}
	str+='<div class="compare_header_title">平安车险</div>';
	str+='<div class="compare_header_price">￥3574.56</div>';
	str+='<div class="compare_header_btn">';
	str+='<a href="#searhStep2" data-role="button" class="btn btn-squared">购买</a>';
	str+='</div>';
	str+='<div class="compare_header_star"></div>';
	str+='</div>';
	return str;
}
function Set_compare_header(length)
{
	var str="";
	for(var i=0;i<length;i++)
	{
		if(length==1)			
		{
			str+=Get_compare_header(1);			//只有1个header是关闭按钮跳转到list页面
		}
		else
		{
			str+=Get_compare_header();
		}
	}
	$("#compare_header_list").html(str);
}


function Get_tapone(index)
{
	var str="";
	str+='<div class="li-control">';
	str+='<ul id="listview_tapone_'+index+'" data-role="listview" data-inset="true" data-shadow="false">';
	str+=Create_tapone_list_divider('车辆损失险');
	str+=Create_tapone_li('269820（保额)','3956.21（保费）');						
	str+=Create_tapone_list_divider('第三者责任险');							
	str+=Create_tapone_li('50万（保额）','416.21（保费）',1);	
	str+=Create_tapone_list_divider('全车盗抢险');							
	str+=Create_tapone_li('投保','1216.56（保费）');							
	str+=Create_tapone_list_divider('司机责任险');								
	str+=Create_tapone_li('1万（保额）','416.21（保费）',1);
	str+=Create_tapone_list_divider('交强险');
	str+=Create_tapone_li('投保','850.00（保费）');
	str+=Create_tapone_list_divider('车船税');						
	str+=Create_tapone_li('代缴','548.00（保费）');							
	str+='</ul>';						
	str+='</div>';					
	return str;
}
function Set_tapone(length)
{
	var str="";
	for(var i=0;i<length;i++)
	{
		str+=Get_tapone(i);
	}
	$("#tap_one").html(str);
	for(var i=0;i<length;i++)
	$("#listview_tapone_"+i+"").listview();
}

function Get_taptwo(index)
{
	var str="";
	str+='<div class="li-control">';
	str+='<ul  id="listview_taptwo_'+index+'" data-role="listview" data-inset="true" data-divider-theme="a" data-shadow="false" data-icon="false">';
	str+=Create_taptwo_title('理赔特色服务');
	str+=Create_taptwo_li('报案到赔款，3天到账',1);
	str+=Create_taptwo_li('结案支付，即时到账',1);
	str+=Create_taptwo_li('人伤案件，安心理赔',1);
	str+=Create_taptwo_li('上门代收理赔资料',1);
	str+=Create_taptwo_li('个人VIP客户简易理赔服务',1);
	str+=Create_taptwo_title('理赔流程');
	str+=Create_taptwo_li('车损理赔流程',1);
	str+=Create_taptwo_li('车损快速赔款',1);
	str+=Create_taptwo_li('人伤理赔流程',1);
	str+=Create_taptwo_title('理赔网点');
	str+=Create_taptwo_li('客户门店',1);
	str+='<li>';
	str+='<a href="#glist3" data-rel="popup" class="li-popup">客户门店<span class="text-small">广东广州地区共 <span class="text-red">16</span> 个网点</span></a>';
    str+='</li>';
    str+='<li>';
    str+='<a class="li-popup">合作修理厂<span class="text-small">广东 广州地区共 <span class="text-red">26</span> 个 <span class="text-red">奥迪</span> 修理厂</span></a>';
    str+='</li>';
    
	str+='</ul>';						
	str+='</div>';					
	return str;
}
function Set_taptwo(length)
{
	var str="";
	for(var i=0;i<length;i++)
	{
		str+=Get_taptwo(i);
	}
	$("#tap_two").html(str);
	for(var i=0;i<length;i++)
	{
		$("#listview_taptwo_"+i+"").listview();
	}
}

function Create_tapone_list_divider(text_0)
{
	var str="";
	str+='<li data-role="list-divider" class="lihead">'+text_0+'</li>';
	return str;
}
function Create_tapone_li(text_0,text_1,circle)		//circle标志是否低价，传0或1即可
{
	var str="";
	str+='<li>';
	str+='<div>';							
	str+='<p>'+text_0+'</p>';								
	str+='</div>';									
	str+='<div>';								
	str+='<span class="text-green">'+text_1+'</span>';
	if(circle!=null&&circle!="")
	{
		str+='<span class="circle">低</span>';
	}
	str+='</div>';									
	str+='</li>';								
	return str;					
}
function Create_taptwo_title(text_0)
{
	var str="";
	str+='<li data-role="list-divider" style="text-align: center">'+text_0+'</li>';
	return str;
}
function Create_taptwo_li(text_0,popup_id)
{
	var str="";
	str+='<li><a href="#taptwo_popup_'+popup_id+'" data-rel="popup" class="li-popup">'+text_0+'<span class="text-small">详细></span></a></li>';
	return str;
}
