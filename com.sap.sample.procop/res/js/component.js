/*global sap */
sap.designstudio.sdk.Component.subclass("com.sap.sample.procop.Procop", function() {

	var that = this;
	"use strict";

    var kf1 = null,
    	kfException = null,
    	kfExceptionKey = null,
    	driver1 = null,
    	driver2 = null,
    	driver1Index = null,
    	driver2Index = null,
    	savedData = null,
    	selectedNode = null,
    	nodeName = null,
    	conditionalFormatMultiDim = {},
    	isDataInit = null,
    	trafficLightArray = [],
        metadataToTreeConverter,
        finalCondForm,
        svg,
        root,
        d_root,
        g_node,
        dimValue,
        h_fired = null,
        cluster;

    this.init = function() {
        metadataToTreeConverter = new sap.sample.dendogram.MetadataToTreeConverter();
        svg = initSvg(this.$());
        cluster = initCluster(this.$());
        };
    
    this.dataResultSet = function(value) {
    	if (value === undefined) {
    			return savedData;
    		} else {
    			savedData = value;
    			return this;
    		}
    	};
    	
    this.dataResultCellListKF1 = function(value) {
    	if (value === undefined) {
			return kf1;
		} else {
			kf1 = value;
			return this;
		}
	};
	
	this.kfException = function(value) {
    	if (value === undefined) {
			return kfException;
		} else {
			kfException = value;
			return this;
		}
	};
	
	this.kfExceptionKey = function(value) {
    	if (value === undefined) {
			return kfExceptionKey;
		} else {
			kfExceptionKey = value;
			return this;
		}
	};
	
	this.finalCondForm = function(value) {
    	if (value === undefined) {
			return finalCondForm;
		} else {
			finalCondForm = value;
			return this;
		}
	};
	
	this.dimDriverTop = function(value) {
    	if (value === undefined) {
			return driver1;
		} else {
			driver1 = value;
			return this;
		}
	};
	
	this.dimDriverBottom = function(value) {
    	if (value === undefined) {
			return driver2;
		} else {
			driver2 = value;
			return this;
		}
	};
	
    this.selectedNode = function(value) {
    	if (value === undefined) {
    		return selectedNode;
    	} else {
    		selectedNode = value;
    		return this;
    	}
    };
    
    this.driver1Index = function(value) {
    	if (value === undefined) {
    		return driver1Index;
    	} else {
    		driver1Index = value;
    		return this;
    	}
    };
    
    this.driver2Index = function(value) {
    	if (value === undefined) {
    		return driver2Index;
    	} else {
    		driver2Index = value;
    		return this;
    	}
    };
    
    this.dimHierarchy = function(value) {
    	if (value === undefined) {
    		return dimHierarchy;
    	} else {
    		dimHierarchy = value;
    		return this;
    	}
    };
    
    this.conditionalFormatMultiDim = function(value) {
    	if (value === undefined) {
    		return conditionalFormatMultiDim;
    	} else {
    		conditionalFormatMultiDim = value;
    		return this;
    	}
    };
    
    this.trafficLightArray = function(value) {
    	if (value === undefined) {
    		return trafficLightArray;
    	} else {
    		trafficLightArray = value;
    		return this;
    	}
    };

    this.afterUpdate = function() {
    	if (!isDataInit) {
    		that.dataInit();	
    	}
    	root = metadataToTreeConverter.convert(savedData, that);
        if (selectedNode === "InitialNode") {
    		that.update(root);
        }
        else if (selectedNode !== "InitialNode" && h_fired !== 1){
        	g_node = d3.select( "#h_" + nodeName);
        	g_node.remove();
        	that.update(d_root);
        }
        else {
        	h_fired = null;
        	g_node = d3.select( "#h_" + nodeName);
        	g_node.remove();
        	that.update(d_root);
        	}
    	
    };
    
    this.dataInit = function() {
    	if (savedData && kf1 && kfException && driver1 && driver2) {
        	dimValue = metadataToTreeConverter.findHierarchicalDimension(savedData);
            that.dimHierarchy(dimValue);
            kfExceptionKey = metadataToTreeConverter.measureKeyByText(kfException, savedData);
    		that.kfExceptionKey(kfExceptionKey);
    		//Find the index by key value of the Top and Bottom Driver dimensions specified at design time
        	driver1Index = metadataToTreeConverter.dimensionIndexByKey(driver1, savedData);
        	that.driver1Index(driver1Index);
        	driver2Index = metadataToTreeConverter.dimensionIndexByKey(driver2, savedData);
        	that.driver2Index(driver2Index);
        	
        	var dimHierarchyIndex = metadataToTreeConverter.dimensionIndexByKey(dimHierarchy, savedData);
        	var members = savedData.dimensions[dimHierarchyIndex].members;
        	that.conditionalFormatMultiDim(undefined);
        	var conditionalFormatMultiDimArray = [];
        	
        	members.forEach(function(member, i) {
        		var dimDriverTopN = that.driver1Index(),
        			dimDriverBottomN = that.driver2Index(),
        			//Get the supplemental cost driver member index for each hierarchy node
                	driverTopMemberIndex = savedData.axis_rows[i][dimDriverTopN],
                	driverBottomMemberIndex = savedData.axis_rows[i][dimDriverBottomN],
                	conditionalFormatMultiDimNode = {},
                	/* Define JSON properties for passing MultiDim to getConditionalFormatValueExt method */
            		cFHier = that.dimHierarchy(),
            		cFDriverTop = that.dimDriverTop(),
            		cFDriverBottom = that.dimDriverBottom();
        			
        			/* Push values into defined properties */
            		conditionalFormatMultiDimNode[cFHier] = member.text;
            		//insert BIAL property here for member key
            		conditionalFormatMultiDimNode[cFDriverTop] = savedData.dimensions[dimDriverTopN].members[driverTopMemberIndex].key;
            	    conditionalFormatMultiDimNode[cFDriverBottom] = savedData.dimensions[dimDriverBottomN].members[driverBottomMemberIndex].key;
            		/* Stringify the results into JSON format*/
        			//conditionalFormatMultiDimNode = JSON.stringify(conditionalFormatMultiDimNode);
        			conditionalFormatMultiDimArray.push(conditionalFormatMultiDimNode);
        	});
        
        	console.log("debug");
        	that.conditionalFormatMultiDim(conditionalFormatMultiDimArray);
        	isDataInit = 1;
        	that.firePropertiesChangedAndEvent(["dimHierarchy", "kfExceptionKey","conditionalFormatMultiDim"], "setTrafficLightValueArray");
    }
    	that.afterUpdate();
    };
    
    this.update = function(source) {
    		
    	// Compute the cluster layout.
		var nodes = cluster.nodes(root).reverse(),
		links = cluster.links(nodes),
		duration = 750,
		i = 0;
		
		// Normalize for fixed-depth.
		nodes.forEach(function(d) { 
			d.y = d.depth * 280; 
			d.id = d.key; // set the ID dynamically ... otherwise there are errors getting the right element
		});
	        	        
    // Update the nodes…
		var node = svg.selectAll("g.node")
			.data(nodes, function(d) { return d.id || (d.id = ++i); });

	// Enter any new nodes at the parent's previous position.
		var nodeEnter = node.enter().append("g")
			.attr("class", "node")
			.attr("id", function(d) { return 'h_' + d.name })
			.attr("transform", function(d) { return "translate(" + source.y0 + "," + source.x0 + ")"; })
			.on("click", function(d) {
				click(d, "mouseClickSelf");});
		
		// Draw the KPI tile using SVG shapes
		nodeEnter.append("rect")
		.attr("x", function(d) { 
			if (!d.level) {return -256}
			else {return d.children ? -264 : 0;} })
		.attr("y", "-37.5px")
		.attr("width", "250px")
		.attr("height", "75px")
		.attr("class", "container")
		.attr("id", "svg_container");

		nodeEnter.append("rect")
		.attr("x", function(d) { 
			if (!d.level) {return -256}
			else {return d.children ? -264 : 0;} })
		.attr("y", "-37.5px")
		.attr("width", "25px")
		.attr("height", "25px")
		.attr("class", "container")
		.attr("id", "svg_trafficlight");

		nodeEnter.append("circle")
		.attr("cx", function(d) { 
			if (!d.level) {return -243.5}
			else {return d.children ? -252 : 12;} })
		.attr("cy", "-25px")
		.attr("r", "12px")
		.attr("class", "traffic")
		.style("fill", function(d) {return d.traffic_color;})
		.attr("id", "svg_traffic_circle");
           
		nodeEnter.append("rect")
		.attr("x", function(d) { 
			if (!d.level) {return -231}
			else {return d.children ? -239 : 25; } })
		.attr("y", "-37.5px")
		.attr("width", "125px")
		.attr("height", "25px")
		.attr("class", "drivers")
		.attr("id", "svg_topdriver1");
		
		nodeEnter.append("text")
		.attr("dx", function(d) { 
			if (!d.level) {return -156}
			else {return d.children ? -164 : 100;} })
		.attr("dy", -20)
       	.attr("text-anchor", "right")
       	.attr("class", "driver_text")
       	.text(function(d) { return d.driver_dim1; });

		nodeEnter.append("rect")
		.attr("x", function(d) { 
			if (!d.level) {return -106}
			else {return d.children ? -114 : 150; } })
		.attr("y", "-37.5px")
		.attr("width", "42.5px")
		.attr("height", "25px")
		.attr("class", "kpi1")
		.attr("id", "svg_topkpi1");
		
		nodeEnter.append("text")
		.attr("dx", function(d) { 
			if (!d.level) {return -86}
			else {return d.children ? -94 : 170;} })
		.attr("dy", -20)
       	.attr("text-anchor", "middle")
       	.attr("class", "kpi1_text")
       	.text(function(d) { return d.kpi1; });

		nodeEnter.append("rect")
		.attr("x", function(d) { 
			if (!d.level) {return -63.5}
			else {return d.children ? -71.5 : 192.5; } })
		.attr("y", "-37.5px")
		.attr("width", "42.5px")
		.attr("height", "25px")
		.attr("class", "kpi2")
		.attr("id", "svg_topkpi2");

		nodeEnter.append("rect")
		.attr("x", function(d) { 
			if (!d.level) {return -21}
			else {return d.children ? -29 : 235; } })
		.attr("y", "-37.5px")
		.attr("width", "15px")
		.attr("height", "75px")
		.attr("class", "container")
			.attr("id", "svg_pluspanel");

		nodeEnter.append("text")
		.attr("dx", function(d) { 
			if (!d.level) {return -14.5}
			else {return d.children ? -23 : 242;} })
		.attr("dy", 6.5)
		.attr("text-anchor", "middle")
		.text(function(d) { 
			if (d.nodeState=="COLLAPSED") {return "+"}
			else if (d.nodeState=="EXPANDED") {return "-"}
			else {return ""}})
		.style("font-size", "25px")
		.style("font-weight", "bold")
		.attr("id", "plusminus");

         
		nodeEnter.append("rect")
		.attr("x", function(d) { 
			if (!d.level) {return -256}
			else {return d.children ? -264 : 0; } })
		.attr("y", "-12.5px")
		.attr("width", "234.5px")
		.attr("height", "25px")
		.attr("class", "middim")
		.attr("id", "svg_middim");

		nodeEnter.append("rect")
		.attr("x", function(d) { 
			if (!d.level) {return -256}
			else {return d.children ? -264 : 0; } })
		.attr("y", "12.5px")
		.attr("width", "150px")
		.attr("height", "25px")
		.attr("class", "drivers")
		.attr("id", "svg_botdriver2");
		
		nodeEnter.append("text")
		.attr("dx", function(d) { 
			if (!d.level) {return -156}
			else {return d.children ? -164 : 100;} })
		.attr("dy", 25)
       	.attr("text-anchor", "right")
       	.attr("class", "driver_text")
       	.text(function(d) { return d.driver_dim2; });

		nodeEnter.append("rect")
		.attr("x", function(d) { 
			if (!d.level) {return -106}
			else {return d.children ? -114 : 150; } })
		.attr("y", "12.5px")
		.attr("width", "42.5px")
		.attr("height", "25px")
		.attr("class", "kpi1")
		.attr("id", "svg_botkpi1");

		nodeEnter.append("rect")
		.attr("x", function(d) { 
			if (!d.level) {return -63.5}
			else {return d.children ? -71.5 : 192.5; } })
		.attr("y", "12.5px")
		.attr("width", "42.5px")
		.attr("height", "25px")
		.attr("class", "kpi2")
		.attr("id", "svg_botkpi2");

		nodeEnter.append("text")
		.attr("dx", function(d) { 
			if (!d.level) {return -130}
			else {return d.children ? -130 : 117.5;} })
		.attr("dy", 3)
       	.attr("text-anchor", "middle")
       	.attr("class", "dimText")
       	.text(function(d) { return d.name; });
		
		// Transition nodes to their new position.
		var nodeUpdate = node.transition()
			.duration(duration)
			.attr("transform", function(d) { return "translate(" + d.y + "," + d.x + ")"; });

			nodeUpdate.select("circle");
			nodeUpdate.select("rect");
			nodeUpdate.select("text");

	// Transition exiting nodes to the parent's new position.
		var nodeExit = node.exit().transition()
			.duration(duration)
			.attr("transform", function(d) { return "translate(" + source.y + "," + source.x + ")"; })
			.remove();

			nodeExit.select("circle");
			nodeExit.select("rect");
			nodeExit.select("text");

	// Update the links…
		var link = svg.selectAll("path.link")
			.data(links, function(d) { return d.target.id; });

	// Enter any new links at the parent's previous position.
			link.enter().insert("path", "g")
			.attr("class", "link")
			.attr("d", function(d) {
				var o = {x: source.x0, y: source.y0};
				return elbow({source: o, target: o});
			});

	// Transition links to their new position.
			link.transition()
			.duration(duration)
			.attr("d", elbow);

	// Transition exiting nodes to the parent's new position.
			link.exit().transition()
			.duration(duration)
			.attr("d", function(d) {
				var o = {x: source.x, y: source.y};
				return elbow({source: o, target: o});
			})
			.remove();

	// Stash the old positions for transition.
			nodes.forEach(function(d) {
				d.x0 = d.x;
				d.y0 = d.y;
			});
    }

    //Start helper functions
    
    function initSvg($container) {
    	
    	$container.empty();
    	
    	var svg = getSvg($container);
    	
        function getSvg($container) {
        	var margin = {top: 200, right: 120, bottom: 20, left: 275},
                width = $container.width() - margin.right - margin.left,
                height = $container.height() - margin.top - margin.bottom;

        	return d3.select($container[0]).append("svg")
        	.attr("width", width + margin.right + margin.left)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + height/1.3 + ")");
        	}
        return svg;
    }
    
    function initCluster($container) {
    	
    	cluster = d3.layout.cluster()
    	.size([$container.height(), $container.width()])
    	.nodeSize([100, 280]);
    	
        return cluster;
    }
    
    function elbow(d, i) {
  	  return "M" + d.source.y + "," + d.source.x
  	      + "V" + d.target.x + "H" + d.target.y;
  	}
    
    // Toggle children on click.
    function click(d, eventTextSelf) {
  	// set text of selected node 
		that.selectedNode(d.key);
		nodeName = d.name;
	// fire event that this change is also available via BIAL
		that.firePropertiesChanged(["selectedNode"]);
      if (d.nodeState && d.nodeState === "EXPANDED") {
        d._children = d.children;
        d.children = null;
        if (eventTextSelf && eventTextSelf === "mouseClickSelf") {
			// trigger Event on Hierarchy Collapse
        	that.fireEvent("onHCollapse");
        	d_root = d;
        	h_fired = 1;
        	isDataInit = null;
			}
      } else if (d.nodeState && d.nodeState === "COLLAPSED") {
        d.children = d._children;
        d._children = null;
        if (eventTextSelf && eventTextSelf === "mouseClickSelf") {
			// trigger Event on Hierarchy Expand
        	that.fireEvent("onHExpand");
        	d_root = d;
        	h_fired = 1;
        	isDataInit = null;
				}
      	}
      that.afterUpdate();
    }

});
