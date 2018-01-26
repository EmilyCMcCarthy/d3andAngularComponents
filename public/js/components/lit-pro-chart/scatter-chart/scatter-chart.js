'use strict';


angular
  .module( 'app.components.litProChart')
  .directive( 'scatterChart', [function(){


  var link = function($scope, $el, $attrs, d, e){

    $scope.timeType = 'month' // *** Still need to incorporate into the angular system

    console.log($el[0], '$el[0]')
    var margin = {top: 50, right: 50, bottom: 100, left: 100};
    var width = 1000 - margin.left - margin.right;
    var height = 750 - margin.top - margin.bottom;


    var svg = d3.select($el[0]).append('svg')
    .attr({width: width + margin.left + margin.right, height: height + margin.top + margin.bottom})
    .attr('viewBox', '0 0 ' + (width + margin.right + margin.left) + ' ' + (height + margin.bottom + margin.top));

    var chart = svg.append('g');
      chart.attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')


      chart.append('text').attr('id', 'loading')
        .text('Loading...')
        //.attr("transform", "translate(200,250)");

        var update = function () {


    var jitter = function(value, range){ // function to accomplish the Jitter -- Value input is 1,2,3..., or N of months
      var min = value - range;
      var max = value + range;
      var random = Math.round(((Math.random() * (max - min) + min)) * 10000) / 10000;
      return random
    };

    var formatData = function(initialData){
      var resArr = [];
        for (let i = 0 ; i < initialData.length; i++){
          var dataArr = []
          initialData[i].data.forEach(function(elem, ind){
            var monthV = $scope.timeArray.indexOf(elem.date) + 1;
            if (elem.value || elem.value === 0 ){
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
    };

    $scope.formattedData = formatData($scope.items);


          var data = $scope.formattedData
          var mergedData = [].concat.apply([], data);

          var yMax = d3.max(mergedData, function(d){return d.y}) * 1.1 // ADD SPACE ON THE Y AXIS ABOVE THE MAX DATA POINT

          var valueline = d3.svg.line()
          .x(function(d) { return x(d.x); })
          .y(function(d) { return y(d.y); })
          .interpolate('linear');

        chart.selectAll('*').remove();


        if (data.length) chart.select('#loading').remove();

        chart.attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

        // CHART SCALES
        var x = d3.scale.linear().domain([0.5, $scope.timeArray.length + 0.5]).range([0, width])
.nice();

        var y = d3.scale.linear().domain([0, yMax]).range([height, 0])
.nice();


            var xAxis = d3.svg.axis()
            .scale(x)
            .orient('bottom')
            .innerTickSize(-(height))
            .outerTickSize(1)
            .tickPadding(20)
            .ticks($scope.timeArray.length)


            var yAxis = d3.svg.axis()
            .scale(y)
            //.ticks(5)
            .orient('left')
            .innerTickSize(-(width))
            .outerTickSize(1)
            .tickPadding(20)


        //var yAxisGrid = yAxis.ticks(30).orient("left")

         xAxis.ticks($scope.timeArray.length)
        .tickFormat(function(d, i){

          if ($scope.timeType === 'month'){

              return moment($scope.timeArray[i]).format('MMMM YYYY')
          }
          else {
              return $scope.timeArray[i]
          }

        }).orient('bottom')
        /*
        var xAxisGrid = xAxis.ticks($scope.timeArray.length)
        .tickFormat(function(d, i){
          return $scope.timeArray[i]
        }) */

      var annoM = chart.append('g')
      .attr('class', 'annotation')
      .selectAll('.annotationMonth')
      .data($scope.timeArray, function(d, i){ return d })
      .enter()

      annoM.append('rect')

      .attr('x', function(d, i){
      console.log(i, 'i in annoM')

        return x((i + 1) - 0.5)})
      .attr('y', function(){return 0})
      .attr('width', (width ) / ($scope.timeArray.length))
      .attr('height', height)
      .attr('class', function(d, i){
        if ((i + 1) % 2 === 0){
          return 'anno_even'
        }
        else {
          return 'anno_odd'

        }
      })


/*
      chart.append("g")
     .classed('x', true)
     .classed('grid', true)
     .call(xAxisGrid)
     .attr("opacity", 0)


         chart.append("g")
     .classed('y', true)
     .classed('grid', true)
     .call(yAxisGrid)*/

       chart.append('g')
        .attr('class', 'xAxis')
        .attr('transform', 'translate(0,' + (height) + ')')
        .call(xAxis)
        //.attr("stroke", "green")

        chart.append('g')
        .attr('class', 'yaxis')
        //.attr("transform", "translate("+2*padding+",0)")
        .call(yAxis)
        //.attr("stroke", "lightgray")
        //.attr("stroke", "#e3e1dc")

    chart.selectAll('yAxisGrid')
    .data(y.ticks)
    .enter()
    .append('line')
    .attr('class', 'y')
    .attr('x1', 0)
    .attr('x2', width)
    .attr('y1', y)
    .attr('y2', y)
    .style('stroke', '#ccc')


         chart.append('g')
      .attr('class', 'visibleCircles')

      .selectAll('circleTest')
      .data(mergedData, function(d, i){

        return i})
      .enter()
      .append('circle')
     /* .on("click", function(a,b,c){


                $scope.$emit('graphClick', a, b, c)
          })
          //.attr("class", "point") */
          .attr('class', function(a, b, c){

            return 'point_series' + a.id
          })
        .attr('r', 5)
        .attr('fill', function(d, idx, dataIdx){

          if (d.id === $scope.activeObj.students[0]){
            return '#ef6640';

          }
          else {
            return '#7a9ef2';
          }
        })

        .attr('cx', function(d){ return x(d.x);})
        .attr('cy', function(d) { return y(d.y);})

      var selection = chart.selectAll('.series').data(data, function (d, i) { return i })

      var SVG2 = selection.enter().append('g')


      var enter1 = SVG2.attr('class', function(d, i){return i})


      SVG2.append('path')
      .attr('class', function(d){


      return 'display_series' + d[0].id}) //".line_series"
      .attr('stroke', '#ef6640')

      .attr('stroke-width', 3)
      .attr('opacity', 0)
      .attr('fill', 'none')
      .attr('d', function(d){

        return valueline(d)
      })


        var labelW = (width) / 9 * 0.95 // MAX number of months at one time is 9
        var labelH = labelW * 0.4
        var space = labelH / 4;
        var triangleL = space;

       var label = enter1.selectAll('.label')
       .data(function(d){return d;})
       .enter()

       label.append('rect')
       .attr('x', function(d){
          let xV = d.x
          let mV = Math.round(d.x);
          let xC = x(xV)
          let mL = x(mV - 0.5)
          let mR = x(mV + 0.5)

          if (xC - labelW / 2 < mL){
            return mL
          }
          else if (xC + labelW / 2 > mR){
            return mR - labelW
          }
          else {
            return x(d.x) - labelW / 2
          }


        })
       .attr('y', function(d){return y(d.y) - labelH - 2 * space})
       .attr('width', labelW)
       .attr('height', labelH)
       .attr('fill', '#5d5d5c')
        .attr('class', function(d){


      return 'display_series_point' + d.id})

       .attr('opacity', function(d, idx, dataIdx){

         if (d.id === $scope.activeObj.students[0]){
            return 1;

          }
          else {
            return 0;
          }
        })


              label.append('rect')
        .attr('x', function(d){return x(d.x)})
        .attr('y', function(d){return y(d.y) - 2 * space - triangleL * Math.sqrt(2) / 2})
       .attr('transform',  function(d){
        let yP = y(d.y)  - 2 * space - triangleL * Math.sqrt(2) / 2
        return 'rotate(45 ' + x(d.x) + ' ' + yP +  ')'})
        .attr('width', triangleL)
        .attr('height', triangleL)
        .attr('fill', '#5d5d5c')
          .attr('class', function(d){


      return 'display_series_point' + d.id})
          .attr('opacity', function(d, idx, dataIdx){

         if (d.id === $scope.activeObj.students[0]){
            return 1;

          }
          else {
            return 0;
          }
        })


              label.append('line')
       .attr('x1', function(d){

          let xV = d.x
          let mV = Math.round(d.x);
          let xC = x(xV)
          let mL = x(mV - 0.5)
          let mR = x(mV + 0.5)

          if (xC - labelW / 2 < mL){
            return mL
          }
          else if (xC + labelW / 2 > mR){
            return mR - labelW
          }
          else {
            return x(d.x) - labelW / 2
          }


    })
        .attr('y1', function(d){return y(d.y) - labelH - 2 * space})
        .attr('x2', function(d){

                    let xV = d.x
          let mV = Math.round(d.x);
          let xC = x(xV)
          let mL = x(mV - 0.5)
          let mR = x(mV + 0.5)

          if (xC - labelW / 2 < mL){
            return mL + labelW
          }
          else if (xC + labelW / 2 > mR){
            return mR
          }
          else {
            return x(d.x) + labelW / 2
          }


        })
        .attr('y2', function(d){ return y(d.y) - labelH - 2 * space})
         .attr('class', function(d){
          return 'display_series_point' + d.id})

          .attr('stroke-opacity', function(d, idx, dataIdx){
            if (d.id === $scope.activeObj.students[0]){
            return 1;

          }
          else {
            return 0;
          }
          })


        .attr('stroke-width', 3)
        .attr('stroke', '#ef6640')


          label.append('text')
       .attr('x', function(d){
                  let xV = d.x
          let mV = Math.round(d.x);
          let xC = x(xV)
          let mL = x(mV - 0.5)
          let mR = x(mV + 0.5)

          if (xC - labelW / 2 < mL){
            return mL + labelW / 2//+ labelW * 0.05
          }
          else if (xC + labelW / 2 > mR){
            return mR - labelW / 2 //+ labelW*0.05
          }
          else {
            return x(d.x)  //+ labelW*0.05
          }


        })
       .attr('y', function(d){return y(d.y) - labelH * 0.25 - 2 * space + labelW * 0.05})
       .attr('text-anchor', 'middle')
        .attr('class', function(d){


      return 'display_series_point' + d.id})
      .text(function (d) { if (d.y || d.y === 0) {return d.y.toString() + ' Minutes'}})
         .attr('opacity', function(d, idx, dataIdx){

         if (d.id === $scope.activeObj.students[0]){
            return 1;

          }
          else {
            return 0;
          }
        })
         .attr('font-size', '10px')
         .attr('fill', '#ece2e5')


           label.append('text')
           .attr('text-anchor', 'middle')
       .attr('x', function(d){
             let xV = d.x
          let mV = Math.round(d.x);
          let xC = x(xV)
          let mL = x(mV - 0.5)
          let mR = x(mV + 0.5)

          if (xC - labelW / 2 < mL){
            return mL + labelW / 2;
          }
          else if (xC + labelW / 2 > mR){
            return mR - labelW / 2 //labelW + labelW*0.05
          }
          else {
            return x(d.x) //- labelW / 2 + labelW*0.05
          }

       })
       .attr('y', function(d){return y(d.y) - 0.6 * labelH  - 2 * space})
        .attr('class', function(d){


      return 'display_series_point' + d.id})
      .text(function (d) { if (d.y || d.y === 0) {return d.name}})
         .attr('opacity', function(d, idx, dataIdx){

         if (d.id === $scope.activeObj.students[0]){
            return 1;

          }
          else {
            return 0;
          }
        })
         .attr('font-size', '12px')
         .attr('fill', '#ece2e5')


                 chart.append('g')
      .attr('class', 'invisibleCircles')

      .selectAll('circleTest')
      .data(mergedData, function(d, i){

        return i})
      .enter()
      .append('circle')
      .on('click', function(a, b, c){


            $scope.listClick(a.id, 'student', null, null, null)
            $scope.$apply();
               // $scope.$emit('graphClick', a, b, c, "student")
          })
          //.attr("class", "point")
          .attr('class', function(a, b, c){
            return 'point_series_invisible' + a.id
          })
        .attr('r', 10)
        /*.attr("fill", function(d, idx, dataIdx){

          if(d.id === $scope.activeObj.student){
            return "#ef6640";

          }
          else{
            return "#7a9ef2";
          }
        }) */
        .attr('opacity', 0)

        .attr('cx', function(d){ return x(d.x);})
        .attr('cy', function(d) { return y(d.y);})


        //chart.enter().exit().remove();
        resize();


        }


        var updateActive = function(){

        //CIRCLES

        d3.selectAll('.point_series' + $scope.activeObj.students[0]).attr('fill', '#ef6640')
        d3.selectAll('.point_series' + $scope.activeObj.previousStudents[0]).attr('fill', '#7a9ef2')


        // CONNECTING LINE

        d3.selectAll('.display_series' + $scope.activeObj.students[0]).attr('opacity', 1)
        d3.selectAll('.display_series' + $scope.activeObj.previousStudents[0]).attr('opacity', 0)


        // LABEL RECTANGLES

        d3.selectAll('.display_series_point' + $scope.activeObj.students[0]).attr('opacity', 1).attr('stroke-opacity', 1)
        d3.selectAll('.display_series_point' + $scope.activeObj.previousStudents[0]).attr('opacity', 0).attr('stroke-opacity', 0)

        }

        var resize = function(){

            svg.attr('width', $el[0].clientWidth);
            svg.attr('height', $el[0].clientWidth * 3 / 4);
        }

          $scope.$on('windowResize', resize)
          //$scope.$on('updateChart', updateActive)
          $scope.$watch('items', update);

          $scope.$watch(function(){return $scope.activeObj.students}, function(newVal, oldVal){
          if (!angular.equals(oldVal, newVal)){

              updateActive($scope)
          }

        }, true)

  }


    return {
      template: '<div class="scatter_chart"></div>',
      replace: true,
      scope: {
        items: '=rawdata',

        activeObj: '=activeobj',
        listClick: '=listclick',
        timeArray: '=timearray'
      },
      link: link,
      restrict: 'E'
    }

  }]

    )
