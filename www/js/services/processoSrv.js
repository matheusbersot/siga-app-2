angular.module('myApp.services')
    .factory('processoSrv', ['$q', /*'$cordovaNetwork', */ 'utilSrv', 'processoDbSrv', 'Processo',
        function ($q , /*$cordovaNetwork,*/ utilSrv, processoDbSrv, Processo){

        var self = this;

        self.buscarProcessoSIGA = function (numeroProcesso) {

            var deferred = $q.defer();

            //if ($cordovaNetwork.isOnline())
            //{
                // buscar movimentacoes do processo //
                var url = "https://sistemas.uff.br/sigaex/servicos/ExService";

                var params = new SOAPClientParameters();
                params.add("numeroProcesso", numeroProcesso);

                deferred.resolve(SOAPClient.invoke(url, "consultaMovimentacaoProcesso", params, false, null));
            //}
            //else
            //{
            //  deferred.reject("Não há conexão com a internet!");
            //}

            return deferred.promise;
        };


        self.buscarTodosProcessos = function () {

            var deferred = $q.defer();

            processoDbSrv.buscarTodosProcessos()
                .then(function (dadosProcessos) {

                    var vetorProcessos = [];

                    for (var i = 0; i < dadosProcessos.length; ++i) {
                        var processo = new Processo(dadosProcessos[i]);
                        vetorProcessos.push(processo);
                    }
                    deferred.resolve(vetorProcessos);
                },
                function(msgErro)
                {
                    deferred.reject(msgErro);
                });

            return deferred.promise;
        };

        self.editarProcesso = function(codProcesso, descricao)
        {
            var deferred = $q.defer();

            processoDbSrv.editarProcesso(codProcesso, descricao)
                .then(function (resultado){
                    deferred.resolve(resultado);
                },
                function(msgErro)
                {
                    deferred.reject(msgErro);
                });

            return deferred.promise;
        };

        self.removerProcesso= function(codProcesso, vetorProcessos)
        {
            var deferred = $q.defer();

            processoDbSrv.removerProcesso(codProcesso)
                .then(function(resultado)
                {
                    _.remove(vetorProcessos, 'numero', codProcesso);
                    deferred.resolve(resultado);
                },
                function(msgErro)
                {
                    deferred.reject(msgErro);
                });

            return deferred.promise;
        };

        self.processoEstaCadastrado = function(codProcesso)
        {
            var deferred = $q.defer();

            processoDbSrv.processoEstaCadastrado(codProcesso)
                .then(function(resultado)
                {
                    deferred.resolve(resultado);
                },
                function(msgErro)
                {
                    deferred.reject(msgErro);
                });

            return deferred.promise;
        }

        self.inserirProcesso = function(codProcesso, descricao, dataUltimaMovimentacao, movimentacoes)
        {
            var deferred = $q.defer();

            processoDbSrv.inserirProcesso(codProcesso, descricao, dataUltimaMovimentacao, movimentacoes)
                .then(function(resultado)
                {
                    deferred.resolve(resultado);
                },
                function(msgErro)
                {
                    deferred.reject(msgErro);
                });

            return deferred.promise;
        }


            /*self.listaProcessos = [];
            self.atualizou = false;

            self.atualizarTodosProcessos = function (listaDeProcessos) {

                var deferred = $q.defer();

                if(utilSrv.estaNoHorarioComercial()){
                    var atualizou = false;
                    var listaProcessos = listaDeProcessos;

                    for (var i = 0; i < self.listaProcessos.length; ++i) {

                        self.atualizaProcesso(self.listaProcessos[i])
                            .then(function(resposta){
                                deferred.resolve(resposta);
                        }, function(razaoErro)
                            {
                                deferred.reject(razaoErro);
                            });
                    }
                }
            };

            self.atualizarProcesso = function(processo)
            {
                var deferred = $q.defer();

                //busca processo no servidor
                self.buscarProcessoSIGA(processo.numero)
                    .then(function(resposta) {

                        var respostaJson = JSON.parse(resposta);

                        if (!respostaJson.erro) {

                            var movimentacoes = resposta;
                            var dataUltimaMovimentacao = respostaJson.resposta[0].dataEvento;
                            var objMovimentacoes = self.montarObjMovimentacoes(movimentacoes);

                            //verifica se há movimentações novas
                            if (objMovimentacoes.length != processoAtual.movimentacoes.length) {

                                var objProcesso = processo;

                                // se houver, atualiza os dados do processo
                                self.atualizarProcesso(dataUltimaMovimentacao, movimentacoes, processo.numero)
                                    .then(function () {
                                        objProcesso.dataUltimaMovimentacao = dataUltimaMovimentacao;
                                        objProcesso.movimentacoes = objMovimentacoes;
                                        objProcesso.atualizou = true;
                                        self.atualizou = true;

                                        deferred.resolve("Atualizou");
                                    }
                                )
                            }
                        }
                        else
                        {
                            deferred.reject("Erro");
                        }
                    },
                    function(razaoErro)
                    {
                        deferred.reject(razaoErro);
                    });
            };*/

        return self;
    }]);
