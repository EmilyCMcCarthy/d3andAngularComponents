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

    var margin = {top: 100, right: 100, bottom: 100, left: 100};
    var width = 1000 - margin.left - margin.right;
    var height = 1000 - margin.top - margin.bottom;

     /*var arrMonthInd = [];

      for(let i = 1; i <= $scope.timeArray; i++){
        arrMonthInd.push(i);
      }*/

      $scope.rawData = [{"id":1, "name":"Jane", "data": [{"month": "September 2016", "value":1}, {"month": "October 2016", "value":21}, {"month": "November 2016", "value": 287}, {"month": "December 2016", "value": 150}, {"month": "January 2017", "value": 115}]},{"id":2, "name":"Christopher", "data": [{"month": "September 2016", "value":79}, {"month": "October 2016", "value": 199}, {"month": "November 2016", "value":156}, {"month": "December 2016", "value": 177}, {"month": "January 2017", "value": 49}]}, {"id":3, "name":"Max", "data": [{"month": "September 2016", "value": 280}, {"month": "October 2016", "value":284}, {"month": "November 2016", "value": 90}, {"month": "December 2016", "value": null}, {"month": "January 2017", "value": 49}]}];

         var jitter = function(value, range){ // function to accomplish the Jitter -- Value input is 1,2,3..., or N of months
        var min = value - range;
        var max = value + range;
        var random = Math.round(((Math.random()*(max - min) + min))*10000) / 10000;
          return random
      };
      
      var formatData = function(initialData){ 
      var resArr = [];
    

      for(let i =0 ; i < initialData.length; i++){
        var dataArr;

        dataArr = []


        initialData[i].data.forEach(function(elem, ind){
                    var monthV = $scope.timeArray.indexOf(elem.month) + 1;
                    //var monthV = monthValue(elem.month);
                    if(elem.value || elem.value ===0 ){
                    
                        var rObj = {};


                    rObj.month = monthV// need to make a function for months -- What if there are missing months for a student.. etc.
                    rObj.x =  jitter(monthV, 0.45);// need to figure out how to pull in my jitter function
                    rObj.y = elem.value;
                    rObj.id = initialData[i].id;
                    rObj.name = initialData[i].name;

                    dataArr.push(rObj)
                    

                     
                    }
                    


        });


          
        resArr.push(dataArr);
      }

      
      return resArr
  }


      $scope.formattedData = formatData($scope.rawData);




    var svg = d3.select($el[0]).append("svg")
    .attr({width: width + margin.left + margin.right, height: height + margin.top + margin.bottom})
    .attr("viewBox", "0 0 " + (width + margin.right + margin.left) + " " + (height + margin.bottom + margin.top));

    var chart = svg.append("g");
      chart.attr("transform", "translate(" + margin.left + "," + margin.top + ")")
      

      chart.append("text").attr("id", "loading")
        .text("Loading...")
        //.attr("transform", "translate(200,250)");

        var update = function () {

          var data =$scope.formattedData//[{"id":1, "name":"Jane", "data": [{"month": "September 2016", "value":1}, {"month": "October 2016", "value":21}, {"month": "November 2016", "value": 287}, {"month": "December 2016", "value": 150}, {"month": "January 2017", "value": 115}]},{"id":2, "name":"Christopher", "data": [{"month": "September 2016", "value":79}, {"month": "October 2016", "value": 199}, {"month": "November 2016", "value":156}, {"month": "December 2016", "value": 177}, {"month": "January 2017", "value": 49}]}, {"id":3, "name":"Max", "data": [{"month": "September 2016", "value": 280}, {"month": "October 2016", "value":284}, {"month": "November 2016", "value": 90}, {"month": "December 2016", "value": null}, {"month": "January 2017", "value": 49}]}];
          var mergedData = [].concat.apply([], data);
          console.log(data, "dataaaaa")
          console.log(mergedData, "mergedData")

          var yMax = d3.max(mergedData, function(d){return d.y}) * 1.1

          var valueline = d3.svg.line()
          .x(function(d) { return x(d.x); })
          .y(function(d) { return y(d.y); })
          .interpolate("linear");

        chart.selectAll("*").remove();

        console.log(data, "data")
        console.log($scope, "$scope")
        if (data.length) chart.select("#loading").remove();

        chart.attr("transform", "translate(" + margin.left + "," + margin.top + ")")

        var x = d3.scale.linear().domain([0.5, ($scope.timeArray.length + 1) + 0.5]).range([0,width]).nice();

        var y = d3.scale.linear().domain([0,yMax + 20]).range([height, 0]).nice();
                 
    


        var xAxis = d3.svg.axis()
            .scale(x)
            .orient("bottom")
            .innerTickSize(height)
            .outerTickSize(1)
            .tickPadding(1)


              var yAxis = d3.svg.axis()
            .scale(y)
            .orient("left")
            .innerTickSize(-(width))
          
            .outerTickSize(1)
            .tickPadding(1)

        var yAxisGrid = yAxis.ticks(7).orient("left")

         xAxis.ticks($scope.timeArray.length + 1)
        .tickFormat(function(d, i){

          return $scope.timeArray[i]
        }).orient("bottom")
        
        var xAxisGrid = xAxis.ticks($scope.timeArray.length + 1)
        .tickFormat(function(d, i){
          return $scope.timeArray[i]
        })


//console.log(arrMonthInd, "arrMonthInd")
        var annoM = chart.append("g")

      .attr("class", "annotation")
      .selectAll(".annotationMonth")
      .data($scope.timeArray, function(d, i ){ return i + 1})
      .enter()

      annoM.append("rect")

      .attr("x", function(d, i){ 
        console.log(i, "arguments")
        return x((i + 1)-0.5)})
      .attr("y", function(){return 0})
      .attr("width", (width ) / ($scope.timeArray.length + 1))
      .attr("height", height)
      .attr("fill",function(d){
        if(d % 2 === 0){
          return "#ffffff"
        }
        else{
          return "#f9f9f7"

        }
      })
      .attr("stroke", "#e3e2dc")
      .attr("stroke-width", 1)



           chart.append("g")
     .classed('x', true)
     .classed('grid', true)
     .call(xAxisGrid)
     .attr("opacity", 0)


     chart.append("g")
     .classed('y', true)
     .classed('grid', true)
     .call(yAxisGrid)
     
           chart.append("g")
        .attr("class", "xAxis")
        //.attr("transform", "translate(0," + (height) + ")")
        .call(xAxis)
        //.attr("stroke", "green")
      
 chart.append("g")
        .attr("class", "yaxis")
        //.attr("transform", "translate("+2*padding+",0)")
        .call(yAxis)
        //.attr("stroke", "#e3e1dc")

         chart.append("g")
      .attr("class", "visibleCircles")

      .selectAll("circleTest")
      .data(mergedData, function(d, i){
      
        return i})
      .enter()
      .append("circle")
     /* .on("click", function(a,b,c){
          
            
                $scope.$emit('graphClick', a, b, c)      
          })
          //.attr("class", "point") */
          .attr("class", function(a,b,c){
            console.log(arguments, "arguments inside visible circles")
            return "point_series" + a.id
          }) 
        .attr("r", 5)
        .attr("fill", function(d, idx, dataIdx){

          if(d.id === $scope.activeObj.student){
            return "#ef6640";

          }
          else{
            return "#7a9ef2";
          }
        })

        .attr("cx", function(d){ return x(d.x);})
        .attr("cy", function(d) { return y(d.y);})

      var selection = chart.selectAll(".series").data(data, function (d, i) { return i })

      var SVG2 = selection.enter().append("g")


      var enter1 = SVG2.attr("class", function(d,i){return i})



      SVG2.append("path")
      .attr("class",function(d){

        
      return "display_series" + d[0].id}) //".line_series"
      .attr("stroke", "#ef6640")

      .attr("stroke-width",3)
      .attr("opacity",0)
      .attr("fill", "none")
      .attr("d", function(d){
   
        return valueline(d)
      })  

    

      





          
        }


        var updateActive = function(){

        }

        var resize = function(){

        }

          //$scope.$on('windowResize',resize);
          //$scope.$on('updateChart', updateActive)  
          $scope.$watch('d3Data', update);

  }

   /* var link = function($scope, $el, $attrs){
      var svg = d3.select($el[0]).append("svg")
      .attr({width: 1000, height: 1000})
      var rectH =100;
      var rectW = 500;
      var chart = svg.append("g");
      var update = function(){
        var boxes = chart.append("g")
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
  
 			$scope.listClick(a.id, 'student')

      $scope.$apply();
       
      })

      boxes.append("text")
      .attr("x", function(d, i){ return 20})
      .attr("y", function(d, i){return i*rectH + 50})
        
      .text(function (d) {  return  d.name
        })
         .attr("font-size", "40px")
          .attr("class", function(d){
          return "student_list_text_" + d.id;
          })
         .attr("fill", function(d,i){
      
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
            update()
          }
         
        }, true)


    }*/

    return {
    	 template: '<div class="scatter-chart "></div>',
      //templateUrl: 'js/components/lit-pro-chart/scatter-chart/scatter-chart.html',
      replace: true,
      scope: {
        items: '=rawdata',
        apples: '=',
        activeObj: '=activeobj',
        listClick: '=listclick',
        timeArray: '=timearray'
      },
      link: link,
      restrict: 'E'
    }

  }]

    )