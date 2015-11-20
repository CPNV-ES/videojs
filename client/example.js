angular
.module('videojs',['angular-meteor'])
.controller('appController',['$scope','$meteor',function($scope,$meteor){
  $scope.movies = $meteor.collection(Movies);
}]);
