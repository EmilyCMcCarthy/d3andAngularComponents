'use strict';


angular
  .module( 'app.components.litProChart')
  .directive( 'studentListChart', function(){

    var link = function(scope, el, attrs){
      scope.sortColumn = 'name'
      scope.sortF = function(type){

        if(scope.mySort === type){
          return "-" + type;
        }
        else{
          return type
        }


      }
      scope.sortCheck = function(type){

        if(type === scope.mySort){
          return 'sort_active';
        }
        else if("-" + type === scope.mySort){
          return 'sort_active';
        }
        else{
          return 'sort_inactive';
        }
      }
      scope.activeCheck = function(id){
        if (scope.activeObj.students.indexOf(id) === -1){
          return 'student_list_inactive'
        }
        else {
          return 'student_list_active'
        }
      }
    }

    return {
      templateUrl: 'js/components/lit-pro-chart/student-list-chart/student-list-chart.html',
      replace: true,
      scope: {
        items: '=rawdata',
        activeObj: '=activeobj',
        listClick: '=listclick'
      },
      link: link,
      restrict: 'E'
    }

  })

