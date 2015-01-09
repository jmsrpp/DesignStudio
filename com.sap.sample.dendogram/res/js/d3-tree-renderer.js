/*global d3, sap */
(function(sap, undefined) {

    "use strict";

    function D3DendogramRenderer() {}

    // Used the tutorial found here: http://www.d3noob.org/2014/01/tree-diagrams-in-d3js_11.html
    /**
     * Renders the given tree structure into the given jQery node
     * @param root A tree structure of the form 
     * { "name": "Some Name": children: [...] }
     * @param $container The container into which the tree will be rendered. 
     */
    D3DendogramRenderer.prototype.render = function(root, $container) {
        var i = 0,
        	cluster,
        	duration=750,
            svg;

        $container.empty();

        svg = getSvg($container);
              
        cluster = d3.layout.cluster()
        	.size([$container.height(), $container.width()])
        	.nodeSize([100, 280]);
       
        root.x0 = $container.height()/2;
        root.y0 = 0; 
             
          //root.children.forEach(collapse);
          update(root);
          
          function update(source) {
        	  
             // Compute the cluster layout.
        var nodes = cluster.nodes(root).reverse(),
        	links = cluster.links(nodes);
        	        	        
        // Declare the links
        var link = svg.selectAll("path.link")
        .data(cluster.links(nodes))
        .enter().append("path")
        .attr("class", "link")
        .attr("d", elbow);  

        // Declare the nodes
        var node = svg.selectAll("g.node")
        .data(nodes)
        .enter().append("g")
        .attr("class", "node")
        .attr("transform", function(d) { return "translate(" + d.y + "," + d.x + ")"; })
        .on("click", click);
        
        // Normalize for fixed-depth.
        nodes.forEach(function(d) { d.y = d.depth * 180; });

        // Update the nodes…
        //var node = svg.selectAll("g.node")
        //    .data(nodes, function(d) { return d.id || (d.id = ++i); });

       // Draw the KPI tile using SVG shapes
        node.append("rect")
        .attr("x", function(d) { 
        	if (!d.level) {return -256}
        	else {return d.children ? -264 : 0;} })
        .attr("y", "-37.5px")
        .attr("width", "250px")
        .attr("height", "75px")
        .attr("stroke", "#000000")
        .attr("fill", "#ffffff")
        .attr("id", "svg_container");
        
        node.append("rect")
    	.attr("x", function(d) { 
        	if (!d.level) {return -256}
        	else {return d.children ? -264 : 0;} })
    	.attr("y", "-37.5px")
    	.attr("width", "25px")
    	.attr("height", "25px")
    	.style("stroke", "#000000")
    	.style("fill", "#ffffff")
    	.attr("id", "svg_trafficlight");
        
        node.append("circle")
    	.attr("cx", function(d) { 
        	if (!d.level) {return -243.5}
        	else {return d.children ? -252 : 12;} })
    	.attr("cy", "-25px")
    	.attr("r", "12px")
    	.style("stroke", "#000000")
    	.style("stroke-width", "1")
    	.style("fill", "#27e833")
    	.attr("id", "svg_traffic_circle");
                       
        node.append("rect")
    	.attr("x", function(d) { 
    		if (!d.level) {return -231}
    		else {return d.children ? -239 : 25; } })
    	.attr("y", "-37.5px")
    	.attr("width", "125px")
    	.attr("height", "25px")
    	.attr("stroke", "#000000")
    	.attr("fill", "#83D6FF")
    	.attr("id", "svg_topdriver1");
       
        node.append("rect")
        .attr("x", function(d) { 
    		if (!d.level) {return -106}
    		else {return d.children ? -114 : 150; } })
    	.attr("y", "-37.5px")
    	.attr("width", "42.5px")
    	.attr("height", "25px")
    	.attr("stroke", "#000000")
    	.attr("fill", "#375A6B")
    	.attr("id", "svg_topkpi1");
        
        node.append("rect")
        .attr("x", function(d) { 
    		if (!d.level) {return -63.5}
    		else {return d.children ? -71.5 : 192.5; } })
    	.attr("y", "-37.5px")
    	.attr("width", "42.5px")
    	.attr("height", "25px")
    	.attr("stroke", "#000000")
    	.attr("fill", "#5C96B2")
    	.attr("id", "svg_topkpi2");
        
        node.append("rect")
        .attr("x", function(d) { 
    		if (!d.level) {return -21}
    		else {return d.children ? -29 : 235; } })
    	.attr("y", "-37.5px")
    	.attr("width", "15px")
    	.attr("height", "75px")
    	.attr("stroke", "#000000")
    	.attr("fill", "#ffffff")
   		.attr("id", "svg_pluspanel");
        
        node.append("text")
    	.attr("dx", function(d) { 
    		if (!d.level) {return -14.5}
    		else {return d.children ? -23 : 242;} })
    	.attr("dy", 6.5)
    	//.attr("text-anchor", function(d) { return d.children ? "end" : "start"; })
    	.attr("text-anchor", "middle")
    	.text(function(d) { 
    		if (d.nodeState=="COLLAPSED") {return "+"}
    		else if (d.nodeState=="EXPANDED") {return "-"}
    		else {return ""}})
    	.style("font-size", "25px")
    	.style("font-weight", "bold")
        .attr("id", "plusminus");
        
                     
        node.append("rect")
        .attr("x", function(d) { 
    		if (!d.level) {return -256}
    		else {return d.children ? -264 : 0; } })
    	.attr("y", "-12.5px")
    	.attr("width", "234.5px")
    	.attr("height", "25px")
    	.attr("stroke", "#000000")
    	.attr("fill", "#C1EAFF")
    	.attr("id", "svg_middim");
        
        node.append("rect")
        .attr("x", function(d) { 
    		if (!d.level) {return -256}
    		else {return d.children ? -264 : 0; } })
    	.attr("y", "12.5px")
    	.attr("width", "150px")
    	.attr("height", "25px")
    	.attr("stroke", "#000000")
    	.attr("fill", "#83D6FF")
    	.attr("id", "svg_botdriver2");
        
        node.append("rect")
        .attr("x", function(d) { 
    		if (!d.level) {return -106}
    		else {return d.children ? -114 : 150; } })
    	.attr("y", "12.5px")
    	.attr("width", "42.5px")
    	.attr("height", "25px")
    	.attr("stroke", "#000000")
    	.attr("fill", "#375A6B")
    	.attr("id", "svg_botkpi1");
        
        node.append("rect")
        .attr("x", function(d) { 
    		if (!d.level) {return -63.5}
    		else {return d.children ? -71.5 : 192.5; } })
    	.attr("y", "12.5px")
    	.attr("width", "42.5px")
    	.attr("height", "25px")
    	.attr("stroke", "#000000")
    	.attr("fill", "#5C96B2")
    	.attr("id", "svg_botkpi2");
        

        node.append("text")
        	.attr("dx", function(d) { 
        		if (!d.level) {return -130}
        		else {return d.children ? -130 : 117.5;} })
        	.attr("dy", 3)
        	//.attr("text-anchor", function(d) { return d.children ? "end" : "start"; })
        	.attr("text-anchor", "middle")
        	.text(function(d) { return d.name; });
                
          	  
            }
          
          // Toggle children on click.
          function click(d) {
            if (d.children) {
              d._children = d.children;
              d.children = null;
              if (d.nodeState)
              {d.nodeState = "EXPANDED";}
            } else {
              d.children = d._children;
              d._children = null;
              if (d.nodeState)
              {d.nodeState = "COLLAPSED";}
            }
            update(d);
          }
          
    };
   
  //  d3.select(self.frameElement).style("height", $container.height());
 
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
    
    function elbow(d, i) {
    	  return "M" + d.source.y + "," + d.source.x
    	      + "V" + d.target.x + "H" + d.target.y;
    	}
    

    sap.sample = sap.sample || {};
    sap.sample.dendogram = sap.sample.dendogram || {};
    sap.sample.dendogram.D3DendogramRenderer = D3DendogramRenderer;


})(sap);
