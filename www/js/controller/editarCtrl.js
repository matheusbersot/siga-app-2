var modController = angular.module('myApp.controllers');

modController.controller('EditarController', ['$scope', 'DB', '$stateParams', function ($scope, DB, $stateParams) {

    $scope.numProcesso = $stateParams.numProcesso;
    $scope.descricao = $stateParams.descricao;
    $scope.readOnly = true;


    $scope.editar = function () {
        editarProcesso($scope.numProcesso, $scope.descricao);
    }

    var editarProcesso = function (numeroProcesso, descricao) {
        return DB.query('UPDATE processo SET descricao = ?  WHERE codProcesso = ?',
            [descricao, numeroProcesso])
            .then(function (resultado) {
                console.log("Atualizou "+ resultado.rowsAffected + " registro(s) na tabela");
            },
            function (razao) {
                console.log('Falhou: ' + razao.message);
            });
    }

}]);