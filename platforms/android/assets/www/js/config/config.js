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