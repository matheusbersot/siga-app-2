var modController = angular.module('myApp.controllers');

modController.controller('HomeProcessoController', ['$scope', 'processoSrv',  '$interval', '$cordovaLocalNotification',
    function ($scope, processoSrv, $interval,$cordovaLocalNotification) {

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

        var notificarUsuarioAtualizacaoProcessos = function()
        {
            for(var i = 0; i < $scope.listaProcessos.length; ++i)
            {
                if($scope.listaProcessos[i].atualizou)
                {
                    $cordovaLocalNotification.add({
                        id: i,
                        message:    "Descrição: " + $scope.listaProcessos[i].descricao,
                        title:      'Atualização de Processo',
                        repeat:     'daily',
                        autoCancel: true
                    });
                }
            }
        }

        $scope.$watch(function () {
            return processoSrv.atualizou;
        }, function () {
            if (processoSrv.atualizou) {
                $scope.listaProcessos = processoSrv.listaProcessos;
                processoSrv.listaProcessos = [];

                //criar notificações
                notificarUsuarioAtualizacaoProcessos();
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

        var promiseAtualizarTodosProcessos;
        promiseAtualizarTodosProcessos= $interval(function() { processoSrv.atualizarTodosProcessos($scope.listaProcessos); } ,60000); //60s

        $scope.$on('$destroy', function() {
            $interval.cancel(promiseAtualizarTodosProcessos);
        });

    }]);

modController.controller('EditarProcessoController', ['$scope', 'processoSrv', '$stateParams',
    function ($scope, processoSrv, $stateParams) {

        $scope.numProcesso = $stateParams.numProcesso;
        $scope.descricao = $stateParams.descricao;

        $scope.somenteLeitura = true;

        $scope.editar = function () {
            processoSrv.editarProcesso($scope.numProcesso, $scope.descricao);
        };

    }]);


modController.controller('CadastrarProcessoController', ['$scope', 'processoSrv', '$state', '$ionicModal',
    function ($scope, processoSrv, $state, $ionicModal) {

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
        // Execute action on hide modal
        $scope.$on('modal.hidden', function() {
            // Execute action
        });
        // Execute action on remove modal
        $scope.$on('modal.removed', function() {
            // Execute action
        });

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
                            $scope.mensagem = "Esse processo já se encontra cadastrado!";
                            $scope.openModal();
                        }
                    }
                );
            }
            else {
                $scope.mensagem = "Número do processo é inválido!";
                $scope.openModal();
            }
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
})