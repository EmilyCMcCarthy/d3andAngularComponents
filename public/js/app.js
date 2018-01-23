
'use strict';

var litproApp = angular.module('app',[
	'app.components'

	]).run(function ($rootScope, $http){
		$rootScope.activeStudent = undefined;
		$rootScope.numberOfMonths = 5;
    $http.get('data/studentRawData.json')
    .then(function(res){
      $rootScope.studentRawData = res.data;
      $rootScope.chartType = 'scatter';
      $rootScope.profileType = 'group';
      $rootScope.timeArray = ['09/01/2016', '10/01/2016', '11/01/2016', '12/01/2016', '01/01/2017'];
      $rootScope.valueType = ['Number of Minutes', 'Minutes'];
      $rootScope.progress = true;
    })
    $http.get('data/studentRawData2.json')
    .then(function(res){
      $rootScope.studentRawData2 = res.data;
      $rootScope.chartType2 = 'multiSeriesBar';
      $rootScope.profileType2 = 'group';
      $rootScope.timeArray2 = ['September 2016', 'October 2016', 'November 2016', 'December 2016', 'January 2017'];
      $rootScope.valueType2 = ['Number of Goals', 'Goals'];
      $rootScope.progress2 = true;
    })
	})
  .controller('appCtrl', ['$scope', '$window', '$rootScope', function($scope, $window, $rootScope){
    $scope.helloObj = {name: "Emily", greeting: "Welcome!"}
  }])


// BELOW IS SOME BOILERPLATE FROM THE EXAMPLE FILE I WAS WORKING OFF OF  

/**
 * Helper functions
 */
var util = {


_getFromLocalStorageOrCookie: function(param)
    {
      if (localStorage.getItem(param) !== null) {
        return localStorage.getItem(param);
      }
      
      return null;
    },

/**
 * Extracts JWT token from url passed to the app or queries cookies / local storage for saved value
 * @param location - URL string from browser
 * @param $q - q service from Angular

 * @returns promise
 */
  _extractOrRetrieveUrlToken:function (location, $q) {
  var defer = $q.defer();

  // have to set this manually and update, if APP_TOKEN constant changes, as no access to app scope here
  var localStorageTokenName = 'LitProToken';
  // have to set this manually and not update, since this is only used here
  var localStorageApiUrlTokenName = 'LitProApiUrl';

  var urlHasToken = /\?token=/.test(location);
  if (urlHasToken) {
    var lastIndex = location.lastIndexOf('=');
    var urlToken;
    urlToken = location.slice((lastIndex + 1));
    var parsedToken = util._parseJwt(urlToken);
    if (!!parsedToken.apiBaseUrl) {
      this._saveToCookieAndLocalStorage(localStorageApiUrlTokenName, parsedToken.apiBaseUrl);
      this._saveToCookieAndLocalStorage(localStorageTokenName, urlToken);
    }
    defer.resolve(parsedToken);
  }
  else if (this._getFromLocalStorageOrCookie(localStorageTokenName) !== null && this._getFromLocalStorageOrCookie(localStorageApiUrlTokenName) !== null) {
      defer.resolve({'apiBaseUrl': this._getFromLocalStorageOrCookie(localStorageApiUrlTokenName)});
  } else {
    //defer.reject('<p>Unable to authenticate application. Please close this window and login via SDM portal.</p>');
  }
  return defer.promise;
},

};

/**
 * Starting up the app
 */

// fetchData then bootstrap application
function fetchData() {
  var initInjector = angular.injector(['ng']);
  var $q = initInjector.get('$q');

  var defer = $q.defer();
  var location = window.location.href;

  util._extractOrRetrieveUrlToken(location, $q).then(function(result){
    // set constants
    litproApp.constant('API_BASE_URL', result.apiBaseUrl);
    defer.resolve(true);
  }).catch(function (err) {
    litproApp.constant('API_BASE_URL', null);
    defer.reject(err);
  });

  return defer.promise;
}


/**
 * Activating Angular on document
 */
function bootstrapApplication() {
  angular.element(document).ready(function() {
    angular.bootstrap(document, ['app']);
  });
}

/**
 * Parse / restore data necessary for the app to work - e.g. constants
 */
fetchData().then(bootstrapApplication).catch(function(err){
  document.body.innerHTML = err;
});



