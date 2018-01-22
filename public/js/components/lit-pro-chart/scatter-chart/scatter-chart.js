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
 /* .component('scatterChart', {
  	templateUrl: 'js/components/lit-pro-chart/scatter-chart/scatter-chart.html'
  }) */


  /*
  .component( 'scatterChart', {
    templateUrl : 'js/components/lit-pro-chart/scatter-chart/scatter-chart.html',
    bindings : {
    
    },
    controller : [ LitProChartController ],
    controllerAs : 'vm'
  } )

*/
 .directive( 'scatterChart', [function($scope){


  

    var link = function($scope, $el, $attrs){
      console.log($scope, "scope in scatterchart")
      //$scope.activeObj.student = $scope.students[0].name
      //console.log($scope, "scope in studentListChartB")


      var svg = d3.select($el[0]).append("svg")
      .attr({width: 1000, height: 1000})
      // .attr("viewBox", "0 0 " + (200 + 40 ) + " " + (1000+ 40));

      console.log($scope.items, "scope items outide of update")
    
      var rectH =100;
      var rectW = 500;

      var chart = svg.append("g");

      var update = function(){
        console.log("inside the update function of d3")

      	     var boxes = chart.append("g")

      	     //console.log($scope.items, "scope.items")
      .attr("class", "boxes")
      .selectAll(".studentList")
      .data($scope.items, function(d, i ){ return d.id})
      .enter()

      boxes.append("rect")

      .attr("x", function(d, i){ return 0})
      .attr("class", function(d){
        return "student_list_box_" + d.id;
      })
      .attr("y", function(d, i){return i*rectH})
      .attr("width", rectW )
      .attr("height", rectH)
     .attr("fill", function(d, i){
        if($scope.activeObj.students.indexOf(d.id)!== -1){
          return '#eb7e61'
        }
        else{
          return '#f9f9f7'
        }
      })
      .attr("stroke", "darkgray")
      .on('click', function(a,b,c){
        console.log(a.id, "a.id")
 			$scope.listClick(a.id, 'student')

      $scope.$apply();
         //$scope.$emit('graphClick', a, b, c, "student")   
      })

      boxes.append("text")
      .attr("x", function(d, i){ return 20})
      .attr("y", function(d, i){return i*rectH + 50})
        /*.attr("class",function(d){

        
      return "display_series_point" + d.id}) */
      .text(function (d) { /*if(d.y || d.y === 0) {return d.y.toString() + "Min."}}) 
         .attr("opacity", function(d, idx, dataIdx){

         if(d.id === $scope.activeObj.student){
            return 1;

          }
          else{
            return 0;
          } */ return  d.name
        })
         .attr("font-size", "40px")
          .attr("class", function(d){
          return "student_list_text_" + d.id;
          })
         .attr("fill", function(d,i){
          console.log($scope.activeObj.students, d.id, "active students and d.id")
            if($scope.activeObj.students.indexOf(d.id)!== -1){
              return "#fdf7f5"
            }
            else{
              return "#253f73"
            }
         })

     
      .attr("stroke-width", 1)



      }


        $scope.$watch('items', update);
        $scope.$watch(function(){return $scope.activeObj.students}, function(newVal, oldVal){
          if(!angular.equals(oldVal, newVal)){
             console.log("something")
            update(1)
          }
         
        }, true)


    }

    return {
    	 template: '<div class="scatter-chart "></div>',
      //templateUrl: 'js/components/lit-pro-chart/scatter-chart/scatter-chart.html',
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

  }]

    )