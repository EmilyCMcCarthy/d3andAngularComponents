'use strict';

angular
  .module( 'app.components.litProChart')
  .directive( 'barChart', [function(){

	var link = function($scope, $el){


		var margin = {top: 50, right: 50, bottom: 100, left: 100},
		width = 1000 - margin.left - margin.right,
		height = 750 - margin.top - margin.bottom;

		var svg = d3.select($el[0]).append('svg')
					.attr({width: width + margin.left + margin.right, height: height + margin.top + margin.bottom})
					.attr('viewBox', '0 0 ' + (width + margin.right + margin.left) + ' ' + (height + margin.bottom + margin.top));

		var chart = svg.append('g');
		chart.attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

		function update(){



      var consolidateData = function(raw, timeA){
        var combinedData = [];

        for (let i = 0; i < timeA.length; i++){
          combinedData.push({date: timeA[i], 'GoalMet': [], GoalExceeded: [], GoalNotMet: []})
        }



        for (let i = 0; i < raw.length; i++){
            for (let j = 0; j < raw[i].data.length; j++){


              if (timeA.indexOf(raw[i].data[j].date) >= 0){

                  var ind = timeA.indexOf(raw[i].data[j].date);
                  var studentV = raw[i].data[j].value;

                  if (studentV < 2){ // Goal Not Met Case
                    combinedData[ind].GoalNotMet.push(raw[i].id)
                  }
                  else if (studentV === 3){ // Goal Exceeded Case
                    combinedData[ind].GoalExceeded.push(raw[i].id)
                  }
                  else if (studentV >= 2 && studentV < 3){ // Goal Met Case
                    combinedData[ind].GoalMet.push(raw[i].id)
                  }

              }

            }
        }

        return combinedData


      }

      var consolidatedData = consolidateData($scope.rawData, $scope.timeArray);


     var formatBarData = function(data){
        var resArr = [];

        for (let i = 0; i < data.length; i++){
          var GNMObj = {date: data[i].date, value: data[i].GoalNotMet.length, cat: 'GoalNotMet', ids: data[i].GoalNotMet}
          var GMObj = {date: data[i].date, value: data[i].GoalMet.length, cat: 'GoalMet', ids: data[i].GoalMet}
          var GEObj = {date: data[i].date, value: data[i].GoalExceeded.length, cat: 'GoalExceeded', ids: data[i].GoalExceeded}
          resArr.push(GNMObj, GMObj, GEObj)
        }

        return resArr
     }

     var data = formatBarData(consolidatedData)


			var data2 = [{date: 'A', value: 5, cat: 'GoalMet', ids: [1, 9, 5, 4, 6]}, {date: 'A', value: 3, cat: 'GoalNotMet', ids: [3, 7, 8]}, {date: 'A', value: 2, cat: 'GoalExceeded', ids: [2, 10]}, {date: 'B', value: 3, cat: 'GoalMet', ids: [1, 2, 3]}, {date: 'B', value: 5, cat: 'GoalNotMet', ids: [4, 5, 6, 7, 8]}, {date: 'B', value: 2, cat: 'GoalExceeded', ids: [9, 10]}, {date: 'C', value: 2, cat: 'GoalMet', ids: [10, 9]}, {date: 'C', value: 4, cat: 'GoalNotMet', ids: [1, 4, 3, 8]}, {date: 'C', value: 4, cat: 'GoalExceeded', ids: [2, 5, 6, 7]}]

			var barPad = 0.1
			var barOuterPad = barPad / 2;

		 // CHART SCALES
			var color = d3.scale.ordinal()
								.domain(['GoalMet', 'GoalExceeded', 'GoalNotMet'])
								.range(['#d8aade', '#d1e4b1', '#f4d0b0'])

			var x0 = d3.scale.ordinal()
								.domain(data.map(function(d){
									return d.date;
								}))
								.rangeRoundBands([0, width], barPad, barOuterPad)

			var x1 = d3.scale.ordinal()
								.domain(['GoalMet', 'GoalExceeded', 'GoalNotMet'])
								.rangeRoundBands([0, x0.rangeBand()])

			var y = d3.scale.linear().range([height, 0]).domain([0, d3.max(data, function(d){return Math.ceil(d.value * 1.25)})])

			//var yTicks = y.ticks()

			var xAxis = d3.svg.axis()
								.scale(x0)
								.orient('bottom')
								.innerTickSize(-(height))
								.outerTickSize(1)
								.tickPadding(20)


			var yAxis = d3.svg.axis()
								.scale(y)
								.orient('left')
								.innerTickSize(-(width))
								.outerTickSize(1)
								.tickPadding(20)
								.tickValues(d3.range(0,d3.max(data, function(d){return Math.ceil(d.value * 1.25)}),d3.max(data, function(d){return Math.ceil(d.value * 1.25 / 8)})))
								.tickFormat(d3.format(".0"))


			//y.ticks()

		//	y.domain([0, d3.max(data, function(d){return Math.ceil(d.value * 1.25)})])

							//var yTicks = 	y.ticks();
        	var labelW = x0.rangeBand() * 0.55
        	var labelH = labelW * 0.4
        	var space = labelH / 4;
        	var triangleL = space;


        	chart.append('g')
  			.selectAll('annotations')
  			.data($scope.timeArray/*["A","B","C"]*/)
  			.enter()
  			.append('rect')
  			.attr('x', function(d){
    			return x0(d) - x0.rangeBand() * (1 / (1 - barPad)) * (barPad / 2)
  			})
  			.attr('y', 0)
  			.attr('height', height)
  			.attr('width', function(){return x0.rangeBand() * (1 / (1 - barPad))})
  			.attr('class', function(d, id){
  				if (id % 2 === 0){
  					return 'anno_odd'
    			}
    			else {
      				return  'anno_even'
    			}
  			})

        	chart.append('g')
        	.attr('class', 'x axis')
        	.attr('transform', 'translate(0,' + height + ')')
        	.call(xAxis)
       		.selectAll('text')
      		//.style('text-anchor', 'end')
      		//.attr('dx', '-.8em')
					//.attr('dy', '-.55em')
					//.attr('transform', 'translate(0,30)')
      	//	.attr('transform', 'rotate(-90)' );






     		/*grid.selectAll("text").attr("font-size",20)*/

     		chart.append('g')
      		.attr('class', 'y axis')
      		.call(yAxis)
      		.selectAll('text')
         	 .style('text-anchor', 'left')
      		.attr('dx', '-.8em')
      		.attr('dy', '-.55em')
				//	.attr('transform', 'rotate()' );

				console.log(y, "y")

    chart.selectAll('yAxisGrid')
    .data(y.ticks)
    //.call(yAxis)
		 .enter()
		.append('line')
		.attr('opacity', function(a,b,c){
				console.log(a,b,c, "abc in y axis grid")
							 if (a % 1 === 0){
									return 1;
								}
								else {
									return 0;
								}
							})

  //.attr('class', 'y')
    .attr('x1', 0)
    .attr('x2', width)
    .attr('y1', y)
    .attr('y2', y)
		.style('stroke', '#ccc')

/*
			var yAxisGrid = yAxis
            .outerTickSize(0)
            .innerTickSize(-width)
            .tickPadding(1)
           	///.ticks(7)//.orient("left")


     		var grid =  chart.append("g")
     		//.classed('y', true)
     		.classed('grid', true)
     		.call(yAxisGrid) */

      		chart.append('g')
			.selectAll('bar')
      		.data(data)
    		.enter()
      		.append('rect')
    		.attr('transform', function(d){return 'translate(' + x0(d.date) + ',0)'})
  			.style('fill', function(d){return color(d.cat)})
			.attr('x', function(d) {
       			return x1(d.cat);
       		})
      		.attr('width', x1.rangeBand())
      		.attr('y', function(d) { return y(d.value); })
      		.attr('height', function(d) { return height - y(d.value); });

     		var label = chart.append('g')
     		.selectAll('.label')
      		.data(data)
      		.enter()

      		label.append('rect')
      		.attr('class', function(d){
        		var classString = d.cat + '_' + d.date.replace(/[^a-zA-Z0-9 -]/g, "");
        		for (let i = 0; i < d.ids.length; i++){
    				classString += ' label_student_' + d.ids[i]
    			}
      			return classString;//d.cat + " " + "hello"
      		})
			.attr('transform', function(d){return 'translate(' + x0(d.date) + ',0)'})
      		.style('fill', 'gray')
      		.attr('x', function(d) {
        		return x1(d.cat) - labelW / 2 + x1.rangeBand() / 2
        	})
      		.attr('y', function(d){return y(d.value) - 2 * space - labelH})
      		.attr('width', labelW)
      		.attr('height', labelH)
      		.attr('opacity', function(d, idx, dataIdx){
         		if (d.cat === $scope.activeObj.cat){
            		return 1;
				}
          		else {
            		return 0;
          		}
        	})

			label.append('rect')
          	.attr('class', function(d){
						var classString = d.cat + '_' + d.date.replace(/[^a-zA-Z0-9 -]/g, "");
				for (let i = 0; i < d.ids.length; i++){
     				classString += ' label_student_' + d.ids[i]
        		}
      			return classString;//d.cat + " " + "hello"
     		})
          	.attr('transform', function(d){
              	let yP = y(d.value)  - 2 * space - triangleL * Math.sqrt(2) / 2
              	let xP = x1(d.cat) + x1.rangeBand() / 2 + x0(d.date)
              	return 'rotate(45 ' + xP + ' ' + yP + ')'})
       		.style('fill', 'gray')
            .attr('x', function(d) {
        		return x1(d.cat) + x1.rangeBand() / 2 + x0(d.date)})
      		.attr('y', function(d){return  y(d.value)  - 2 * space - triangleL * Math.sqrt(2) / 2})
      		.attr('width', triangleL)
      		.attr('height', triangleL)
      		.attr('opacity', function(d, idx, dataIdx){
      			if (d.cat === $scope.activeObj.cat){
            		return 1;
          		}
          		else {
            		return 0;
          		}
        	})

      		label.append('line')
      		.attr('transform', function(d){return 'translate(' + x0(d.date) + ',0)'})
      		.attr('x1', function(d) {

        		return x1(d.cat) - labelW / 2 + x1.rangeBand() / 2 })
      		.attr('x2', function(d){
        		return x1(d.cat) + labelW / 2 + x1.rangeBand() / 2
			})
      		.attr('y1', function(d){
        		return y(d.value) - 2 * space - labelH
      		})
      		.attr('y2', function(d){
        		return y(d.value) - 2 * space - labelH
      		})
      		.attr('class', function(d){
        		var classString = d.cat + '_' + d.date.replace(/[^a-zA-Z0-9 -]/g, "");
				for (let i = 0; i < d.ids.length; i++){
          			classString += ' label_student_' + d.ids[i]
				}
      			return classString;//d.cat + " " + "hello"
			})
      		.attr('stroke-opacity', 0)
      		.attr('stroke-width', 10)
      		.attr('stroke', function(d){

						return color(d.cat)})


      		chart.append('g')
			.selectAll('Clickable_bar')
    		.data(data)
    		.enter()
    		.append('rect')
    		.attr('transform', function(d){return 'translate(' + x0(d.date) + ',0)'})
      		.on('click', function(a, b, c){

     		$scope.listClick(null, 'category', a.cat, a.ids, a.date.replace(/[^a-zA-Z0-9 -]/g,""))


 			$scope.$apply();
      		//$scope.$apply(updateActive());
      		})
      		.attr('opacity', 0)
     		.attr('x', function(d) {
    			return x1(d.cat);
    		})
      		.attr('width', x1.rangeBand())
      		.attr('y', function(d) { return y(d.value); })
      		.attr('height', function(d) { return height - y(d.value); });

      		resize()

		}

		function resize(){

			 	svg.attr('width', $el[0].clientWidth);
        		svg.attr('height', $el[0].clientWidth * 3 / 4);
		}


		var updateActive = function(){


        if ($scope.activeObj.type === 'cat'){


            if ($scope.activeObj.previousStudents){

            	for (let i = 0; i < $scope.activeObj.previousStudents.length; i++){
            		d3.selectAll('.label_student_' + $scope.activeObj.previousStudents[i]).attr('opacity', 0).attr('stroke-opacity', 0)
            	}


              }

              d3.selectAll('.' + $scope.activeObj.previousCat).attr('opacity', 0).attr('stroke-opacity', 0)
              d3.selectAll('.' + $scope.activeObj.cat).attr('opacity', 1).attr('stroke-opacity', 1)


        }
        else if ($scope.activeObj.type === 'student'){


            if ($scope.activeObj.previousCat){
               d3.selectAll('.' + $scope.activeObj.previousCat).attr('opacity', 0).attr('stroke-opacity', 0)
            }


           for (let i = 0; i < $scope.activeObj.previousStudents.length; i++){
           		d3.selectAll('.label_student_' + $scope.activeObj.previousStudents[i]).attr('opacity', 0).attr('stroke-opacity', 0)
					 }

					 for (let i = 0; i < $scope.activeObj.students.length; i++){

														 d3.selectAll('.label_student_' + $scope.activeObj.students[i]).attr('opacity', 1).attr('stroke-opacity', 1)
					}


        }
        else if ($scope.activeObj.type == null){
        	if ($scope.activeObj.previousCat){
        		d3.selectAll('.' + $scope.activeObj.previousCat).attr('opacity', 0).attr('stroke-opacity', 0)
        	}
        	if ($scope.activeObj.previousStudents){
        		for (let i = 0; i < $scope.activeObj.previousStudents.length; i++){
            		d3.selectAll('.label_student_' + $scope.activeObj.previousStudents[i]).attr('opacity', 0).attr('stroke-opacity', 0)
            	}
        	}
        }


      }

      //updateActive();

				 $scope.$watch(function(){ return $scope.activeObj},
				 function(newVal, oldVal){

          if (!angular.equals(oldVal, newVal)){
            	updateActive($scope)
          }

        }, true)

		$scope.$on('windowResize', resize)
		$scope.$watch('rawData', update)


	}


  	return {
    template: '<div class="bar_chart"></div>', //'js/components/lit-pro-chart/bar-chart/bar-chart.html',
    replace: true,
   	scope: {
    	activeObj: '=activeobj',
    	rawData: '=rawdata',
    	listClick: '=listclick',
      timeArray: '=timearray'

    },
    //link: link,
    link: link,
    //controller: link,
    restrict: 'E'
    //controller : [ LitProChartController ],
    //controllerAs : 'vm'
  } }])

