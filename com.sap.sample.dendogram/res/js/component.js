/*global sap */
sap.designstudio.sdk.Component.subclass("com.sap.sample.dendogram.Dendogram", function() {
	
	var that = this;
	"use strict";

    var savedMetadata = null,
    	savedData = null,
    	selectedNode = null,
    	nodeName = null,
        metadataToTreeConverter,
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

    this.metadata = function(value) {
        if (value === undefined) {
            return savedMetadata;
        } else {
            savedMetadata = value;
            return this;
        }
    };
    
    this.data = function(value) {
		if (value === undefined) {
			return savedData;
		} else {
			savedData = value;
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
    
    this.dimHierarchy = function(value) {
    	if (value === undefined) {
    		return dimHierarchy;
    	} else {
    		dimHierarchy = value;
    		return this;
    	}
    };

    this.afterUpdate = function() {
    	root = metadataToTreeConverter.convert(savedMetadata);
        dimValue = metadataToTreeConverter.findHierarchicalDimension(savedMetadata);
        this.dimHierarchy(dimValue);
        this.firePropertiesChanged(["dimHierarchy"]);
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
				click(d, "mouseClickSelf", this);});
		
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

		nodeEnter.append("rect")
		.attr("x", function(d) { 
			if (!d.level) {return -106}
			else {return d.children ? -114 : 150; } })
		.attr("y", "-37.5px")
		.attr("width", "42.5px")
		.attr("height", "25px")
		.attr("class", "kpi1")
		.attr("id", "svg_topkpi1");

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
    function click(d, eventTextSelf, $this) {
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
			}
      } else if (d.nodeState && d.nodeState === "COLLAPSED") {
        d.children = d._children;
        d._children = null;
        if (eventTextSelf && eventTextSelf === "mouseClickSelf") {
			// trigger Event on Hierarchy Expand
        	that.fireEvent("onHExpand");
        	d_root = d;
        	h_fired = 1;
				}
      	}
      that.afterUpdate();
    }
    
});
