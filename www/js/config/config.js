var modConfig = angular.module('myApp.config');

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

modConfig.config(function ($stateProvider) {

    $stateProvider
        .state('home', {
            url: '/home',
            templateUrl: 'home.html',
            cache: false
        })
        .state('cadastrar', {
            url: '/cadastrar',
            templateUrl: 'cadastrar.html',
            cache: false
        })
        .state('editar', {
            url: '/editar/:numProcesso/:descricao',
            templateUrl: 'editar.html',
            cache: false
        });

});