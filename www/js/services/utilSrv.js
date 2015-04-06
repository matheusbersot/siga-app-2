angular.module('myApp.services')
    .factory('utilSrv', ['$ionicLoading', function ($ionicLoading) {

        var self = this;

        self.estaNoHorarioComercial = function()
        {
            var dtHoraLocal = new Date();
            var dtHoraUTC = dtHoraLocal.getTime() + (dtHoraLocal.getTimezoneOffset() * 60000);
            var fusoHorarioBrasilia = -3.0;

            var dtHoraBrasilia = new Date(dtHoraUTC + (3600000*fusoHorarioBrasilia));
            var dia = dtHoraBrasilia.getUTCDay();
            var hora = dtHoraBrasilia.getHours();

            if((dia !== 0 && dia !== 6) && (hora>=9 && hora<= 18))
              return true;

            return false;
        }

        self.exibirMensagem = function(msg)
        {
            $ionicLoading.show({
                template: "<ion-spinner></ion-spinner><br/>"+ msg
            });
        }

        self.esconderMensagem = function(){
            $ionicLoading.hide();
        };

        return self;

    }]);

