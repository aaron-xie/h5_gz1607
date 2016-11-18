;(function(){
	// 把controller模块依赖到主模块
	var app = angular.module('querySchool',['qs.ctrl']);

	app.provider('glo',function(){
		this.$get = function(){

			return '1607'
		}
	});

	app.constant('global',{
		className:'h5 1607',
		total:42
	})

	// 配置路由
	app.config(function(gloProvider){
		console.log('config: ',gloProvider)
	});

	app.run(function(global,$rootScope){
		global.total = 40;
		console.log('run:');
		$rootScope.name = 'laoxie';
	});
})();