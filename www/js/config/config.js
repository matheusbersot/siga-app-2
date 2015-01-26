var modConfig = angular.module('myApp.config',[]);

modConfig.config(function($stateProvider, $urlRouterProvider) {

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

modConfig.constant('DB_CONFIG', {
        name: 'DB',
        tables: [
            {
                name: 'processo',
                columns: [
                    {name: 'id', type: 'integer primary key'},
                    {name: 'codProcesso', type: 'text'},
                    {name: 'descricao', type: 'text'},
                    {name: 'dataUltimaMovimentacao', type: 'text'},
                    {name: 'movimentacoes', type: 'text'}
                ]
            }
        ]
    });
