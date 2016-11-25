// 引入express框架
var express = require('express');

var server = express();

// 把当前目录设置成静态服务器
server.use(express.static('./html'));

// 马云API
server.get('/getmayun',function(req,res){console.log(111)

	// API：根据路径返回不同数据
	var resText = {data:[{name:'马云',nickname:'老马'}]};
	res.writeHead(200,{
		'content-type':'text/plain;charset=utf8'
	});
	
	res.write(JSON.stringify(resText));
	res.end();
});

// 获取城市
server.get('/getcity',function(req,res){

	// API：根据路径返回不同数据
	var resText = {data:['广州','上海','北京','深圳','杭州','东莞']};
	res.writeHead(200,{
		'content-type':'text/plain;charset=utf8'
	});
	
	res.write(JSON.stringify(resText));
	res.end();
});
server.get('/getcity/:cityname',function(req,res){

	

	// API：根据路径返回不同数据
	var resText = {};
	var cities = [
		{
			name:'广州',
			hot:true,
			province:'广东'
		},
		{
			name:'上海',
			hot:true,
			province:'上海'
		},
		{
			name:'北京',
			hot:true,
			province:'北京'
		},
		{
			name:'深圳',
			hot:true,
			province:'广东'
		},
		{
			name:'杭州',
			hot:true,
			province:'浙江'
		},
		{
			name:'东莞',
			hot:true,
			province:'广东'
		}
	]

	if(req.params.cityname){
		resText.data = cities.filter(function(item){
			return item.name == req.params.cityname
		});
	}else{
		resText.data = cities;
	}
	res.writeHead(200,{
		'content-type':'text/plain;charset=utf8'
	});
	
	res.write(JSON.stringify(resText));
	res.end();
});



server.listen(3000,function(){
	console.log('server start at http://localhost:3000')
});
