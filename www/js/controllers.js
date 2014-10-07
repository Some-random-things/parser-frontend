/**
 * Created by Pavel on 07.10.14.
 */
angular.module('starter.controllers', [])

.controller('QueryCtrl', function($scope, $state, $stateParams, $http){

$scope.params = $state.params;
    $scope.loading = true;
    $http.get("http://ams2.imilka.co:8080/links/count?query="+$scope.params.query)
        .success(function (data, status, headers, config) {
            console.log(data)
            $scope.data = data;
            $scope.loading = false;
        })

})
.controller('MainCtrl', function($scope, $state, $stateParams, $location){
    $scope.count = function(a){
        if(a != undefined)
        $location.path('main/query/'+a);
    }
    $scope.wordLeft = true;
    $scope.wordRight = true;

    $scope.options = {
        1 : {text: 'Левое слово', model: 'wordLeft', checked: true }
    }

})
