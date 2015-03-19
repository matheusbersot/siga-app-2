var modController = angular.module('myApp.controllers');

modController.controller('HomeProcessoController', ['$scope', '$interval' /*'$cordovaLocalNotification',*/ ,'processoSrv', 'utilSrv',
    function ($scope, $interval /*, $cordovaLocalNotification*/, processoSrv, utilSrv) {

        $scope.umPorVez = true;
        $scope.listaProcessos = [];
        $scope.estiloAtualizado = {'background-color': '#FFFFFF'};

        /*constantes*/
        var TIPO_MOVIMENTACAO_TRANSFERENCIA = 3;
        var TIPO_MOVIMENTACAO_DESPACHO_TRANSFERENCIA = 6;
        var TIPO_MOVIMENTACAO_DESPACHO_INTERNO_TRANSFERENCIA = 8;
        var TIPO_MOVIMENTACAO_TRANSFERENCIA_EXTERNA = 17;
        var TIPO_MOVIMENTACAO_DESPACHO_TRANSFERENCIA_EXTERNA = 18;


        this.init = function () {

            processoSrv.buscarTodosProcessos()
                .then(function (dadosProcessos) {
                    $scope.listaProcessos = processoSrv.montarObjProcessos(dadosProcessos);
                }
            );
        };

        $scope.remover = function (codProcesso) {

            var achou = false;
            var i = 0;
            while ((!achou) && (i < $scope.listaProcessos.length)) {
                if ($scope.listaProcessos[i].numero == codProcesso) {
                    $scope.listaProcessos.splice(i, 1);
                    processoSrv.removerProcesso(codProcesso);
                    achou = true;
                }
                ++i;
            }
        };

        $scope.exibirTransferencia = function(idTipoMovimentacao)
        {
            if ((idTipoMovimentacao == TIPO_MOVIMENTACAO_TRANSFERENCIA)
            ||(idTipoMovimentacao == TIPO_MOVIMENTACAO_DESPACHO_TRANSFERENCIA)
            ||(idTipoMovimentacao == TIPO_MOVIMENTACAO_DESPACHO_INTERNO_TRANSFERENCIA)
            ||(idTipoMovimentacao == TIPO_MOVIMENTACAO_TRANSFERENCIA_EXTERNA)
            ||(idTipoMovimentacao == TIPO_MOVIMENTACAO_DESPACHO_TRANSFERENCIA_EXTERNA))
            {
                return true;
            }
            return false;
        };

        /*var notificarUsuarioAtualizacaoProcessos = function()
        {
            for(var i = 0; i < $scope.listaProcessos.length; ++i)
            {
                if($scope.listaProcessos[i].atualizou)
                {
                    $cordovaLocalNotification.add({
                        id: i,
                        message:    "Descrição: " + $scope.listaProcessos[i].descricao,
                        title:      'Atualização de Processo',
                        autoCancel: true
                    });
                }
            }
        }*/

        $scope.$watch(function () {
            return processoSrv.atualizou;
        }, function () {
            if (processoSrv.atualizou) {
                $scope.listaProcessos = processoSrv.listaProcessos;
                processoSrv.listaProcessos = [];

                //criar notificações
                //notificarUsuarioAtualizacaoProcessos();
            }
        });

        $scope.reiniciarEstadoProcessos = function()
        {
            //reiniciar estado dos processos
            for(var i = 0; i< $scope.listaProcessos.length; ++i){
                $scope.listaProcessos[i].atualizou = false;
            }
        };

        $scope.setCorItem = function (foiAtualizado) {

            if (foiAtualizado) {
                return {'background-color': 'rgb(255, 235, 205)'}
            }
            else
            {
                return {'background-color': '#FFFFFF'}
            }
        };

        $scope.atualizarTodosProcessos = function(){
            utilSrv.mostrarPaginaComMensagem("Atualizando...");

            //$interval(function() { processoSrv.atualizarTodosProcessos($scope.listaProcessos); } ,0, 1);
            var promise_teste = $interval(function() { for(var i=0; i< 100000; ++i) {var a = i*2;} } , 0, 1);
            //var promise_teste = $interval(function() { processoSrv.atualizarTodosProcessos($scope.listaProcessos); } , 0, 1);
            promise_teste.then(function(){
                utilSrv.esconderPagina();
            })
        };

        this.init();

        var promiseAtualizarTodosProcessos;
        promiseAtualizarTodosProcessos= $interval(function() { processoSrv.atualizarTodosProcessos($scope.listaProcessos); } ,10000); //60s

        $scope.$on('$destroy', function() {
            $interval.cancel(promiseAtualizarTodosProcessos);
        });

    }]);

modController.controller('EditarProcessoController', ['$scope', '$stateParams', 'processoSrv',
    function ($scope, $stateParams, processoSrv) {

        $scope.numProcesso = $stateParams.numProcesso;
        $scope.descricao = $stateParams.descricao;

        $scope.somenteLeitura = true;

        $scope.editar = function () {
            processoSrv.editarProcesso($scope.numProcesso, $scope.descricao);
        };

    }]);


modController.controller('CadastrarProcessoController', ['$scope', '$state', '$ionicModal', 'processoSrv', 'utilSrv',
    function ($scope, $state, $ionicModal, processoSrv, utilSrv) {

        $scope.numProcesso = "";
        $scope.descricao = "";
        $scope.mensagem = "";

        $ionicModal.fromTemplateUrl('modalAlerta.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function(modal) {
            $scope.modal = modal;
        });
        $scope.openModal = function() {
            $scope.modal.show();
        };
        $scope.closeModal = function() {
            $scope.modal.hide();
        };
        //Cleanup the modal when we're done with it!
        $scope.$on('$destroy', function() {
            $scope.modal.remove();
        });

        $scope.salvar = function () {

            utilSrv.mostrarPaginaComMensagem("Cadastrando processo...");

            var resposta = processoSrv.buscarProcessoSIGA();

            processoSrv.buscarProcessoSIGA($scope.numProcesso)
                .then(function(resposta) {

                    var respostaJson = JSON.parse(resposta);

                    if (!respostaJson.erro) {
                        var movimentacoes = resposta;
                        var dataUltimaMovimentacao = respostaJson.resposta[0].dataEvento;


                        processoSrv.processoEstaCadastrado($scope.numProcesso)
                            .then(function (estaCadastrado) {

                                utilSrv.esconderPagina();

                                if (!estaCadastrado) {
                                    processoSrv.inserirProcesso($scope.numProcesso, $scope.descricao, dataUltimaMovimentacao, movimentacoes);
                                    $state.go("home");
                                }
                                else {
                                    $scope.mensagem = "Esse processo já se encontra cadastrado!";
                                    $scope.openModal();
                                }
                            }
                        );
                    }
                    else {
                        utilSrv.esconderPagina();
                        $scope.mensagem = respostaJson.erro;
                        $scope.openModal();
                    }
                });
        };
    }]);

modController.filter('formataNumProcesso', function() {
    return function(entrada) {
        entrada = entrada || '';
        var saida = "";
        if(entrada.length == 17)
        {
            saida = entrada.slice(0,5) + '.' + entrada.slice(5,11) + '/' + entrada.slice(11,15) + '-' +  entrada.slice(15,17);
        }
        else
        {
            saida = entrada;
        }
        return saida;
    };
});