angular.module('myApp.services')
    .factory('processoSrv', ['DB', function (DB) {
        var self = this;

        self.montarObjProcessos = function (dadosProcessos) {

            var arrayObjProcessos= [];

            for (var i = 0; i < dadosProcessos.length; ++i) {
                var objProcesso = self.montarObjProcesso(dadosProcessos[i]);

                arrayObjProcessos.push(objProcesso);
            }

            return arrayObjProcessos;
        };

        self.montarObjProcesso = function (dadosProcesso) {

            var objProcesso = {};
            objProcesso["descricao"] =  dadosProcesso.descricao;
            objProcesso["numero"] =  dadosProcesso.codProcesso;
            objProcesso["movimentacoes"] = self.montarObjMovimentacoes(dadosProcesso.movimentacoes);

            return objProcesso;
        };

        self.montarObjMovimentacoes = function(movimentacoes)
        {
            var respostaJson = JSON.parse(movimentacoes);
            var dados = respostaJson.resposta;

            for(var i=0; i<dados.length; ++i)
            {
                dados[i]["primeira"] = (i==0) ? true: false;
            }

            return dados;
        };

        self.buscarProcessoSIGA = function (numeroProcesso) {

            /* buscar movimentacoes do processo */
            var url = "http://200.20.0.58:8080/sigaex/servicos/ExService";

            var params = new SOAPClientParameters();
            params.add("numeroProcesso", numeroProcesso);

            var resposta = SOAPClient.invoke(url, "consultaMovimentacaoProcesso2", params, false, null);
            return resposta;
        };

        self.buscarTodosProcessos = function () {
            return DB.query('SELECT * FROM processo')
                .then(function (resultado) {
                    dados = DB.fetchAll(resultado);
                    return dados;
                },
                function (razao) {
                    console.log('Falhou: ' + razao.message);
                });
        };

        self.processoCadastrado = function (codProcesso, listaProcessos) {

            var achou = false;
            var i = 0;
            while ((!achou) && (i < listaProcessos.length)) {
                if (listaProcessos[i].numero == codProcesso) {
                    achou = true;
                };
                ++i;
            };
            return achou;
        };

        self.editarProcesso = function (codProcesso, descricao) {
            return DB.query('UPDATE processo SET descricao = ?  WHERE codProcesso = ?',
                [descricao, codProcesso])
                .then(function (resultado) {
                    console.log("Atualizou "+ resultado.rowsAffected + " registro(s) na tabela");
                },
                function (razao) {
                    console.log('Falhou: ' + razao.message);
                });
        }

        self.removerProcesso = function (codProcesso) {
            return DB.query('DELETE from processo WHERE codProcesso = ?', [codProcesso])
                .then(function (resultado) {
                    console.log("Removeu "+resultado.rowsAffected+" registro(s) na tabela.");
                },
                function (razao) {
                    console.log('Falhou: ' + razao.message);
                });
        };

        self.inserirProcesso = function (numeroProcesso, descricao, dataUltimaMovimentacao, movimentacoes) {

            return DB.query('INSERT INTO processo (codProcesso, descricao, dataUltimaMovimentacao, movimentacoes) VALUES (?,?,?,?)',
                [numeroProcesso, descricao, dataUltimaMovimentacao, movimentacoes])
                .then(function (resultado) {
                    console.log("Inseriu registro com ID "+resultado.insertId+" na tabela");
                },
                function (razao) {
                    console.log('Falhou: ' + razao.message);
                });

        };

        self.atualizarProcesso = function (numeroProcesso, dataUltimaMovimentacao, movimentacoes) {
            return DB.query('UPDATE processo SET dataUltimaMovimentacao = ?  and movimentacoes = ? WHERE codProcesso = ?',
                [dataUltimaMovimentacao, movimentacoes, numeroProcesso])
                .then(function (resultado) {
                    console.log("Atualizou "+resultado.rowsAffected+" registro(s) na tabela.");
                },
                function (razao) {
                    console.log('Falhou: ' + razao.message);
                });
        };



        return self;
    }]);
