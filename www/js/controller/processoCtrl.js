var modController = angular.module('myApp.controllers');

modController.controller('HomeProcessoController', ['$scope', 'processoSrv',
    function ($scope, processoSrv) {

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

modController.controller('EditarProcessoController', ['$scope', 'processoSrv', '$stateParams',
    function ($scope, processoSrv, $stateParams) {

        $scope.numProcesso = $stateParams.numProcesso;
        $scope.descricao = $stateParams.descricao;

        $scope.somenteLeitura = true;

        $scope.editar = function () {
            processoSrv.editarProcesso($scope.numProcesso, $scope.descricao);
        };

    }]);


modController.controller('CadastrarProcessoController', ['$scope', 'processoSrv', '$state',
    function ($scope, processoSrv, $state) {

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