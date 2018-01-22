// (function(){
'use strict';

/**
* @name app
* @ description
* # app
*
* Main module of the application.
*/



var litproApp = angular.module('app',[
	'app.components'

	]).run(function ($rootScope, $http){
		$rootScope.activeStudent = undefined;
		$rootScope.numberOfMonths = 5;

		$http.get('data/studentData.json')
		.then(function(res){
			$rootScope.studentData = res.data;
			console.log($rootScope.studentData, "in app run")
		})
    $http.get('data/studentRawData.json')
    .then(function(res){
      $rootScope.studentRawData = res.data;
      $rootScope.chartType = 'scatter';
      $rootScope.profileType = 'group';
      $rootScope.timeArray = ['September 2016', 'October 2016', 'November 2016', 'December 2016', 'January 2017'];
      $rootScope.valueType = ['Number of Minutes', 'Minutes'];
      $rootScope.progress = true;


      console.log($rootScope.studentRawData, "$rootScope.studentRawData")
      var formattedData = formatData($rootScope.studentRawData);
      $rootScope.formattedData = formattedData
    })
    $http.get('data/studentRawData2.json')
    .then(function(res){
      $rootScope.studentRawData2 = res.data;
      $rootScope.chartType2 = 'multiSeriesBar';
      $rootScope.profileType2 = 'group';
      $rootScope.timeArray2 = ['September 2016', 'October 2016', 'November 2016', 'December 2016', 'January 2017'];
      $rootScope.valueType2 = ['Number of Goals', 'Goals'];
      $rootScope.progress2 = true;

      console.log($rootScope.studentRawData2, "$rootScope.studentRawData")
      //var formattedData = formatData($rootScope.studentRawData);
      //$rootScope.formattedData = formattedData
    })
	})
  .controller('appCtrl', ['$scope', '$window', '$rootScope', function($scope, $window, $rootScope){
    $scope.helloObj = {name: "Emily", greeting: "Welcome!"}
 
    console.log("scope in appCtrl", $scope)
  }])


  var jitter = function(value, range){ // function to accomplish the Jitter -- Value input is 1,2,3..., or N of months
    var min = value - range;
    var max = value + range;
    var random = Math.round(((Math.random()*(max - min) + min))*10000) / 10000;
    return random
  };

  var formatData = function(initialData){ 
      var resArr = [];

      for(let i =0 ; i < initialData.length; i++){
        var obj = {
            id: initialData[i].id,
            label: initialData[i].name,
            data: initialData[i].data.map(function(elem, ind){
                    var rObj = {};
                    rObj.month = ind + 1// need to make a function for months -- What if there are missing months for a student.. etc.
                    rObj.x =  jitter(ind + 1, 0.4);// need to figure out how to pull in my jitter function
                    rObj.y = elem.value;
                    return rObj; 
            }),
            borderColor: "#719df8",
            pointBackgroundColor: "#719df8",
            pointBorderColor: "#719df8",
            pointBorderWidth: 5,
            fill: false,
            showLine: false,
            tension: 0,
            spanGaps: true
        }
        resArr.push(obj);
      }

      var DataObj = { datasets: resArr};
      return DataObj;
  }





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
// }());


