var modController = angular.module('myApp.controllers');

modController.controller('HomeProcessoController', ['$scope', '$interval'/*,'$cordovaLocalNotification'*/,'processoSrv', 'utilSrv',
    'constanteSrv',
    function ($scope, $interval/*, $cordovaLocalNotification*/, processoSrv, utilSrv, constanteSrv) {

        $scope.umPorVez = true;
        $scope.listaProcessos = [];
        $scope.estiloAtualizado = {'background-color': '#FFFFFF'};

        this.init = function () {

            processoSrv.buscarTodosProcessos()
                .then(function (resultado) {
                    $scope.listaProcessos = resultado;
                }
            )
        };

        $scope.remover = function (numeroProcesso) {

            processoSrv.removerProcesso(numeroProcesso, $scope.listaProcessos);

            //TODO: retornar msg de erro para usuario caso não consiga remover processo.
        };

        $scope.exibirTransferencia = function(idTipoMovimentacao)
        {
            if ((idTipoMovimentacao == constanteSrv.TIPO_MOVIMENTACAO_TRANSFERENCIA)
                ||(idTipoMovimentacao == constanteSrv.TIPO_MOVIMENTACAO_DESPACHO_TRANSFERENCIA)
                ||(idTipoMovimentacao == constanteSrv.TIPO_MOVIMENTACAO_DESPACHO_INTERNO_TRANSFERENCIA)
                ||(idTipoMovimentacao == constanteSrv.TIPO_MOVIMENTACAO_TRANSFERENCIA_EXTERNA)
                ||(idTipoMovimentacao == constanteSrv.TIPO_MOVIMENTACAO_DESPACHO_TRANSFERENCIA_EXTERNA))
            {
                return true;
            }
            return false;
        };

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

        $scope.atualizarTodosProcessos = function(){

            utilSrv.exibirMensagem("Atualizando...");

            processoSrv.atualizarTodosProcessos($scope.listaProcessos)
                .then(function(){
                    utilSrv.esconderMensagem();

                },function(msgErro){
                        utilSrv.esconderMensagem();
                    }
                );
        };

        var promiseAtualizarTodosProcessos= $interval(
            function() {
                processoSrv.atualizarTodosProcessos($scope.listaProcessos)
                    .then( function(){
                        //criar notificações
                       //notificarUsuarioAtualizacaoProcessos();
                    });
            } ,10000); //10s

        $scope.$on('$destroy', function() {
            $interval.cancel(promiseAtualizarTodosProcessos);
        });

        this.init();

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


modController.controller('CadastrarProcessoController', ['$scope', '$state', '$ionicModal', 'processoSrv', 'utilSrv', '$cordovaDialogs',
    function ($scope, $state, $ionicModal, processoSrv, utilSrv, $cordovaDialogs) {

        $scope.numProcesso = "";
        $scope.descricao = "";
        $scope.mensagem = "";

        $ionicModal.fromTemplateUrl('modalAlerta.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function(modal) {
            $scope.modal = modal;
        });
        $scope.abrirModal = function() {
            $scope.modal.show();
        };
        $scope.fecharModal = function() {
            $scope.modal.hide();
        };
        //Cleanup the modal when we're done with it!
        $scope.$on('$destroy', function() {
            $scope.modal.remove();
        });

        $scope.salvar = function () {

            utilSrv.exibirMensagem("Cadastrando processo...");

            processoSrv.buscarProcessoSIGA($scope.numProcesso)
                .then(function(resposta) {

                    var respostaJson = JSON.parse(resposta);

                    if (!respostaJson.erro) {
                        var movimentacoes = resposta;
                        var dataUltimaMovimentacao = respostaJson.resposta[0].dataEvento;


                        processoSrv.processoEstaCadastrado($scope.numProcesso)
                            .then(function (estaCadastrado) {

                                utilSrv.esconderMensagem();

                                if (!estaCadastrado) {
                                    processoSrv.inserirProcesso($scope.numProcesso, $scope.descricao, dataUltimaMovimentacao, movimentacoes);
                                    $state.go("home");
                                }
                                else {
                                    $scope.mensagem = "Esse processo já se encontra cadastrado!";
                                    $scope.abrirModal();
                                }
                            },
                            function(msgErro)
                            {
                                utilSrv.esconderMensagem();
                                /*$scope.mensagem = msgErro;
                                $scope.abrirModal();*/
                                $cordovaDialogs.alert(msgErro,'Erro', 'Ok');
                            }
                        );
                    }
                    else {
                        utilSrv.esconderMensagem();
                        $scope.mensagem = respostaJson.erro;
                        $scope.abrirModal();
                    }
                },
                function(msgErro) {
                    utilSrv.esconderMensagem();
                    /*$scope.mensagem = msgErro;
                    $scope.abrirModal();*/
                    $cordovaDialogs.alert(msgErro,'Erro', 'Ok');
                }
            );
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