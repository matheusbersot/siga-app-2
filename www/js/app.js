// Ionic Starter App

// Inicializando módulos
angular.module('myApp.config', []);
angular.module('myApp.services', []);
angular.module('myApp.controllers', []);

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'

angular.module('myApp', ['ionic', 'ngCordova', 'ui.router', 'ui.bootstrap', 'ui.mask', 'myApp.controllers', 'myApp.services', 'myApp.config'])

    .config(function ($stateProvider, $urlRouterProvider) {

        //$urlRouterProvider.otherwise('/home');

        $stateProvider
            .state('home', {
                url: '/home',
                templateUrl: 'home.html',
                cache: false
            })
            .state('cadastrar', {
                url: '/cadastrar',
                templateUrl: 'cadastrar.html',
                cache: false
            })
            .state('editar', {
                url: '/editar/:numProcesso/:descricao',
                templateUrl: 'editar.html',
                cache: false
            });

    })


    .run(function ($ionicPlatform, DB, $state, $cordovaSplashscreen) {
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
            DB.init().then(function(valor)
            {
                $cordovaSplashscreen.hide();
                $state.go("home");
            });
        })
    });

