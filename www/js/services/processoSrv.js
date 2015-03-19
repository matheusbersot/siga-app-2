angular.module('myApp.services')
    .factory('processoSrv', ['$interval', '$q', /*'$cordovaNetwork',*/ 'DB', 'utilSrv',
        function ($interval, $q /*, $cordovaNetwork*/, DB, utilSrv) {
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

            var deferred = $q.defer();

            //if ($cordovaNetwork.isOnline())
            //{
                //só atualiza se estiver dentro do horário comercial 09:00 às 18:00 de Segunda a Sexta.
                /* buscar movimentacoes do processo */
                var url = "http://192.168.1.50:8081/sigaex/servicos/ExService";

                var params = new SOAPClientParameters();
                params.add("numeroProcesso", numeroProcesso);

                deferred.resolve(SOAPClient.invoke(url, "consultaMovimentacaoProcesso", params, false, null));
            /*}
            else
            {
             deferred.reject("{\"erro\": \"Não há conexão com a internet!\"}");
            }*/

            return deferred.promise;
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

            return DB.query('UPDATE processo SET dataUltimaMovimentacao = ?, movimentacoes = ? WHERE codProcesso = ?',
                [dataUltimaMovimentacao, movimentacoes, numeroProcesso])
                .then(function (resultado) {
                    console.log("Atualizou " + resultado.rowsAffected + " registro(s) na tabela.");
                },
                function (razao) {
                    console.log('Falhou: ' + razao.message);
                });
        };

        self.listaProcessos = [];
        self.atualizou = false;

        self.atualizarTodosProcessos = function (listaDeProcessos) {

            if(utilSrv.estaNoHorarioComercial()){
                self.atualizou = false;
                self.listaProcessos = listaDeProcessos;

                for (var i = 0; i < self.listaProcessos.length; ++i) {

                    processoAtual = self.listaProcessos[i];

                    //busca processo no servidor
                    self.buscarProcessoSIGA(processoAtual.numero)
                        .then(function(resposta) {

                            var respostaJson = JSON.parse(resposta);

                            if (!respostaJson.erro) {

                                var movimentacoes = resposta;
                                var dataUltimaMovimentacao = respostaJson.resposta[0].dataEvento;
                                var objMovimentacoes = self.montarObjMovimentacoes(movimentacoes);

                                //verifica se há movimentações novas
                                if (objMovimentacoes.length != processoAtual.movimentacoes.length) {

                                    var objProcesso = self.listaProcessos[i];

                                    // se houver, atualiza os dados do processo
                                    self.atualizarProcesso(dataUltimaMovimentacao, movimentacoes, self.listaProcessos[i].numero)
                                        .then(function () {
                                            objProcesso.dataUltimaMovimentacao = dataUltimaMovimentacao;
                                            objProcesso.movimentacoes = objMovimentacoes;
                                            objProcesso.atualizou = true;
                                            self.atualizou = true;
                                        }
                                    )
                                }
                            }
                        });
                }
            }
        };

        return self;
    }]);
