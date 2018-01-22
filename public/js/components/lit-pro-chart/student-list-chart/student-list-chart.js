'use strict';

/**
 * @ngdoc module
 * @name app.components: studentList
 * @description
 * # app.components: studentList
 * Module for listing out the students in the class
 */
angular
  .module( 'app.components.litProChart')
  .directive( 'studentListChart', function(){


  

    var link = function(scope, el, attrs){
     // console.log(scope, "scope in StudentListChartA")
      //$scope.activeObj.student = $scope.students[0].name
      //console.log($scope, "scope in studentListChartB")

      
          scope.activeCheck = function(id){
           // console.log(id, "newVal from watch")

           // console.log("inside activeCheck of studentList")
      
      if(scope.activeObj.students.indexOf(id) === -1){
        return "student_list_inactive"
      }
      else{
        return "student_list_active" 
      }
    }

      //console.log(attrs,"attrs")

      

        scope.$watch('items', scope.activeCheck);
        scope.$watch('scope.activeObj.students', function(newVal, oldVal){
         // console.log("watching the activeObjc")
         
          return scope.activeCheck(1)
        }, true)
        scope.$watch(attrs.activeobj, function(){console.log("attrs changed?")}, true)
        attrs.$observe('activeobj', function(newValue){
         // console.log("active obj attr is", arguments)
        }, true)



    }


    return {
      templateUrl: 'js/components/lit-pro-chart/student-list-chart/student-list-chart.html',
      transclude: true,
      replace: true,
      scope: {
        items: '=rawdata',
        apples: '=',
        activeObj: '=activeobj',
        listClick: '=listclick'
      },
      link: link,
      restrict: 'E'
    }

  }

    )

/*
   {
    templateUrl : 'js/components/lit-pro-chart/student-list-chart/student-list-chart.html',
    bindings : {
      students: '=rawdata'
    
    },

  } )
*/
