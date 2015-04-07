angular.module('myApp.services')
    .factory('processoSrv', ['$q', '$timeout'/*,'$cordovaNetwork'*/, 'utilSrv', 'processoDbSrv', 'constanteSrv', 'Processo',
        function ($q , $timeout/*, $cordovaNetwork*/, utilSrv, processoDbSrv, constanteSrv, Processo){

        var self = this;

        self.buscarProcessoSIGA = function (numeroProcesso) {

            var deferred = $q.defer();

            //if ($cordovaNetwork.isOnline())
            //{
                // buscar movimentacoes do processo //
                var url = "https://sistemas.uff.br/sigaex/servicos/ExServic";

                var params = new SOAPClientParameters();
                params.add("numeroProcesso", numeroProcesso);

                $timeout(function() {
                           try{
                               return SOAPClient.invoke(url, "consultaMovimentacaoProcesso", params, false, null);
                           }catch(err)
                           {
                               deferred.reject(err.message);
                           };
                        } , constanteSrv.TIMEOUT_EXECUCAO_WEBSERVICE)
                    .then(function(resposta)
                    {
                        deferred.resolve(resposta);
                    },
                    function(msgErro)
                    {
                        deferred.reject(msgErro);
                    });

            /*}
            else
            {
              deferred.reject("Não há conexão com a internet!");
            }*/

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

        self.editarProcesso = function(numeroProcesso, descricao)
        {
            var deferred = $q.defer();

            processoDbSrv.editarProcesso(numeroProcesso, descricao)
                .then(function (resultado){
                    deferred.resolve(resultado);
                },
                function(msgErro)
                {
                    deferred.reject(msgErro);
                });

            return deferred.promise;
        };

        self.removerProcesso= function(numeroProcesso, vetorProcessos)
        {
            var deferred = $q.defer();

            processoDbSrv.removerProcesso(numeroProcesso)
                .then(function(resultado)
                {
                    _.remove(vetorProcessos, 'numero', numeroProcesso);
                    deferred.resolve(resultado);
                },
                function(msgErro)
                {
                    deferred.reject(msgErro);
                });

            return deferred.promise;
        };

        self.processoEstaCadastrado = function(numeroProcesso)
        {
            var deferred = $q.defer();

            processoDbSrv.processoEstaCadastrado(numeroProcesso)
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

        self.inserirProcesso = function(numeroProcesso, descricao, dataUltimaMovimentacao, movimentacoes)
        {
            var deferred = $q.defer();

            processoDbSrv.inserirProcesso(numeroProcesso, descricao, dataUltimaMovimentacao, movimentacoes)
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

        self.atualizarTodosProcessos = function (vetorProcessos) {

            var deferred = $q.defer();

            if(utilSrv.estaNoHorarioComercial() && vetorProcessos.length > 0){

                for (var i = 0; i < vetorProcessos.length; ++i) {

                    self.atualizarProcesso(vetorProcessos[i])
                        .then(function(resposta){
                            deferred.resolve(resposta);
                    },
                    function(razaoErro)
                    {
                        deferred.reject(razaoErro);
                    });
                }
            }
            else
            {
                deferred.reject("Não está no horário comercial!");
            }

            return deferred.promise;
        };

        self.atualizarProcesso = function(processo)
        {
            var deferred = $q.defer();

            //busca processo no servidor
            self.buscarProcessoSIGA(processo.numero)
                .then(function(movimentacoesJson) {

                    var resultado = JSON.parse(movimentacoesJson);

                    if (!resultado.erro) {

                        var vetorMovimentacoes = resultado.resposta;
                        var dataUltimaMovimentacao = vetorMovimentacoes[0].dataEvento;

                        //verifica se há movimentações novas
                        if (vetorMovimentacoes.length != processo.movimentacoes.length) {

                            // se houver, atualiza os dados do processo
                            processoDbSrv.atualizarProcesso(dataUltimaMovimentacao, movimentacoesJson, processo.numero)
                                .then(function () {
                                    processo.dataUltimaMovimentacao = dataUltimaMovimentacao;
                                    processo.setMovimentacoes(movimentacoesJson);
                                    processo.atualizou = true;

                                    deferred.resolve(true);
                                },
                                function (msgErro) {
                                    deferred.reject(msgErro);
                                }
                            )
                        }
                        else
                        {
                            deferred.resolve(false);
                        }
                    }
                    else
                    {
                        deferred.reject(respostaJson.erro);
                    }
                },
                function(msgErro)
                {
                    deferred.reject(msgErro);
                });
            return deferred.promise;
        };

        return self;
    }]);
