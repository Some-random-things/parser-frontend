/**
 * Created by Pavel on 07.07.07.
 */
angular.module('starter.controllers', ['multi-select'])

    .service('dataService', function($http, $q) {
        var data = {};
        var queryStringLeft = "";
        var queryStringRight = "";
        var queryPreposition = "";
        var leftWordExactMatch = false;
        var rightWordExactMatch = false;
        var errorObjects = [
            {
                wordLeft:{
                    word: 'АБОНИРОВАТЬ'
                },
                wordRight:{
                    word: 'АБОНЕМЕНТ'
                }
            },
            {
                wordLeft:{
                    word: 'АБОНИРОВАТЬ'
                },
                preposition: 'В',
                wordRight:{
                    word: 'БИБЛИОТЕКА'
                }
            },
            {
                wordLeft:{
                    word: 'АБОНИРОВАТЬ'
                },
                wordRight:{
                    word: 'БУЛОЧКА'
                }
            }
        ]

        var leftSelectedProperties = [];
        var rightSelectedProperties = [];

        var setData = function(newData) {
            data = newData;
        };

        var getData = function() {
            return data;
        };

        var setQueryStringLeft = function(newQueryStringLeft) {
            queryStringLeft = newQueryStringLeft;
        };

        var getQueryStringLeft = function() {
            return queryStringLeft;
        };

        var setQueryPreposition = function(newQueryPreposition) {
            queryPreposition = newQueryPreposition;
        };

        var getQueryPreposition = function() {
            return queryPreposition;
        };

        var setQueryStringRight = function(newQueryStringRight) {
            queryStringRight = newQueryStringRight;
        };

        var getQueryStringRight = function() {
            return queryStringRight;
        };
        
        var setLeftWordExactMatch = function(newLeftWordExactMatch) {
            leftWordExactMatch = newLeftWordExactMatch;
        };

        var getLeftWordExactMatch = function() {
            return leftWordExactMatch;
        };

        var setRightWordExactMatch = function(newRightWordExactMatch) {
            rightWordExactMatch = newRightWordExactMatch;
        };

        var getRightWordExactMatch = function() {
            return rightWordExactMatch;
        };
        
        var setLeftSelectedProperties = function(newLeftSelectedProperties) {
            leftSelectedProperties = newLeftSelectedProperties;
        };

        var setRightSelectedProperties = function(newRightSelectedProperties) {
            rightSelectedProperties = newRightSelectedProperties;
        };

        var getLeftSelectedProperties = function() {
            return leftSelectedProperties.join(",");
        };

        var getRightSelectedProperties = function() {
            return rightSelectedProperties.join(",");
        };

        var sendCountRequest = function(){
            var url = "http://ams2.imilka.co/linksapi/public/links?";
            var params = "";
            var deferred = $q.defer();
            var paramsObject = {
                leftWord: getQueryStringLeft(),
                rightWord: getQueryStringRight(),
                preposition: getQueryPreposition(),
                leftProperties: getLeftSelectedProperties(),
                rightProperties: getRightSelectedProperties(),
                leftWordExactMatch: getLeftWordExactMatch(),
                rightWordExactMatch: getRightWordExactMatch()
            }
            for (var key in paramsObject) {
                if (params != "") {
                    params += "&";
                }
                params += key + "=" + encodeURIComponent(paramsObject[key]);
            }
            $http.get(url + params)
                .success(function (data, status, headers, config) {
                    //TODO тут сделать проверку с нвоым апи
                    //if(getQueryStringLeft() == data.query) {
                        deferred.resolve(data.data);
                    //}
                })
                .error(function(){
                    deferred.reject(errorObjects);
                });

            return deferred.promise;
        }

        return {
            setData: setData,
            getData: getData,
            setQueryStringLeft: setQueryStringLeft,
            setQueryStringRight: setQueryStringRight,
            getQueryStringLeft: getQueryStringLeft,
            getQueryStringRight: getQueryStringRight,
            setQueryPreposition: setQueryPreposition,
            getQueryPreposition: getQueryPreposition,
            getRightWordExactMatch: getRightWordExactMatch,
            getLeftWordExactMatch: getLeftWordExactMatch,
            setRightWordExactMatch: setRightWordExactMatch,
            setLeftWordExactMatch: setLeftWordExactMatch,
            getLeftSelectedProperties: getLeftSelectedProperties,
            getRightSelectedProperties: getRightSelectedProperties,
            setLeftSelectedProperties: setLeftSelectedProperties,
            setRightSelectedProperties: setRightSelectedProperties,
            sendCountRequest: sendCountRequest
        };

    })

    .controller('MainCtrl', function($scope, $state, $stateParams, $location, $http, $filter, dataService, $timeout){

        $scope.params = {
            leftWord: $location.search()['leftWord'] || null,
            rightWord: $location.search()['rightWord'] || null,
            preposition: $location.search()['preposition'] || null,
            leftWordExactMatch: $location.search()['leftWordExactMatch'] || false,
            rightWordExactMatch: $location.search()['rightWordExactMatch'] || false
        }

        $scope.wordLeftSelectedProperties = [];
        $scope.wordRightSelectedProperties = [];

        $scope.countQuery = function(){
            //TODO заменить
            //if(a != undefined && a.length > 2) {
                $scope.loading = true;
                $scope.setParams();
                dataService.setLeftSelectedProperties($scope.getWordSelectedProperties($scope.wordLeftSelectedProperties));
                dataService.setRightSelectedProperties($scope.getWordSelectedProperties($scope.wordRightSelectedProperties));
                dataService.sendCountRequest($scope.params.leftWord, $scope.params.rightWord, $scope.params.preposition).then(function(data){
                    $scope.loading = false;
                    $scope.data = data;
                    $scope.prepositionsExist = _.filter($scope.data, function(element){
                        return element.preposition != null
                    }).length > 0;
                }, function(errorData){
                    $scope.loading = false;
                    $scope.data = errorData;
                    $scope.prepositionsExist = _.filter($scope.data, function(element){
                        return element.preposition != null
                    }).length > 0;
                })
                $location.search({
                    'leftWord': ($scope.params.leftWord) ? $scope.params.leftWord : null,
                    'rightWord': ($scope.params.rightWord) ? $scope.params.rightWord : null,
                    'preposition': ($scope.params.preposition) ? $scope.params.preposition : null,
                    'leftWordExactMatch': ($scope.params.leftWordExactMatch) ? $scope.params.leftWordExactMatch : null,
                    'rightWordExactMatch': ($scope.params.rightWordExactMatch) ? $scope.params.rightWordExactMatch : null
                });
           // }
        }

        $scope.onClick = function(){
            dataService.setLeftWordExactMatch($scope.params.leftWordExactMatch);
            dataService.setRightWordExactMatch($scope.params.rightWordExactMatch);
            dataService.setLeftSelectedProperties($scope.getWordSelectedProperties($scope.wordLeftSelectedProperties));
            dataService.setRightSelectedProperties($scope.getWordSelectedProperties($scope.wordRightSelectedProperties));
            dataService.sendCountRequest(
                dataService.getQueryStringLeft(),
                dataService.getQueryStringRight(),
                dataService.getQueryPreposition()
            );
        }

        $scope.wordLeft = true;
        $scope.wordRight = true;
        $scope.partOfSpeechLongLeft = true;
        $scope.partOfSpeechLongRight = true;
        $scope.count = true;
        $scope.counter = 0;

        $scope.rightWordFilter = function(actual){
            return true;
        }

        $scope.setParams = function(){
            dataService.setLeftWordExactMatch($scope.params.leftWordExactMatch);
            dataService.setRightWordExactMatch($scope.params.rightWordExactMatch);
            dataService.setQueryStringLeft($scope.params.leftWord);
            dataService.setQueryStringRight($scope.params.rightWord);
            dataService.setQueryPreposition($scope.params.preposition);
        }

        $scope.wordLeftProperties = [
            {handle: "V", name: "Глагол", ticked: true  },
            {handle: "N", name: "Существительное", ticked: true },
            {handle: "ADJ", name: "Прилагательное", ticked: true  },
            {handle: "ADV", name: "Наречие", ticked: true },
            {handle: "TRV", name: "Деепричастие", ticked: true }
        ];

        $scope.wordRightProperties = [
            {handle: "V", name: "Глагол", ticked: true  },
            {handle: "N", name: "Существительное", ticked: true },
            {handle: "ADJ", name: "Прилагательное", ticked: true  },
            {handle: "ADV", name: "Наречие", ticked: true },
            {handle: "TRV", name: "Деепричастие", ticked: true }
        ];

        $scope.getWordSelectedProperties = function(selectedPropertiesObjects) {
            var selectedPropertiesArray = [];
            for(var i in selectedPropertiesObjects) {
                if(selectedPropertiesObjects[i].ticked) {
                    selectedPropertiesArray.push(selectedPropertiesObjects[i].handle);
                }
            }
            return selectedPropertiesArray;
        }

        //initial request
        $timeout(function(){
            dataService.setLeftSelectedProperties($scope.getWordSelectedProperties($scope.wordLeftSelectedProperties));
            dataService.setRightSelectedProperties($scope.getWordSelectedProperties($scope.wordRightSelectedProperties));
            $scope.countQuery();
        }, 100)



    })
