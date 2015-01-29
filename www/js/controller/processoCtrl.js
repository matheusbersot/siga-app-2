var modController = angular.module('myApp.controllers');

modController.controller('ProcessoController', ['$scope', 'DB', 'processoSrv', '$stateParams', '$ionicModal', '$state',
    function ($scope, DB, processoSrv, $stateParams, $ionicModal, $state) {

        $scope.numProcesso = $stateParams.numProcesso;
        $scope.descricao = $stateParams.descricao;
        $scope.mensagem = "Esse processo já se encontra cadastrado!";

        $scope.readOnly = true;
        $scope.umPorVez = true;

        $scope.listaProcessos = [];

        this.init = function () {
            processoSrv.buscarTodosProcessos()
                .then(function (dadosProcessos) {
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

                if (!processoSrv.processoCadastrado($scope.numProcesso,$scope.listaProcessos)) {
                    processoSrv.inserirProcesso($scope.numProcesso, $scope.descricao, dataUltimaMovimentacao, movimentacoes);
                    $state.go("home");
                }
                else {
                    $scope.mensagem = "Esse processo já se encontra cadastrado!"
                    $scope.openModal();
                }
            }
            else {
                $scope.mensagem = "Número do processo é inválido!"
                $scope.openModal();
            }
        };

        $scope.editar = function () {
            processoSrv.editarProcesso($scope.numProcesso, $scope.descricao);
        };

        $scope.remover = function (codProcesso) {

            var achou = false;
            var i = 0;
            while ((!achou) && (i < $scope.listaProcessos.length)) {
                if ($scope.listaProcessos[i].numero == codProcesso) {
                    $scope.listaProcessos.splice(i, 1);
                    processoSrv.removerProcesso(codProcesso);
                    achou = true;
                };
                ++i;
            };
        };

        this.init();


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