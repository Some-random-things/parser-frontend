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
        var prepositionExactMatch = false;
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

        var setPrepositionExactMatch = function(newPrepositionExactMatch) {
            prepositionExactMatch = newPrepositionExactMatch;
        };

        var getPrepositionExactMatch = function() {
            return prepositionExactMatch;
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
                rightWordExactMatch: getRightWordExactMatch(),
                prepositionExactMatch: getPrepositionExactMatch()
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
                    _.each(data.data, function(link){
                        link.count = parseInt(link.count);
                    })
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
            setPrepositionExactMatch: setPrepositionExactMatch,
            getPrepositionExactMatch: getPrepositionExactMatch,
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
            leftWordExactMatch: $location.search()['leftWordExactMatch'] || true,
            rightWordExactMatch: $location.search()['rightWordExactMatch'] || true,
            prepositionExactMatch: $location.search()['prepositionExactMatch'] || true
        }

        $scope.types = [
            {
                id: 0,
                name: 'Глагол + Наречие',
                properties: 'V,ADV',
                leftProperties: 'V',
                rightProperties: 'ADV'
            },
            {
                id: 1,
                name: 'Глагол + Существительное',
                properties: 'V,N',
                leftProperties: 'V',
                rightProperties: 'N'
            },
            {
                id: 2,
                name: 'Деепричастие + Наречие',
                properties: 'TRV,ADV',
                leftProperties: 'TRV',
                rightProperties: 'ADV'
            },
            {
                id: 3,
                name: 'Деепричастие + Существительное',
                properties: 'TRV,N',
                leftProperties: 'TRV',
                rightProperties: 'N'
            },
            {
                id: 4,
                name: 'Прилагательное + Наречие',
                properties: 'ADJ,ADV',
                leftProperties: 'ADJ',
                rightProperties: 'ADV'
            },
            {
                id: 5,
                name: 'Прилагательное + Существительное',
                properties: 'ADJ,N',
                leftProperties: 'ADJ',
                rightProperties: 'N'
            }
        ]
        if ($location.search()['type'] && $location.search()['type'].length > 0) $scope.selected = _.findWhere($scope.types, {id: parseInt($location.search()['type'])})

        $scope.wordLeftSelectedProperties = $location.search()['leftProperties'] || [];
        $scope.wordRightSelectedProperties = $location.search()['rightProperties'] || [];

        $scope.field = '-count'
        $scope.setField = function(field){
            if($scope.field === field){
                if($scope.field.indexOf('-') > -1){
                    $scope.field = $scope.field.substring(1, $scope.field.length)
                } else {
                    $scope.field = '-' + $scope.field;
                }
            } else {
                $scope.field = field;
            }
        }

        $scope.$watch('selected', function(newval){
            if(newval != null){
                $location.search({
                    'leftWord': ($scope.params.leftWord) ? $scope.params.leftWord : null,
                    'rightWord': ($scope.params.rightWord) ? $scope.params.rightWord : null,
                    'preposition': ($scope.params.preposition) ? $scope.params.preposition : null,
                    'leftWordExactMatch': ($scope.params.leftWordExactMatch) ? $scope.params.leftWordExactMatch : null,
                    'rightWordExactMatch': ($scope.params.rightWordExactMatch) ? $scope.params.rightWordExactMatch : null,
                    leftProperties: newval.leftProperties,
                    rightProperties: newval.rightProperties,
                    type: newval.id
                })
                $scope.wordLeftSelectedProperties = [newval.leftProperties]
                $scope.wordRightSelectedProperties = [newval.rightProperties]
                dataService.setLeftSelectedProperties([newval.leftProperties])
                dataService.setRightSelectedProperties([newval.rightProperties])
            }
        })

        $('#leftWord').autocomplete({
            lookup: function(query, done){
                $http.get('http://ams2.imilka.co/linksapi/public/words?query='+query+'&type=leftWord&properties='+ $scope.getWordSelectedProperties($scope.wordLeftSelectedProperties))
                    .success(function(data){
                        var result = {
                            suggestions: []
                        }
                        _.each(data.words, function(word){
                            result.suggestions.push({
                                value: word
                            })
                        })
                        done(result)
                    })
            },
            onSelect: function (suggestion) {
                $scope.params.leftWord = suggestion.value;
            }
        });
        $('#preposition').autocomplete({
            lookup: function(query, done){
                $http.get('http://ams2.imilka.co/linksapi/public/words?query='+query+'&type=preposition')
                    .success(function(data){
                        var result = {
                            suggestions: []
                        }
                        _.each(data.words, function(word){
                            result.suggestions.push({
                                value: word
                            })
                        })
                        done(result)
                    })
            },
            onSelect: function (suggestion) {
                $scope.params.preposition = suggestion.value;
            }
        });
        $('#rightWord').autocomplete({
            lookup: function(query, done){
                $http.get('http://ams2.imilka.co/linksapi/public/words?query='+query+'&type=rightWord&properties='+ $scope.getWordSelectedProperties($scope.wordRightSelectedProperties))
                    .success(function(data){
                        var result = {
                            suggestions: []
                        }
                        _.each(data.words, function(word){
                            result.suggestions.push({
                                value: word
                            })
                        })
                        done(result)
                    })
            },
            onSelect: function (suggestion) {
                $scope.params.rightWord = suggestion.value;
            }
        });

        $scope.countQuery = function(){
            //TODO заменить
            //if(a != undefined && a.length > 2) {
                $scope.loading = true;
                $scope.setParams();
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
                    if($scope.selected.id !== 1) $scope.prepositionsExist = false;
                })
                $location.search({
                    'leftWord': ($scope.params.leftWord) ? $scope.params.leftWord : null,
                    'rightWord': ($scope.params.rightWord) ? $scope.params.rightWord : null,
                    'preposition': ($scope.params.preposition) ? $scope.params.preposition : null,
                    'leftWordExactMatch': ($scope.params.leftWordExactMatch) ? $scope.params.leftWordExactMatch : null,
                    'rightWordExactMatch': ($scope.params.rightWordExactMatch) ? $scope.params.rightWordExactMatch : null,
                    leftProperties: $scope.wordLeftSelectedProperties.join(),
                    rightProperties: $scope.wordRightSelectedProperties.join(),
                    type: $scope.selected ? $scope.selected.id : 1
                });
           // }
        }

        $scope.onClick = function(){
            dataService.setLeftSelectedProperties($scope.getWordSelectedProperties($scope.wordLeftSelectedProperties));
            dataService.setRightSelectedProperties($scope.getWordSelectedProperties($scope.wordRightSelectedProperties));
            dataService.sendCountRequest();
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
            dataService.setPrepositionExactMatch($scope.params.prepositionExactMatch);
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
            /*var selectedPropertiesArray = [];
            for(var i in selectedPropertiesObjects) {
                if(selectedPropertiesObjects[i].ticked) {
                    selectedPropertiesArray.push(selectedPropertiesObjects[i].handle);
                }
            }*/
            return selectedPropertiesObjects;
        }

        //initial request
        $timeout(function(){
           // dataService.setLeftSelectedProperties($scope.getWordSelectedProperties($scope.wordLeftSelectedProperties));
           // dataService.setRightSelectedProperties($scope.getWordSelectedProperties($scope.wordRightSelectedProperties));
            $scope.countQuery();
        }, 100)



    })
