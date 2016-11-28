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

// 获取songs.json内容
server.get('/getSongs',function(req,res){
	res.writeHead(200,{
		'content-type':'text/plain;charset=utf8'
	});

	fs.readFile('./songs.json',function(err,data){
		if(err){
			res.end('文件读取失败');
		}

		res.end(data);
	});
});

// 添加歌曲
server.get('/addSong',function(req,res){
	console.log(req.query);//songName=小苹果&singer=筷子兄弟
	// 1、先获取原来的内容
	// 2、在原来的基础上添加新的内容（追加）


	res.writeHead(200,{
		'content-type':'text/plain;charset=utf8'
	});

	fs.readFile('./songs.json',function(err,data){
		var data = JSON.parse(data.toString());

		// 前端传来的信息
		var postData = req.query;

		var obj = {
			src:'media/' + postData.singer + '-' + postData.songName + '.mp3',
			singer:postData.singer,
			name:postData.songName,
			album:'media/' + postData.singer + '-' + postData.songName + '.jpg'
		}

		// 追加内容
		data.push(obj);


		// 写入文件
		fs.writeFile('./songs.json',JSON.stringify(data,null,4),function(err){
			if(err){
				res.end('文件写入失败');
			}
			res.end('提交成功');
		});
	});
});

// 下载歌曲
server.get('/download',function(req,res){
	res.writeHead(200,{
		'content-type':'audio/mpeg'
	});

	// var readUrl = path.dirname(req.query.url) + '/' + path.basename(req.query.url);
	// console.log(path.dirname(req.query.url),path.basename(req.query.url),readUrl)
	console.log(req.query);
	var readUrl = './' + req.query.url;
	fs.readFile(readUrl,function(err,data){
		if(err){
			res.end('文件路径错误');
			
		}
		// res.writeHead(200,{
		// 	'content-type':'audio/mpeg'
		// });
		res.end(data);
	});
});


// jsonp请求
// 返回前端的是一串js代码
server.get('/jsonp',function(req,res){
	res.writeHead(200,{
		'content-type':'text/plain;charset=utf8'
	});

	var obj = {name:'王x强',age:18};

	var fn = req.query.callback;

	// 返回一个函数执行字符串给前端
	res.end(fn + '('+JSON.stringify(obj)+')');
	
});

server.listen(3000,function(){
	console.log('服务器启动成功,http://localhost:3000')
});