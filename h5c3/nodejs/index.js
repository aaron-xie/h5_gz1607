// 引入express框架
var express = require('express');

// 文件操作模块
var fs = require('fs');

// 处理请求文件路径
var path = require('path');


// 创建服务器对象
var server = express();


// 配置静态文件服务器
server.use(express.static('./public'));


// 写API
// http://localhost:3000/getName
server.get('/getName',function(req,res,next){
	res.writeHead(200,{
		'content-type':'text/plain;charset=utf8'
	});

	// 1、链接是数据库mongoDB
	// 2、查询数据库，并返回

	var obj = {name:'王x强',age:40,gender:'男',"hobby":['经纪人','马x','出差']};
	// 转换成对象：JSON.parse()
	res.write(JSON.stringify(obj));
	res.end();
});


// http://localhost:3000/getMusic
// 获取本地文件
server.get('/getMusic',function(req,res,next){
	// 1、读取本地文件夹
	// 读取文件：fs.readFile(path,fn)
	// 读取文件夹：fs.readdir(path,fn)
	// 写入文件：fs.writeFile(path,data,fn)
	res.writeHead(200,{
		'content-type':'text/plain;charset=utf8'
	});

	fs.readdir('./media',function(err,files){
		if(err){
			res.end('读取目录失败');
			return;
		}

		var resText = [];
		files.forEach(function(item){
			// 先判断文件类型
			// 陈小春-我有什么资格不要你.mp3
			// 音乐类型：mp3,wav,ogg
			var extname = path.extname(item).toLowerCase();
			var type = '.mp3,.wav,.ogg';

			if(type.indexOf(extname) == -1){
				return;
			}

			var filename = path.basename(item,extname);
			var arr_name = filename.split(/\s*-\s*/);
			var obj = {
				src:"media/" + item,
				singer:arr_name[0],
				name:arr_name[1],
				filename:"media/" + filename + '.jpg'
			}

			resText.push(obj);
		});

		// 写入json文件
		fs.writeFile('./songs.json',JSON.stringify(resText,null,4),function(err){
			if(err){
				console.log('写入文件失败');
			}
		});

		res.end(JSON.stringify(resText));
	})


});

server.listen(3000,function(){
	console.log('服务器启动成功,http://localhost:3000')
})