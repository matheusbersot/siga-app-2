var modController = angular.module('myApp.controllers');

modController.controller('ProcessoController', ['$scope', 'DB', 'processoSrv', '$stateParams', function ($scope, DB, processoSrv, $stateParams) {

    $scope.numProcesso = $stateParams.numProcesso;
    $scope.descricao = $stateParams.descricao;

    $scope.readOnly = true;
    $scope.umPorVez = true;

    $scope.listaProcessos = [];

    this.init = function () {
        processoSrv.buscarTodosProcessos()
            .then(function (dadosProcessos){
                $scope.listaProcessos = processoSrv.montarObjProcessos(dadosProcessos);
            }
        );
    }

    $scope.salvar = function () {

        var resposta = processoSrv.buscarProcessoSIGA($scope.numProcesso);
        var respostaJson = JSON.parse(resposta);

        if (!respostaJson.erro) {
            var movimentacoes = resposta;
            var dataUltimaMovimentacao = respostaJson.resposta[0].dataEvento;

            var resp = processoSrv.inserirProcesso($scope.numProcesso, $scope.descricao, dataUltimaMovimentacao, movimentacoes);
        }
        else {
            //TODO: pensar no que fazer ( talvez mostrar modal dizendo que foi impossivel salvar, pois o numero do processo está errado").;
        }
    };

    $scope.editar = function () {
        processoSrv.editarProcesso($scope.numProcesso, $scope.descricao);
    };

    $scope.remover = function(codProcesso){

        var achou = false;
        var i=0;
        while((!achou) && (i<$scope.listaProcessos.length))
        {
            if($scope.listaProcessos[i].numero == codProcesso)
            {
                $scope.listaProcessos.splice(i,1);
                processoSrv.removerProcesso(codProcesso);
                achou = true;
            };
            ++i;
        };
    };

    this.init();

}]);