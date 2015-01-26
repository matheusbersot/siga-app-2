var modController = angular.module('myApp.controllers');

modController.controller('CadastroController', ['$scope', function ($scope) {

    $scope.numProcesso = "";
    $scope.descricao = "";

    $scope.salvarProcesso = function () {

        var resposta = buscarProcesso($scope.numProcesso);
        var respostaJson = JSON.parse(resposta);

        if(!respostaJson.erro)
        {
            var movimentacoes = resposta;
            var dataUltimaMovimentacao = respostaJson.resposta[0].dataEvento;

            inserirProcesso(dataUltimaMovimentacao, movimentacoes);
        }
        else
        {
            //TODO: pensar no que fazer ( talvez mostrar modal dizendo que foi impossivel salvar, pois o numero do processo está errado").;
        }
    }

    buscarProcesso= function(numeroProcesso) {

        /* buscar movimentacoes do processo */
        var url = "http://192.168.1.50:8081/sigaex/servicos/ExService";

        var params = new SOAPClientParameters();
        params.add("numeroProcesso", numeroProcesso);

        var resposta = SOAPClient.invoke(url, "consultaMovimentacaoProcesso2", params, false, null);
        return resposta;
    }

    inserirProcesso = function (dataUltimaMovimentacao, movimentacoes) {


    }

   atualizarProcesso = function ($dados) {

        
    }

}]);
