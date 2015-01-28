// Ionic Starter App

// Inicializando módulos
angular.module('myApp.config',[]);
angular.module('myApp.services', ['myApp.config']);
angular.module('myApp.controllers', ['myApp.services', 'ui.router', 'ui.bootstrap']);


// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'

angular.module('myApp', ['ionic', 'ui.router', 'ui.bootstrap', 'myApp.controllers', 'myApp.services', 'myApp.config'])

    .run(function ($ionicPlatform, DB) {
        $ionicPlatform.ready(function () {
            // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
            // for form inputs)
            if (window.cordova && window.cordova.plugins.Keyboard) {
                cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
            }
            if (window.StatusBar) {
                StatusBar.styleDefault();
            }

            //Inicializando o banco de dados
            DB.init();
        });
    })