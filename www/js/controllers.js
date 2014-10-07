/**
 * Created by Pavel on 07.10.14.
 */
angular.module('starter.controllers', [])

.controller('QueryCtrl', function($scope, $state, $stateParams, $http){

$scope.params = $state.params;



})
.controller('MainCtrl', function($scope, $state, $stateParams, $location, $http){
    $scope.count = function(a){
        if(a != undefined)
        $location.path('main/query/'+a);
    }
    $scope.wordLeft = true;
    $scope.wordRight = true;

    $scope.optio = {
        1 : {text: 'Левое слово', model: 'wordLeft', checked: true }
    }
        $scope.counter = 0;

        $scope.queryString = "";

        $scope.sendQuery = function(a){
            console.log(a)
            $scope.loading = true;
            $scope.counter += 1;
            $http.get("http://ams2.imilka.co/api/links/count?query="+a)
                .success(function (data, status, headers, config) {
                    $scope.counter -= 1;
                    if($scope.counter == 0){
                        console.log(data)
                        $scope.data = data;
                        $scope.loading = false;
                    }
                })
        }

        $scope.showOptions = function(name){
        }
        
        $scope.options = [
            {id: 'partOfSpeechLeft', name: 'Часть речи (Л)', values: ['Глагол', 'Существительное'] },
            {id: 'partOfSpeechLeft', name: 'Часть речи (П)', values: ['Глагол', 'Существительное'] }
        ];

        $scope.wordProperties = [
            {name: "Глагол",              maker: "",        ticked: true  },
            {name: "Существительное",  maker: "",             ticked: true },
            {name: "Прилагательное",            maker: "",    ticked: true  },
            {name: "Наречие",             maker: "",                 ticked: true },
            {name: "Я забыл что еще есть",             maker: "",                ticked: true  }
        ];

    })
