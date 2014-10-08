/**
 * Created by Pavel on 07.10.14.
 */
angular.module('starter.controllers', [])

.controller('QueryCtrl', function($scope, $state, $stateParams, $http, $filter){

    $scope.params = $state.params;

    $scope.loading = true;
    $http.get("http://ams2.imilka.co/api/links/count?query="+$scope.params.query)
        .success(function (data, status, headers, config) {
                console.log(data)
                $scope.data = data;
                // $scope.data = $filter('filter')($scope.data, { wordLeft: {partOfSpeechShort:  } });
                $scope.loading = false;
        })
        .error(function(){
            $scope.loading = false;
        })

})
.controller('MainCtrl', function($scope, $state, $stateParams, $location, $http, $filter){
    $scope.countQuery = function(a){
        if(a != undefined)
        $location.path('main/query/'+a);
    }

    $scope.wordLeft = true;
    $scope.wordRight = true;
    $scope.partOfSpeechLongLeft = true;
    $scope.partOfSpeechLongRight = true;
    $scope.count = true;

    $scope.counter = 0;

    $scope.queryString = ""

    $scope.wordLeftProperties = [
        {name: "Глагол", ticked: true  },
        {name: "Существительное", ticked: true },
        {name: "Прилагательное", ticked: true  },
        {name: "Наречие", ticked: true },
        {name: "Местоимение", ticked: true }
    ];
    $scope.wordRightProperties = [
        {name: "Глагол", ticked: true  },
        {name: "Существительное", ticked: true },
        {name: "Прилагательное", ticked: true  },
        {name: "Наречие", ticked: true },
        {name: "Местоимение", ticked: true }
    ];
    //массивы выбранных объектов в селекторах
    $scope.wordLeftSelectedProperties = [];
    $scope.wordRightSelectedProperties = [];
})
