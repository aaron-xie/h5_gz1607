// 

$.ajax({
	url:'http://apis.baidu.com/showapi_open_bus/channel_news/channel_news',
	headers:{
		apikey:'34904db6ec961521d5d34d7b710cd501'
	},
	success:function(res){
		console.log(res);
		// var $ul = $('<ul/>');
		res.showapi_res_body.channelList.forEach(function(item,idx){
			if(idx>9) return;
			$('<div/>').addClass('swiper-slide').append('<a href="list.html#'+item.channelId+'">'+item.name+'</a>').appendTo('.swiper-wrapper');
		});


		var myNav = new Swiper('#mainNav',{
			slidesPerView:5,
			freeMode:true
		});
	}
});