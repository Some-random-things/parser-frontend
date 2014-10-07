// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('starter', ['ionic', 'starter.controllers'])

.config(function($stateProvider, $urlRouterProvider){
        $stateProvider
            .state('main', {
                url: '/main',
                templateUrl: "views/main.html",
                controller: 'MainCtrl'
            })
            .state('main.query', {
                url: '/query/:query',
                views:{
                    'query' :{
                        templateUrl: 'views/query.html',
                        controller: 'QueryCtrl'
                    }
                }
            })
            .state('main.list', {
                url: '/list',
                templateUrl: 'views/partial-home-list.html',
                controller: function($scope) {
                    $scope.dogs = ['Bernese', 'Husky', 'Goldendoodle'];
                }
            })
        $urlRouterProvider.otherwise('/main');
})
    .config(['$httpProvider', function($httpProvider) {
        $httpProvider.defaults.useXDomain = true;
        $httpProvider.defaults.withCredentials = true;
        delete $httpProvider.defaults.headers.common["X-Requested-With"];
        $httpProvider.defaults.headers.common["Accept"] = "application/json";
        $httpProvider.defaults.headers.common["Content-Type"] = "application/json";
    }
    ])