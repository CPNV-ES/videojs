var app = angular.module('interfaceApp',[
	'btford.socket-io',
	'ngRoute',
	'flash'
]);

app.factory('mySocket', function (socketFactory) {
  return socketFactory();
});

app.config(['$routeProvider',
  function($routeProvider) {
    $routeProvider.
      when('/', {
        templateUrl: 'views/list.html',
        controller: 'listController'
      }).
      when('/film/:id', {
        templateUrl: 'views/movie.html',
        controller: 'movieController'
      }).
      otherwise({
        redirectTo: '/'
      });
  }]);

app.controller('indexController',['$scope','mySocket','Flash',function($scope,mySocket,Flash){
	
	$scope.movies = {};
	$scope.alerts = [];
	
	$scope.sync = function(){
		if($scope.synced) return false;
		$scope.synced = true;
		mySocket.emit('sync',{},function(){
			Flash.create('success','Syncronisation réussie avec succès');
			$scope.synced = false;
		});	
	}
	
	mySocket.on('movie',function(mv){
		$scope.movies[mv.cid] = mv;
	});
	mySocket.on('movie/delete',function(cid){
		delete $scope.movies[cid];
	});
	
}]);