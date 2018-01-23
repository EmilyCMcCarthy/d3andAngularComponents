'use strict';

/**
 * @ngdoc module
 * @name app.components: studentList
 * @description
 * # app.components: studentList
 * Module for listing out the students in the class
 */
angular
  .module( 'app.components.litProChart', [
   
  ] ) 
  .directive( 'litProChart', [function(){

    var link = function($scope, $el, $attrs){

     // console.log($scope, "scope in lit ProChart")
    }

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
      link: link,
      //postLink: postLink,
      restrict: 'E',
      controller: LitProChartController,
      controllerAs: 'chartCtrl'
    }

  }]

    )






  function LitProChartController($rootScope, $scope, $window) {

   $window.addEventListener('resize', function () {
      $scope.$broadcast('windowResize');
    });


     var vm = this;
    vm.activeObj = {type: "student", students: [], previousStudents: [], cat: null, previousCat: null};

      vm.listClick = function(id, type, cat, catIds, time){
        console.log("inside list click", id)
      //console.log("clicking scope", $scope)
     // console.log(vm.activeObj, "activeObj in ")
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
            vm.activeObj.previousCat = vm.activeObj.cat
       
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

          if(vm.activeObj.type === 'student'){
            vm.activeObj.previousStudents = vm.activeObj.students;
          
          }

          vm.activeObj.previousCat = vm.activeObj.cat
          vm.activeObj.previousStudents = vm.activeObj.students;
          vm.activeObj.cat = cat + "_" + time;
          vm.activeObj.students = catIds
          vm.activeObj.type = "cat"



        }
     

      }

      console.log(vm.activeObj, "active obj in parent")
  
    }


 // console.log(d3,"d3")
  // console.log("$window in litprochartCtrler", $window)

  vm.formattedData = null;


  vm.apples = ["A", "B", "C"]
  // Lifecycle Hooks
  /****************************************************************/
  //   For API data calls and initializing variables
  this.$onInit = function() {
    // vm.showUserMenu = false;
  };
  //   For API calls that affect UI
  this.$postLink = function() {};
  //   listeners
  this.$onChanges = function() {};
  //   cleanup of component
  this.$onDestroy = function() {
 
  };


  // Public Methods
  /****************************************************************/

  //vm.students = $rootScope.studentData//["Jane", "Christopher", "Max"]
  //vm.activeStudent = $rootScope.activeStudent





}