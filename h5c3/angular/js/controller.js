;(function(){

	angular.module('gds.ctrl',[])

	// 内置服务的注入$http
	.controller('homeController',[
		'$scope',
		'$http',
		'mySev',
		'mySev2',
		function($scope,$http,mySev,mySev2){
			$scope.name = '丝绸之路';
			console.log(mySev);

			console.log(mySev.sum(1,12,3,10,43,4,12,34,3));

			console.log(mySev2.add(10,20));
		}]
	)

	.controller('listController', [
		'$scope', 
		function($scope){
			$scope.name = '不归之路'
		}
	])
})();