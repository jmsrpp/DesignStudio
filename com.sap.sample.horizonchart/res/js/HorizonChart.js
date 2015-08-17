sap.designstudio.sdk.Component.subclass("com.sap.sample.horizonchart.horizonChart", function() {

	var that = this;
	"use strict";
	
	this._poller = null;
	this._pollInterval = 250;
	this._previousWidth = -1;
	this._previousHeight = -1;
	
	var svg,
		gHorizon,
		focus,
		overlay,
		chart,
		width,
		height,
		colorRange;

	/* Autogenerate setter/getter and their default values for the following properties. */
	this.autoProperties = {
			savedData: null,
			horizonMeasure: null,
			bands: null,
			mode: null,
			positiveColor1: null,
			positiveColor2: null,
			negativeColor1: null,
			negativeColor2: null
		};
	
	/* Create the aforementioned getter/setter and attach to 'this'. */
	for(var property in this.autoProperties){
		this[property] = function(property){
			return function(value){
				try{
					if(value===undefined){
						return this.autoProperties[property];
					}else{
						this.autoProperties[property] = value;
						return this;
					}
				}catch(e){
					alert(e);
				}
			};
		}(property);
	}

	
	this.detectSize = function(that){
		var currentWidth = that.$().innerWidth();
		var currentHeight = that.$().innerHeight();
		if(currentWidth != that._previousWidth || currentHeight != that._previousHeight){
			// If width or height has changed since the last calculation, redraw.
			/* Debug alert:
			alert("Resize detected.\n\nOld:" + that._previousWidth + " x " + that._previousHeight + 
					"\n\nNew:" + currentWidth + " x " + currentHeight);
			*/
			that._previousHeight = currentHeight;
			that._previousWidth = currentWidth;	
			this.afterUpdate();
		}else{
			// Sizes are the same.  Don't redraw, but poll again after an interval.
			that._poller = window.setTimeout(function(){that.detectSize(that)},that._pollInterval);	
		}
	};
	
    this.init = function() {
    	container = this.$();
        svg = initSvg(container);
        gHorizon = svg.append("g");
        focus = svg.append("g").attr("class", "focus").style("display", "none");
        overlay = svg.append("rect").attr("class", "overlay");
        //this._ownScript = _readScriptPath();
        };

    this.afterUpdate = function() {
        
    	var margin = {top: 0, right: 20, bottom: 0, left:20};
    	
    	width = that.$().innerWidth();
		height = that.$().innerHeight();
		
		colorRange = [that.negativeColor1(), that.negativeColor2(), that.positiveColor1(), that.positiveColor2()];
		
		 //handle responsive component resize
        var svgResize = svg.attr("width", width)
    	.attr("height", height);
        
        gHorizon.attr("width", width - margin.left - margin.right)
        .attr("height", height - margin.top - margin.bottom)
        .attr('transform', 'translate(' + margin.left + ', ' + margin.top + ')');
		
    	chart = d3.horizon()
    	.width(width - margin.left - margin.right)
    	.height(height - margin.top - margin.bottom)
        .colors(colorRange)
        .bands(that.bands())
        .mode(that.mode())
        .interpolate("basis");
    	
    	var horizon_data = that.savedData(),
    	horizonRate = that.horizonMeasure().data,
    	horizonAxisRows = horizon_data.axis_rows,
    	horizonYearMember = horizon_data.dimensions[1].members,
        horizonMonthMember = horizon_data.dimensions[2].members,
        final_data = [];
    	 // Offset so that positive is above-average and negative is below-average.
        var mean = horizonRate.reduce(function(p, v) { return p + v; }, 0) / horizonRate.length;
    	
    	horizonAxisRows.forEach(function(row, i) {
    		var yearIndex = row[1];
    		var monthIndex = row[2];
    		var dateUTC = Date.UTC(parseInt(horizonYearMember[yearIndex].text), parseInt(horizonMonthMember[monthIndex].text) - 1);
    		var dateString = horizonYearMember[yearIndex].text + "-" + horizonMonthMember[monthIndex].text;
    		var rate = horizonRate[i] - mean;
    		var horizonRow = {
    				"date": dateUTC,
    				"dateString": dateString,
    				"rate": rate,
    				"measure": horizonRate[i]
    		};
    		final_data.push(horizonRow);
    	});
    	   
     // Transpose column values to rows.
        horizon_data = horizonRate.map(function(rate, i) {
          return [final_data[i].date, final_data[i].rate];
        });
       
   // Render the chart.
    	gHorizon.data([horizon_data]).call(chart);
    	
    	// Set the ranges
    	var x = d3.time.scale().range([0 + margin.left, width - margin.right]);
    	var y = d3.scale.linear().range([0 + margin.bottom, height - margin.top]);
    	
    	// Scale the domain of the data
        x.domain(d3.extent(final_data, function(d) { return d.date; }));
        y.domain([0, d3.max(final_data, function(d) { return d.rate; })]);
        
    	var bisectDate = d3.bisector(function(d) { return d.date; }).left;
    	
    	focus.append("circle")
        .attr("r", 4.5);

    	focus.append("text")
    	.attr("class", "data_measure")
        .attr("x", -20)
        .attr("dy", 20);
    	
    	focus.append("text")
    	.attr("class", "data_dimension")
        .attr("x", -20)
        .attr("dy", -20);

        overlay.attr("width", width)
        .attr("height", height)
        .on("mouseover", function() { focus.style("display", null); })
        .on("mouseout", function() { focus.style("display", "none"); })
        .on("mousemove", mousemove); 

    function mousemove() {
      var x0 = x.invert(d3.mouse(this)[0]),
          i = bisectDate(final_data, x0, 1),
          d0 = final_data[i - 1],
          d1 = final_data[i],
          d = x0 - d0.date > d1.date - x0 ? d1 : d0;
      focus.attr("transform", "translate(" + x(d.date) + "," + d3.mouse(this)[1] + ")")
      focus.select(".data_measure").text(d.measure);
      focus.select(".data_dimension").text(d.dateString);
    }
    	
    	this._poller = window.setTimeout(function(){that.detectSize(that)},that._pollInterval);
    	
    }
        	
    //Start helper functions
    
    function initSvg($container) {
    	
    	$container.empty();
    	
    	var svg = getSvg($container);
    	
        function getSvg($container) {
        	return d3.select($container[0]).append("svg")
        	}
        return svg;
    }
    
});