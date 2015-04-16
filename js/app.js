// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('starter', ['starter.controllers', 'multi-select', 'ui.router', 'angucomplete-alt'])

    .config(function($stateProvider, $urlRouterProvider){
            $stateProvider
                .state('main', {
                    url: '/main',
                    templateUrl: "views/main.html",
                    controller: 'MainCtrl'
                })
            $urlRouterProvider.otherwise('/main');
    })
    .config(['$httpProvider', function($httpProvider) {
            $httpProvider.defaults.useXDomain = true;
            $httpProvider.defaults.withCredentials = true;
            delete $httpProvider.defaults.headers.common["X-Requested-With"];
            $httpProvider.defaults.headers.common["Accept"] = "application/json";
            $httpProvider.defaults.headers.common["Content-Type"] = "application/json";
    }])

    .directive('ngModelOnblur', function() {
        return {
            restrict: 'A',
            require: 'ngModel',
            priority: 1, // needed for angular 1.2.x
            link: function(scope, elm, attr, ngModelCtrl) {
                if (attr.type === 'radio' || attr.type === 'checkbox') return;

                elm.unbind('input').unbind('keydown').unbind('change');
                elm.bind('blur', function() {
                    scope.$apply(function() {
                        ngModelCtrl.$setViewValue(elm.val());
                    });
                });
            }
        };
    });