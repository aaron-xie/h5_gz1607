;(function(){
	angular.module('qs.ctrl',[])

	.controller('homeController', [
		'$scope', 
		'$http',
		'$interval',
		'$filter',//'dateFilter',
		'global',
		function($scope,$http,$interval,$filter,global){console.log('controller:',global)
			// 初始化
			var date = $filter('date');
			$scope.hasError = false;
			$scope.time = date(new Date(),'hh:mm:ss');

			// 每秒显示时间
			// setInterval(function(){},1000);
			$interval(function(){
				$scope.time = date(new Date(),'hh:mm:ss');
			},1000);

			$scope.getSchool = function(school){
				console.log(school);

				$http.get('http://apis.baidu.com/jidichong/school_search/school_search?name='+school,{
					headers:{
						apikey:'34904db6ec961521d5d34d7b710cd501'
					}
				})

				// 当api成功返回信息时，执行success内的函数
				.success(function(res){
					console.log(res);
					if(res.status===-1){
						$scope.hasError = true;
						$scope.list = [];
					}else{
						$scope.hasError = false;
						$scope.list = res.result.data;
					}
				})
			}
		}
	])

	.controller('listController', [
		'$scope', 
		function($scope){
			
		}
	])
})();