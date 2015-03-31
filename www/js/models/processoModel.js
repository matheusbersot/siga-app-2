var modModel = angular.module('myApp.models');

modModel.factory('Processo', ['Movimentacao', function (Movimentacao){

        function Processo(dados) {
            if (dados) {

                this.descricao = dados.descricao;
                this.numero = dados.codProcesso;
                this.dataUltimaMovimentacao = dados.dataUltimaMovimentacao;
                this.movimentacoes = [];
                this.setMovimentacoes(dados.movimentacoes);
                this.atualizou = false;
            }
        };

        Processo.prototype = {

            setMovimentacoes: function(dadosMovimentacoes){

                var arrayObjetos = JSON.parse(dadosMovimentacoes).resposta;

                for (var i = 0; i < arrayObjetos.length; ++i) {

                    arrayObjetos[i]["primeiraMovimentacao"] = (i == 0);
                    var movimentacao = new Movimentacao(arrayObjetos[i]);
                    this.movimentacoes.push(movimentacao);
                }
            }
        };

        return Processo;
}]);