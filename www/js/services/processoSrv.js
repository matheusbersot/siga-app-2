angular.module('myApp.services')
    .factory('processoSrv', ['DB', '$interval', function (DB, $interval) {
        var self = this;

        self.montarObjProcessos = function (dadosProcessos) {

            var arrayObjProcessos = [];

            for (var i = 0; i < dadosProcessos.length; ++i) {
                var objProcesso = self.montarObjProcesso(dadosProcessos[i]);

                arrayObjProcessos.push(objProcesso);
            }

            return arrayObjProcessos;
        };

        self.montarObjProcesso = function (dadosProcesso) {

            var objProcesso = {};
            objProcesso["descricao"] = dadosProcesso.descricao;
            objProcesso["numero"] = dadosProcesso.codProcesso;
            objProcesso["dataUltimaMovimentacao"] = dadosProcesso.dataUltimaMovimentacao;
            objProcesso["movimentacoes"] = self.montarObjMovimentacoes(dadosProcesso.movimentacoes)
            objProcesso["atualizou"] = false;

            return objProcesso;
        };

        self.montarObjMovimentacoes = function (movimentacoes) {
            var respostaJson = JSON.parse(movimentacoes);
            var dados = respostaJson.resposta;

            for (var i = 0; i < dados.length; ++i) {
                dados[i]["primeira"] = (i == 0);
            }

            return dados;
        };

        self.buscarProcessoSIGA = function (numeroProcesso) {

            /* buscar movimentacoes do processo */
            var url = "http://200.20.0.58:8080/sigaex/servicos/ExService";

            var params = new SOAPClientParameters();
            params.add("numeroProcesso", numeroProcesso);

            return SOAPClient.invoke(url, "consultaMovimentacaoProcesso2", params, false, null);
        };

        self.buscarTodosProcessos = function () {
            return DB.query('SELECT * FROM processo')
                .then(function (resultado) {
                    return DB.fetchAll(resultado);
                },
                function (razao) {
                    console.log('Falhou: ' + razao.message);
                });
        };

        self.processoEstaCadastrado = function (codProcesso) {

            return DB.query('SELECT * FROM processo WHERE codProcesso = ?',
                [codProcesso])
                .then(function (resultado) {
                    var dados = DB.fetch(resultado);
                    return (dados && dados.length > 0);
                },
                function (razao) {
                    console.log('Falhou: ' + razao.message);
                });
        };

        self.editarProcesso = function (codProcesso, descricao) {
            return DB.query('UPDATE processo SET descricao = ?  WHERE codProcesso = ?',
                [descricao, codProcesso])
                .then(function (resultado) {
                    console.log("Atualizou " + resultado.rowsAffected + " registro(s) na tabela");
                },
                function (razao) {
                    console.log('Falhou: ' + razao.message);
                });
        };

        self.removerProcesso = function (codProcesso) {
            return DB.query('DELETE from processo WHERE codProcesso = ?', [codProcesso])
                .then(function (resultado) {
                    console.log("Removeu " + resultado.rowsAffected + " registro(s) na tabela.");
                },
                function (razao) {
                    console.log('Falhou: ' + razao.message);
                });
        };

        self.inserirProcesso = function (numeroProcesso, descricao, dataUltimaMovimentacao, movimentacoes) {

            return DB.query('INSERT INTO processo (codProcesso, descricao, dataUltimaMovimentacao, movimentacoes) VALUES (?,?,?,?)',
                [numeroProcesso, descricao, dataUltimaMovimentacao, movimentacoes])
                .then(function (resultado) {
                    console.log("Inseriu registro com ID " + resultado.insertId + " na tabela");
                },
                function (razao) {
                    console.log('Falhou: ' + razao.message);
                });

        };

        self.atualizarProcesso = function (dataUltimaMovimentacao, movimentacoes, numeroProcesso) {

            return DB.query('UPDATE processo SET dataUltimaMovimentacao = ?  and movimentacoes = ? WHERE codProcesso = ?',
                [dataUltimaMovimentacao, movimentacoes, numeroProcesso])
                .then(function (resultado) {
                    console.log("Atualizou " + resultado.rowsAffected + " registro(s) na tabela.");
                },
                function (razao) {
                    console.log('Falhou: ' + razao.message);
                });
        };



        self.listaProcessos = [];

        self.atualizarTodosProcessos = function () {

            self.buscarTodosProcessos()
                .then(function (dadosProcessos) {
                    self.listaProcessos = self.montarObjProcessos(dadosProcessos);

                    for (var i = 0; i < self.listaProcessos.length; ++i) {

                        //busca processo no servidor
                        var resposta = self.buscarProcessoSIGA(self.listaProcessos[i].numero);
                        var respostaJson = JSON.parse(resposta);

                        if (!respostaJson.erro) {
                            var movimentacoes = resposta;
                            var dataUltimaMovimentacao = respostaJson.resposta[0].dataEvento;

                            //verifica se há movimentações novas
                            if (dataUltimaMovimentacao != self.listaProcessos[i].dataUltimaMovimentacao) {
                                var objProcesso = self.listaProcessos[i];

                                // se houver, atualiza os dados do processo
                                self.atualizarProcesso(self.listaProcessos[i].numero, dataUltimaMovimentacao, movimentacoes)
                                    .then(function () {
                                        objProcesso.atualizou = true;
                                    }
                                )
                            }
                        }
                    }
                }
            );
        };

        var promiseAtualizarTodosProcessos;
        promiseAtualizarTodosProcessos= $interval(self.atualizarTodosProcessos,60000);

        return self;
    }]);