var modController = angular.module('mod_controller');

modController.controller('CadastroController', ['$scope', '$location', function($scope, $location) {

   $scope.numProcesso = "";

   $scope.submit = function()
   { 
      var url = "resultado/"+$scope.numProcesso;
      $location.url(url);
   }   

}]);
