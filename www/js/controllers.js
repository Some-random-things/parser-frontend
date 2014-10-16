/**
 * Created by Pavel on 07.07.07.
 */
angular.module('starter.controllers', ['multi-select'])

.service('dataService', function() {
  var data = {};
  var queryString = "";
  var loading = false;

  var leftSelectedProperties = [];
  var rightSelectedProperties = [];

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
  };

  var setLoading = function(newLoading) {
    loading = newLoading;
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

  return {
    setData: setData,
    getData: getData,
    setQueryString: setQueryString,
    getQueryString: getQueryString,
    isLoading: isLoading,
    setLoading: setLoading,
    getLeftSelectedProperties: getLeftSelectedProperties,
    getRightSelectedProperties: getRightSelectedProperties,
    setLeftSelectedProperties: setLeftSelectedProperties,
    setRightSelectedProperties: setRightSelectedProperties
  };

})

.controller('QueryCtrl', function($scope, $state, $stateParams, $http, $filter, dataService){

    $scope.params = $state.params;
    dataService.setQueryString($scope.params.query);

    $scope.loading = true;
    $http.get("http://ams2.imilka.co/api/links?" +
        "query=" + $scope.params.query +
        "&leftProperties=" + dataService.getLeftSelectedProperties() +
        "&rightProperties=" + dataService.getRightSelectedProperties())
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

    $scope.wordLeftSelectedProperties = [];
    $scope.wordRightSelectedProperties = [];

    $scope.countQuery = function(a){
      if(a != undefined && a.length > 2) {
        dataService.setLeftSelectedProperties($scope.getWordSelectedProperties($scope.wordLeftSelectedProperties));
        dataService.setRightSelectedProperties($scope.getWordSelectedProperties($scope.wordRightSelectedProperties));
        $location.path('main/query/'+ a);
      }
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
})
