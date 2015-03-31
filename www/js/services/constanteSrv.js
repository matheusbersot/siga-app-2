angular.module('myApp.services')
    .factory('constanteSrv', function () {

        /*Tipos de Movimentação*/
        this.TIPO_MOVIMENTACAO_TRANSFERENCIA = 3;
        this.TIPO_MOVIMENTACAO_DESPACHO_TRANSFERENCIA = 6;
        this.TIPO_MOVIMENTACAO_DESPACHO_INTERNO_TRANSFERENCIA = 8;
        this.TIPO_MOVIMENTACAO_TRANSFERENCIA_EXTERNA = 17;
        this.TIPO_MOVIMENTACAO_DESPACHO_TRANSFERENCIA_EXTERNA = 18;

        return this;
    });