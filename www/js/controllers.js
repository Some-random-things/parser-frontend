/**
 * Created by Pavel on 07.10.14.
 */
angular.module('starter.controllers', [])

.service('dataService', function() {
  var data = {};
  var queryString = "";
  var loading = false;

  var setData = function(newData) {
    data = newData;
    setLoading(false)
  };

  var getData = function() {
    return data;
  };

  var setQueryString = function(newQueryString) {
    queryString = newQueryString;
    setLoading(true)
  };

  var getQueryString = function() {
    return queryString;
  };

  var isLoading = function() {
    return loading;
  }

  var setLoading = function(newLoading) {
    loading = newLoading;
  }

  return {
    setData: setData,
    getData: getData,
    setQueryString: setQueryString,
    getQueryString: getQueryString,
    isLoading: isLoading,
    setLoading: setLoading
  };

})

.controller('QueryCtrl', function($scope, $state, $stateParams, $http, $filter, dataService){

    $scope.params = $state.params;
    dataService.setQueryString($scope.params.query);

    $scope.loading = true;
    $http.get("http://ams2.imilka.co/api/links?query="+$scope.params.query)
        .success(function (data, status, headers, config) {
                if(dataService.getQueryString() == data.query) {
                  dataService.setData(data.data);
                }
        })
        .error(function(){
          dataService.setLoading(false)
        });

    $scope.getData = function() {
      return dataService.getData();
    }
})
.controller('MainCtrl', function($scope, $state, $stateParams, $location, $http, $filter, dataService){
    $scope.countQuery = function(a){
        if(a != undefined && a.length > 2)
        $location.path('main/query/'+a);
    }

    $scope.wordLeft = true;
    $scope.wordRight = true;
    $scope.partOfSpeechLongLeft = true;
    $scope.partOfSpeechLongRight = true;
    $scope.count = true;

    $scope.counter = 0;

    $scope.queryString = function() {
      return dataService.getQueryString();
    };

    $scope.isLoading = function() {
      return dataService.isLoading();
    };

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
