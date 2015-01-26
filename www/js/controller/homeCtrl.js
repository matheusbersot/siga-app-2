var modController = angular.module('mod_controller',[]);

modController.controller('HomeController', ['$scope', function($scope) {

}]);

modController.config(function($stateProvider, $urlRouterProvider) {

  $urlRouterProvider.otherwise('/home');

  $stateProvider.state('home', {
    url: '/home',
    views: {
      home: {
        templateUrl: 'home.html'
      }
    }
  });

  $stateProvider.state('cadastro', {
    url: '/cadastro',
    views: {
      cadastro: {
        templateUrl: 'cadastro.html'
      }
    }
  });
});
