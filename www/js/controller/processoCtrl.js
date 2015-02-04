var modController = angular.module('myApp.controllers');

modController.controller('HomeProcessoController', ['$scope', 'DB', 'processoSrv',
    function ($scope, DB, processoSrv) {

        $scope.umPorVez = true;
        $scope.listaProcessos = [];
        $scope.estiloAtualizado = {'background-color': '#FFFFFF'};

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

        /*var notificarUsuarioAtualizacaoProcessos = function()
        {
            $cordovaLocalNotification.add({
                id: 'some_notification_id',
                message:    'TESTE',  // The message that is displayed
                title:      'TITULO TESTE',  // The title of the message
                repeat:     'daily',  // Either 'secondly', 'minutely', 'hourly', 'daily', 'weekly', 'monthly' or 'yearly'
                badge:      2  // Displays number badge to notification
            }).then(function () {
                console.log('callback for adding background notification');
            });
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

        this.init();

    }]);

modController.controller('EditarProcessoController', ['$scope', 'DB', 'processoSrv', '$stateParams',
    function ($scope, DB, processoSrv, $stateParams) {

        $scope.numProcesso = $stateParams.numProcesso;
        $scope.descricao = $stateParams.descricao;

        $scope.somenteLeitura = true;

        $scope.editar = function () {
            processoSrv.editarProcesso($scope.numProcesso, $scope.descricao);
        };

    }]);


modController.controller('CadastrarProcessoController', ['$scope', 'DB', 'processoSrv', '$ionicModal', '$state',
    function ($scope, DB, processoSrv, $ionicModal, $state) {

        $scope.numProcesso = "";
        $scope.descricao = "";
        $scope.mensagem = "";

        $scope.salvar = function () {

            var resposta = processoSrv.buscarProcessoSIGA($scope.numProcesso);
            var respostaJson = JSON.parse(resposta);

            if (!respostaJson.erro) {
                var movimentacoes = resposta;
                var dataUltimaMovimentacao = respostaJson.resposta[0].dataEvento;


                processoSrv.processoEstaCadastrado($scope.numProcesso)
                    .then(function (estaCadastrado) {
                        if (!estaCadastrado) {
                            processoSrv.inserirProcesso($scope.numProcesso, $scope.descricao, dataUltimaMovimentacao, movimentacoes);
                            $state.go("home");
                        }
                        else {
                            alert("Esse processo já se encontra cadastrado!");
                        }
                    }
                );
            }
            else {
                alert("Número do processo é inválido!");
            }
        };

        /* Modal operations */
        $ionicModal.fromTemplateUrl('modalMensagem.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function (modal) {
            $scope.modal = modal;
        });

        $scope.openModal = function () {
            $scope.modal.show();
        };
        $scope.closeModal = function () {
            $scope.modal.hide();
        };
        //Cleanup the modal when we're done with it!
        $scope.$on('$destroy', function () {
            $scope.modal.remove();
        });
        // Execute action on hide modal
        $scope.$on('modal.hidden', function () {
            // Execute action
        });
        // Execute action on remove modal
        $scope.$on('modal.removed', function () {
            // Execute action
        });

    }]);