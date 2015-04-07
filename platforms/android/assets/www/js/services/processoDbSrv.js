angular.module('myApp.services')
    .factory('processoDbSrv', ['DB',
        function (DB){

            var self = this;

            self.buscarTodosProcessos = function () {
                return DB.query('SELECT * FROM processo')
                    .then(function (resultado) {
                        return DB.fetchAll(resultado);
                    },
                    function (razao) {
                        console.log('Falhou: ' + razao.message);
                    });
            };

            self.processoEstaCadastrado = function (numeroProcesso) {

                return DB.query('SELECT * FROM processo WHERE numeroProcesso = ?',
                    [numeroProcesso])
                    .then(function (resultado) {
                        var dados = DB.fetch(resultado);
                        return (dados!= null)? (dados && dados.length > 0) : false;
                    },
                    function (razao) {
                        console.log('Falhou: ' + razao.message);
                    });
            };

            self.editarProcesso = function (numeroProcesso, descricao) {
                return DB.query('UPDATE processo SET descricao = ?  WHERE numeroProcesso = ?',
                    [descricao, numeroProcesso])
                    .then(function (resultado) {
                        console.log("Atualizou " + resultado.rowsAffected + " registro(s) na tabela");
                    },
                    function (razao) {
                        console.log('Falhou: ' + razao.message);
                    });
            };

            self.removerProcesso = function (numeroProcesso) {
                return DB.query('DELETE from processo WHERE numeroProcesso = ?', [numeroProcesso])
                    .then(function (resultado) {
                        console.log("Removeu " + resultado.rowsAffected + " registro(s) na tabela.");
                    },
                    function (razao) {
                        console.log('Falhou: ' + razao.message);
                    });
            };

            self.inserirProcesso = function (numeroProcesso, descricao, dataUltimaMovimentacao, movimentacoes) {

                return DB.query('INSERT INTO processo (numeroProcesso, descricao, dataUltimaMovimentacao, movimentacoes) VALUES (?,?,?,?)',
                    [numeroProcesso, descricao, dataUltimaMovimentacao, movimentacoes])
                    .then(function (resultado) {
                        console.log("Inseriu registro com ID " + resultado.insertId + " na tabela");
                    },
                    function (razao) {
                        console.log('Falhou: ' + razao.message);
                    });

            };

            self.atualizarProcesso = function (dataUltimaMovimentacao, movimentacoes, numeroProcesso) {

                return DB.query('UPDATE processo SET dataUltimaMovimentacao = ?, movimentacoes = ? WHERE numeroProcesso = ?',
                    [dataUltimaMovimentacao, movimentacoes, numeroProcesso])
                    .then(function (resultado) {
                        console.log("Atualizou " + resultado.rowsAffected + " registro(s) na tabela.");
                    },
                    function (razao) {
                        console.log('Falhou: ' + razao.message);
                    });
            };

            return self;
        }]);
