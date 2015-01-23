var modController = angular.module('mod_controller');

modController.controller('ResultadoController', ['$scope','$stateParams',function($scope, $stateParams) {

   $scope.dados = null;

   $scope.buscarProcesso = function () {    

	    var url = "http://192.168.1.50:8081/sigaex/servicos/ExService";

	    var params = new SOAPClientParameters();
	    params.add("numeroProcesso", $stateParams.numeroProcesso);

	    var resposta = SOAPClient.invoke(url, "consultaMovimentacaoProcesso2", params, false, null);    
	    var json = JSON.parse(resposta);
            $scope.dados = json;
   };

   $scope.buscarProcesso();

}]);
