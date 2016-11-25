// 引入http模块(内置模块)
// 用来开启http服务器
var http = require('http');

// 引入模块url(引包)
var url = require('url');

var PORT = 3000;
// 开启服务器
var server = http.createServer(function(request,response){
	var params = url.parse(request.url, true);

	// API：根据路径返回不同数据

	var resText = {data:[]};
	switch(params.pathname){
		case '/getmayun':
			resText.data[0] = {name:'马云',nickname:'老马'};
			break;
		case '/getcity':
			resText.data = ['广州','上海','北京','深圳','杭州','东莞'];
			break;
		default:
			resText.error = '找不到数据';
	}
	response.writeHead(200,{
		'content-type':'text/plain;charset=utf8',

		// 允许跨域请求数据CORS
		"Access-Control-Allow-Origin": "*"
	});
	

	// response.write('大家好=>好，很好，非常好');
	// 前端<==>后端的数据传输，只能是string类型
	response.write(JSON.stringify(resText));
	response.end();
});

// 监听端口
server.listen(PORT,function(){
	console.log('服务器创建成功，请打开http://localhost:'+PORT);
})