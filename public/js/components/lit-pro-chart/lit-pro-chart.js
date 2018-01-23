'use strict';

angular
  .module( 'app.components.litProChart', []) 
  .directive( 'litProChart', [function(){

    return {
      templateUrl: 'js/components/lit-pro-chart/lit-pro-chart.html',
      replace: true,
      scope: {
        rawChartData: '=rawchartdata', // [{id: 1, name: 'Christopher', data: [{date: '', value: 50},{..},{..}]}, {id: 2. name: 'Jane', data: [{date: '', value: 100},{..},{..}]}]
        chartType: '=charttype', // 'scatter', 'combinedBar', 'multiSeriesBar'
        profileType: '=profiletype', // 'student' , 'class', 'district'
        timeArray: '=timearray', // 
        valueType: '=valuetype', // Points, Books, Goals, Minutes, etc. in the format: ["Y Axis Title", "Units"] -- i.e. ["Number Of Minutes", "Minutes"]
        progress: '=progress' // TRUE (Progress) OR FALSE (Comparison)
      },
      restrict: 'E',
      controller: LitProChartController,
      controllerAs: 'chartCtrl'
    }

  }])


function LitProChartController($rootScope, $scope, $window) {

  $window.addEventListener('resize', function () {
    console.log("window Inner  and outer H", $window.innerHeight, $window.outerHeight)
    console.log("window Inner W", $window.innerWidth, $window.outerWidth)
    $scope.$broadcast('windowResize', $window.innerHeight, $window.innerWidth);
  });


  var vm = this;
  vm.activeObj = {type: "student", students: [], previousStudents: [], cat: null, previousCat: null};

  vm.listClick = function(id, type, cat, catIds, time){
    
    if(type === 'student'){
      if(vm.activeObj.students[0] === id && vm.activeObj.students.length === 1){
        vm.activeObj.students = [];
        vm.activeObj.previousStudents = [id]
        if(vm.activeObj.previousCat){
          vm.activeObj.previousCat = null;
        }
        vm.activeObj.type = null;
      }
      else{
        if(vm.activeObj.cat){
          vm.activeObj.previousCat = vm.activeObj.cat;
          vm.activeObj.cat = null;
        }
        else{
          vm.activeObj.previousCat = null;
        }
        vm.activeObj.type = "student"
        vm.activeObj.previousStudents = vm.activeObj.students
        vm.activeObj.students = [id]
      }
    }
    else if(type === 'category'){
      if(vm.activeObj.cat === cat + "_" + time){
        vm.activeObj.previousCat = vm.activeObj.cat;
        vm.activeObj.previousStudents = vm.activeObj.students;
        vm.activeObj.cat = null;
        vm.activeObj.students = [];
        vm.activeObj.type = null;
        if(vm.activeObj.previousStudents){
          vm.activeObj.previousStudents = [];
        }
      }
      else{
        /*if(vm.activeObj.type === 'student'){
          vm.activeObj.previousStudents = vm.activeObj.students;
        }*/
        vm.activeObj.previousCat = vm.activeObj.cat
        vm.activeObj.previousStudents = vm.activeObj.students;
        vm.activeObj.cat = cat + "_" + time;
        vm.activeObj.students = catIds
        vm.activeObj.type = "cat"
      }
    }
  }

  // Lifecycle Hooks
  /****************************************************************/
  //   For API data calls and initializing variables
  this.$onInit = function() {};
  //   For API calls that affect UI
  this.$postLink = function() {};
  //   listeners
  this.$onChanges = function() {};
  //   cleanup of component
  this.$onDestroy = function() {};

}