var modController = angular.module('myApp.controllers');

modController.controller('HomeController', ['$scope', 'DB', function ($scope, DB) {

    $scope.umPorVez = true;

    $scope.processos = [
        {
            descricao: 'AAAAAAAAAAAA',
            numero: '111111111111111111',
            movimentacoes: [
                {
                    primeira: true,
                    dataEvento: "11/11/2011",
                    tipoEvento: "Movimentação",
                    lotacao: "STI"
                },
                {
                    primeira: false,
                    dataEvento: "11/11/2011",
                    tipoEvento: "Recebimento",
                    lotacao: "STI"
                }
            ]
        },
        {
            descricao: 'BBBBBBBBBBBB',
            numero: '222222222222222222',
            movimentacoes: [
                {
                    primeira: true,
                    dataEvento: "22/22/2022",
                    tipoEvento: "Movimentação",
                    lotacao: "DRAD"
                },
                {
                    primeira: false,
                    dataEvento: "22/22/2022",
                    tipoEvento: "Recebimento",
                    lotacao: "DRAD"
                }
            ]
        }
    ];

}]);


modController.config(function($stateProvider, $urlRouterProvider) {

    $urlRouterProvider.otherwise('/home');

    $stateProvider.state('home', {
        url: '/home',
        views: {
            home: {
                templateUrl: 'home.html'
            }
        }
    });

    $stateProvider.state('cadastro', {
        url: '/cadastro',
        views: {
            cadastro: {
                templateUrl: 'cadastro.html'
            }
        }
    });
});