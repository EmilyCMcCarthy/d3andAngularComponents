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
  .directive( 'barChart', 
	[function($scope){

console.log($scope, "$scope in barchart directive")
	var link = function($scope, $el, $attrs){


		var margin = {top: 20, right: 20, bottom: 100, left: 100},
		width = 2000 - margin.left - margin.right,
		height = 1000 - margin.top - margin.bottom;

		var svg = d3.select($el[0]).append("svg")
					.attr({width: width + margin.left + margin.right, height: height + margin.top + margin.bottom})
					.attr("viewBox", "0 0 " + (width + margin.right + margin.left) + " " + (height + margin.bottom + margin.top));

		var chart = svg.append("g");
		chart.attr("transform", "translate(" + margin.left + "," + margin.top + ")")

		function update(){
			var data = [{date: "A", value: 5, cat: "GoalMet", ids: [1,9,5,4,6]}, {date: "A", value: 3, cat: "GoalNotMet", ids: [3,7,8]}, {date: "A", value: 2, cat: "GoalExceeded", ids: [2,10]},{date: "B", value: 3, cat: "GoalMet", ids: [1,2,3]}, {date: "B", value: 5, cat: "GoalNotMet", ids: [4,5,6,7,8]}, {date: "B", value: 2, cat: "GoalExceeded", ids: [9,10]}, {date: "C", value: 2, cat: "GoalMet", ids: [10,9]}, {date: "C", value: 4, cat: "GoalNotMet", ids: [1,4,3,8]}, {date: "C", value: 4, cat: "GoalExceeded", ids: [2,5,6,7]}]
		
			var barPad = 0.1
			var barOuterPad = barPad / 2;

			var color = d3.scale.ordinal()
								.domain(["GoalMet", "GoalExceeded", "GoalNotMet"])
								.range(["#d8aade", "#d1e4b1", "f4d0b0"])

			var x0 = d3.scale.ordinal()
								.domain(data.map(function(d){
									return d.date;
								}))
								.rangeRoundBands([0,width], barPad, barOuterPad)

			var x1 = d3.scale.ordinal()
								.domain(["GoalMet", "GoalExceeded", "GoalNotMet"])
								.rangeRoundBands([0,x0.rangeBand()])

			var y = d3.scale.linear().range([height, 0]);

			var xAxis = d3.svg.axis()
								.scale(x0)
								.orient("bottom")

			var yAxis = d3.svg.axis()
								.scale(y)
								.orient("left")

			y.domain([0, d3.max(data, function(d){return d.value})*1.25])


        	var labelW = x0.rangeBand()*0.55
        	var labelH = labelW * 0.4
        	var space = labelH / 4;
        	var triangleL = space;


        	chart.append("g")
  			.selectAll("annotations")
  			.data(["A","B","C"])
  			.enter()
  			.append("rect")
  			.attr("x", function(d){
    			return x0(d) - x0.rangeBand()*(1/(1-barPad))*(barPad/2)
  			})
  			.attr("y", 0)
  			.attr("height", height)
  			.attr("width", function(){return x0.rangeBand()*(1/(1- barPad))})
  			.attr("fill", function(d,id){
    			if(id % 2 === 0){
      				return  "#f9f9f7"
    			}
    			else{
      				return "#ffffff"
    			}
  			})
        	chart.append("g")
        	.attr("class", "x axis")
        	.attr("transform", "translate(0," + height + ")")
        	.call(xAxis)
       		.selectAll("text")
      		.style("text-anchor", "end")
      		.attr("dx", "-.8em")
      		.attr("dy", "-.55em")
      		.attr("transform", "rotate(-90)" );
				
			var yAxisGrid = yAxis
            .outerTickSize(0)
            .innerTickSize(-width)
            .tickPadding(1)
           	.ticks(7)//.orient("left")
     		
     		var grid =  chart.append("g")
     		.classed('y', true)
     		.classed('grid', true)
     		.call(yAxisGrid)

     		grid.selectAll("text").attr("font-size",20)
     
     		chart.append("g")
      		.attr("class", "y axis")
      		.call(yAxis)
      		.selectAll("text")
         	.style("text-anchor", "left")
      		.attr("dx", "-.8em")
      		.attr("dy", "-.55em")
      		.attr("transform", "rotate(-90)" );

      		chart.append("g")
			.selectAll("bar")
      		.data(data)
    		.enter()
      		.append("rect")
    		.attr("transform",function(d){return "translate(" + x0(d.date) + ",0)"})
  			.style("fill", function(d){return color(d.cat)})
			.attr("x", function(d) { 
       			return x1(d.cat); 
       		})
      		.attr("width", x1.rangeBand())
      		.attr("y", function(d) { return y(d.value); })
      		.attr("height", function(d) { return height- y(d.value); });
      
     		var label = chart.append("g")
     		.selectAll(".label")
      		.data(data)
      		.enter()
      
      		label.append("rect")
      		.attr("class", function(d){
        		var classString = d.cat + "_" + d.date;
        		for(let i = 0; i < d.ids.length; i++){
    				classString += " label_student_" + d.ids[i] 
    			} 
      			return classString;//d.cat + " " + "hello"
      		}) 
			.attr("transform",function(d){return "translate(" + x0(d.date) + ",0)"})
      		.style("fill", "gray")
      		.attr("x",function(d) {  
        		return x1(d.cat) - labelW / 2 + x1.rangeBand()/2 
        	})
      		.attr("y", function(d){return y(d.value) - 2*space - labelH})
      		.attr("width", labelW)
      		.attr("height", labelH)
      		.attr("opacity", function(d, idx, dataIdx){
         		if(d.cat === $scope.activeObj.cat){
            		return 1;
				}
          		else{
            		return 0;
          		}
        	})

			label.append("rect")
          	.attr("class", function(d){
        		var classString = d.cat + "_" + d.date;
				for(let i = 0; i < d.ids.length; i++){
     				classString += " label_student_" + d.ids[i] 
        		} 
      			return classString;//d.cat + " " + "hello"
     		})
          	.attr("transform", function(d){ 
              	let yP = y(d.value)  - 2*space - triangleL*Math.sqrt(2)/2
              	let xP = x1(d.cat) +x1.rangeBand()/2 + x0(d.date)
              	return "rotate(45 " + xP + " " + yP + ")"})
       		.style("fill", "gray")
            .attr("x",function(d) { 
        		return x1(d.cat)+ x1.rangeBand()/2 + x0(d.date)})
      		.attr("y", function(d){return  y(d.value)  - 2*space - triangleL*Math.sqrt(2)/2})
      		.attr("width", triangleL)
      		.attr("height", triangleL)
      		.attr("opacity", function(d, idx, dataIdx){
      			if(d.cat === $scope.activeObj.cat){
            		return 1;
          		}
          		else{
            		return 0;
          		}
        	})
    
      		label.append("line")
      		.attr("transform",function(d){return "translate(" + x0(d.date) + ",0)"})
      		.attr("x1", function(d) { 
        		return x1(d.cat) - labelW / 2 + x1.rangeBand()/2 })
      		.attr("x2", function(d){
        		return x1(d.cat) + labelW /2 + x1.rangeBand()/2
			})
      		.attr("y1", function(d){
        		return y(d.value) - 2*space - labelH
      		})
      		.attr("y2", function(d){
        		return y(d.value) - 2*space - labelH
      		})
      		.attr("class", function(d){
        		var classString = d.cat + "_" + d.date;
				for(let i = 0; i < d.ids.length; i++){
          			classString += " label_student_" + d.ids[i] 
				} 
      			return classString;//d.cat + " " + "hello"
			})
      		.attr("stroke-opacity",0)
      		.attr("stroke-width",10)
      		.attr("stroke",function(d){return color(d.cat)})


      		chart.append("g")
			.selectAll("Clickable_bar")
    		.data(data)
    		.enter()
    		.append("rect")
    		.attr("transform",function(d){return "translate(" + x0(d.date) + ",0)"})
      		.on('click', function(a,b,c){
     			//$scope.$emit('graphClick', a, b, c, "goal")    
     		console.log(a, b, c ,"a,b,c barChart")
 			$scope.listClick(null, 'category', a.cat, a.ids, a.date)

      		$scope.$apply();
      		})
      		.attr("opacity", 0)
     		.attr("x", function(d) { 
    			return x1(d.cat); 
    		})
      		.attr("width", x1.rangeBand())
      		.attr("y", function(d) { return y(d.value); })
      		.attr("height", function(d) { return height- y(d.value); });

		}

		function resize(){
				console.log("resize")
			 	svg.attr("width", $el[0].clientWidth);
        		svg.attr("height", $el[0].clientWidth);
		}


		$scope.$on('windowResize', resize)
		$scope.$watch('rawData', update)

	}

	

  	return {
    template : '<div class="barchart"></div>',//'js/components/lit-pro-chart/bar-chart/bar-chart.html',
    replace: true,
   	scope: {
    	activeObj: '=activeobj',
    	rawData: '=rawdata',
    	listClick: '=listclick'

    },
    link: link,
    restrict: 'E'
    //controller : [ LitProChartController ],
    //controllerAs : 'vm'
  } }])

