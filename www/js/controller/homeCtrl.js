var modController = angular.module('myApp.controllers');

modController.controller('HomeController', ['$scope', '$window', 'DB', function ($scope, $window, DB) {

    $scope.umPorVez = true;

    $scope.processos = []

    exibirProcessos = function (processos) {
        adicionarProcessos(processos);
    }

    adicionarProcessos = function (dadosProcessos) {

        for (var i = 0; i < dadosProcessos.length; ++i) {
            var processo = montarProcesso(dadosProcessos[i]);

            $scope.processos.push(processo);
        }
    }

    montarProcesso = function (dadosProcesso) {

        var processo = {};
        processo["descricao"] =  dadosProcesso.descricao;
        processo["numero"] =  dadosProcesso.codProcesso;
        processo["movimentacoes"] = montarMovimentacoes(dadosProcesso.movimentacoes);

        return processo;
    }

    montarMovimentacoes = function(movimentacoes)
    {
        var respostaJson = JSON.parse(movimentacoes);
        var dados = respostaJson.resposta;

        for(var i=0; i<dados.length; ++i)
        {
            dados[i]["primeira"] = (i==0) ? true: false;
        }

        return dados;
    }

    buscarTodosProcessos = function () {
        return DB.query('SELECT * from processo')
            .then(function (resultado) {
                dados = DB.fetchAll(resultado);
                exibirProcessos(dados);
            },
            function (razao) {
                console.log('Falhou: ' + razao);
            });
    }

    $scope.removerProcesso = function (codProcesso) {
        return DB.query('DELETE from processo WHERE descricao = ?', [codProcesso])
            .then(function (resultado) {
                refreshPage();
                console.log("Removeu "+resultado.rowsAffected+" registro(s) na tabela.");
            },
            function (razao) {
                console.log('Falhou: ' + razao.message);
            });
    }

    refreshPage = function()
    {
        $window.location.reload();
    }

    buscarTodosProcessos();

}]);