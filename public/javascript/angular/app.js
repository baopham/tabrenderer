// Source: http://odetocode.com/blogs/scott/archive/2013/07/03/building-a-filereader-service-for-angularjs-the-service.aspx
var app = angular.module('tabrenderer', []); 

(function (module) {

  var fileReader = function ($q, $log) {

    var onLoad = function(reader, deferred, scope) {
      return function () {
        scope.$apply(function () {
          deferred.resolve(reader.result);
        });
      };
    };

    var onError = function (reader, deferred, scope) {
      return function () {
        scope.$apply(function () {
          deferred.reject(reader.result);
        });
      };
    };

    var onProgress = function(reader, scope) {
      return function (event) {
        scope.$broadcast("fileProgress",
                         {
                           total: event.total,
                           loaded: event.loaded
                         });
      };
    };

    var getReader = function(deferred, scope) {
      var reader = new FileReader();
      reader.onload = onLoad(reader, deferred, scope);
      reader.onerror = onError(reader, deferred, scope);
      reader.onprogress = onProgress(reader, scope);
      return reader;
    };

    var readAsText = function (file, scope) {
      var deferred = $q.defer();

      var reader = getReader(deferred, scope);         
      reader.readAsText(file);

      return deferred.promise;
    };

    return {
      readAsText: readAsText
    };
  };

  module.factory("fileReader", ["$q", "$log", fileReader]);

}(angular.module("tabrenderer")));

var UploadController = function ($scope, fileReader) {
  $scope.getFile = function () {
    $scope.progress = 0;
    fileReader.readAsText($scope.file, $scope)
                  .then(function(result) {
                      $scope.tabularInput = result;
                  });
  };

  $scope.$on("fileProgress", function(e, progress) {
    $scope.progress = progress.loaded / progress.total;
  });
};

app.directive("ngFileSelect",function() {

  return {
    link: function($scope, elem) {
      
      elem.bind("change", function(e) {
        $scope.file = (e.srcElement || e.target).files[0];
        $scope.getFile();
      });

    }
  }
  
});

