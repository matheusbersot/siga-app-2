angular.module('myApp.models')
    .factory('Movimentacao', function () {

        function Movimentacao(dados) {

            if (dados) {
                this.idTipoEvento = dados.idTipoEvento;
                this.tipoEvento = dados.tipoEvento;
                this.dataEvento = dados.dataEvento;
                this.lotacaoOrigem = dados.lotacaoOrigem;
                this.lotacaoDestino = dados.lotacaoDestino;
                this.primeiraMovimentacao = dados.primeiraMovimentacao;
            }
        };

        return Movimentacao;
    });