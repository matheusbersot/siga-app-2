var modController = angular.module('myApp.controllers');

modController.controller('CadastrarController', ['$scope', 'DB', function ($scope, DB) {

    $scope.numProcesso = "";
    $scope.descricao = "";

    $scope.salvarProcesso = function () {

        var resposta = buscarProcesso($scope.numProcesso);
        var respostaJson = JSON.parse(resposta);

        if (!respostaJson.erro) {
            var movimentacoes = resposta;
            var dataUltimaMovimentacao = respostaJson.resposta[0].dataEvento;

            var resp = inserirProcesso($scope.numProcesso, $scope.descricao,dataUltimaMovimentacao, movimentacoes);
        }
        else {
            //TODO: pensar no que fazer ( talvez mostrar modal dizendo que foi impossivel salvar, pois o numero do processo está errado").;
        }
    }

    buscarProcesso = function (numeroProcesso) {

        /* buscar movimentacoes do processo */
        var url = "http://200.20.0.58:8080/sigaex/servicos/ExService";

        var params = new SOAPClientParameters();
        params.add("numeroProcesso", numeroProcesso);

        var resposta = SOAPClient.invoke(url, "consultaMovimentacaoProcesso2", params, false, null);
        return resposta;
    }

    inserirProcesso = function (numeroProcesso, descricao, dataUltimaMovimentacao, movimentacoes) {

        return DB.query('INSERT INTO processo (codProcesso, descricao, dataUltimaMovimentacao, movimentacoes) VALUES (?,?,?,?)',
            [numeroProcesso, descricao, dataUltimaMovimentacao, movimentacoes])
            .then(function (resultado) {
                console.log("Inseriu registro com ID "+resultado.insertId+" na tabela");
            },
            function (razao) {
                console.log('Falhou: ' + razao);
            });

    }

    var editarProcesso = function (numeroProcesso, dataUltimaMovimentacao, movimentacoes) {
        return DB.query('UPDATE processo SET dataUltimaMovimentacao = ?  and movimentacoes = ? WHERE codProcesso = ?',
            [dataUltimaMovimentacao, movimentacoes, numeroProcesso])
            .then(function (resultado) {
                console.log("Atualizou o registro com ID "+ resultado.insertId +" na tabela");
            },
            function (razao) {
                console.log('Falhou: ' + razao);
            });
    }

    var atualizarProcesso = function (numeroProcesso, dataUltimaMovimentacao, movimentacoes) {
        return DB.query('UPDATE processo SET dataUltimaMovimentacao = ?  and movimentacoes = ? WHERE codProcesso = ?',
            [dataUltimaMovimentacao, movimentacoes, numeroProcesso])
            .then(function (resultado) {
                console.log("Atualizou o registro com ID "+ resultado.insertId +" na tabela");
            },
            function (razao) {
                console.log('Falhou: ' + razao);
            });
    }

    var removerProcesso = function (numeroProcesso) {
        return DB.query('DELETE processo WHERE codProcesso = ?', [numeroProcesso])
            .then(function (resultado) {
                console.log("Removeu o registro com ID "+resultado.insertId+" na tabela");
            },
            function (razao) {
                console.log('Falhou: ' + razao);
            });
    }

}]);