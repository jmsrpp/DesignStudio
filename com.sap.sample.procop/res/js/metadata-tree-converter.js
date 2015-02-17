/*global sap */
(function(sap, undefined) {

    "use strict";

    function MetadataToTreeConverter() {}


    /**
     * Function to convert the metadata from a flat structure to a tree structure
     * that can be used with D3.
     * @param metadata Metadata that comes from the associated data source.
     */
    MetadataToTreeConverter.prototype.convert = function(data, that) {
        var members = findHierarchicalMembers(data),
            lastLevel = 0,
            root = {
                "name": "root",
                "children": []
            },
            currentParent = root;

        /*
         * Iterate over the rest of the members. On each iteration we determine
         * where we should append the next node. This is done by comparing the
         * level of the member to the level of the previous member. 
         */
        members.forEach(function(member, i) {
        	//add measures and dimensions to the D3 hierarchy structure for each member
        	//make sure the full data set is available in the function scope
        	var dataset = that.dataResultSet();
        	var dimDriverTopN = that.driver1Index();
        	var dimDriverBottomN = that.driver2Index();
        	//Get the supplemental cost driver member index for each hierarchy node
        	var driverTopMemberIndex = dataset.axis_rows[i][dimDriverTopN];
        	var driverBottomMemberIndex = dataset.axis_rows[i][dimDriverBottomN];
        	//Get the key and text values for each cost driver
        	var driver_dim1 = dataset.dimensions[dimDriverTopN].members[driverTopMemberIndex].text;
        	//var driver_dim1_key = dataset.dimensions[dimDriverTopN].members[driverTopMemberIndex].key;
        	//that.driver1Key(driver_dim1_key);
        	//that.firePropertiesChanged(["driver1Key"]);
        	var driver_dim2 = dataset.dimensions[dimDriverBottomN].members[driverBottomMemberIndex].text;
        	//var driver_dim2_key = dataset.dimensions[dimDriverBottomN].members[driverBottomMemberIndex].key;
        	//that.driver2Key(driver_dim2_key);
        	//that.firePropertiesChanged(["driver2Key"]);
        	//Make the current member key available
        	//that.currentMember(member.text);
        	//that.firePropertiesChanged(["currentMember"]);
        	
        	/* Create an empty array for the conditional formatting JSON */
        	//var conditionalFormatMultiDim = {},
        	/* Define JSON properties for passing MultiDim to getConditionalFormatValueExt method */
        		//cFHier = that.dimHierarchy(),
        		//cFDriverTop = that.dimDriverTop(),
        		//cFDriverBottom = that.dimDriverBottom();
        		
        	/* Push values into defined properties */
        		//conditionalFormatMultiDim[cFHier] = that.currentMember();
        		//insert BIAL property here for member key
        		//conditionalFormatMultiDim[cFDriverTop] = that.driver1Key();
        	   // conditionalFormatMultiDim[cFDriverBottom] = that.driver2Key();
        	/* Stringify the results into JSON */
        		//conditionalFormatMultiDim = JSON.stringify(conditionalFormatMultiDim);
        		//fire event and commit this to property
        		//that.conditionalFormatMultiDim(conditionalFormatMultiDim);
        		//that.firePropertiesChangedAndEvent(["driver1Key", "driver2Key", "currentMember", "conditionalFormatMultiDim"], "setTrafficLight");
       
        	//that.fireEvent("setTrafficLight");
        	var trafficLightArray = that.trafficLightArray();
        	var trafficLightValue = trafficLightArray[i];
        	console.log("debug");
        	var trafficLightColor = getTrafficColor(trafficLightValue);
        	
            var memberLevel = member.level || 0,
                levelDiff = memberLevel - lastLevel,
                node = {
            		"key": member.key,
                    "name": member.text,
                    "isLeaf": !isHierarchyNode(member),
                    "level": member.level,
                    "nodeState": member.nodeState,
                    "kpi1": roundKpi(that.dataResultCellListKF1().data[i]), // TODO : enhance function with number of decimal places specified in scaling factor
                    "driver_dim1": driver_dim1,
                    "driver_dim2": driver_dim2,
                    "traffic_color": trafficLightColor
                },
                newParent;
            if (levelDiff < 0) {
                // Go up 1 or more levels
                newParent = getAncestor(currentParent, levelDiff * -1);
                delete currentParent.parent;
                currentParent = newParent;
            } else if (levelDiff > 0)  {
                // Go down a level
                newParent = currentParent.children[currentParent.children.length - 1];
                newParent.parent = currentParent;
                currentParent = newParent;
                currentParent.children = [];
            }
            currentParent.children.push(node);
            lastLevel = memberLevel;
        });
        if (root.children.length == 1) {
            // If there is only a single top level member then use it as the root
            root = root.children[0];
        }
        return root;
    };

    /**
     * Finds the dimension containing a hierarchy node
     */
    MetadataToTreeConverter.prototype.findHierarchicalDimension = function(data) {
        
        var tempResult = "";

		if (data) {
			for(var i=0;i< data.dimensions.length;i++){
				var dim =  data.dimensions[i];
				// check if member of dim is a hierarchy dimension and then return dim name
				if (!dim.hasOwnProperty("containsMeasures")) {
					if (dim.members[0]) {
						if (dim.members[0].type == "HIERARCHY_NODE") {
							tempResult = dim.key;
						}
					}
					
				}
			} // all dimensions have been traversed
		} // check if parse of strMetadata was successful and this._metadata is filled correctly
		
		return tempResult;
    }
    
 // Returns the key of a measure when provided the name and dataset
    MetadataToTreeConverter.prototype.measureKeyByText = function(name, data) {
		if (!data) return name;
		for(var i=0;i<data.dimensions.length;i++){
			if(data.dimensions[i].hasOwnProperty("containsMeasures")) {
				for(var ii=0;ii<data.dimensions[i].members.length;ii++){
					if(data.dimensions[i].members[ii].text === name){
						var key = data.dimensions[i].members[ii].key;
						return key;
					}
				}}
			else {return name;}
			}
	}
    
 // Returns position of metadata array - needs the dimensions key used in metadata and provided by additional property sheet dropdownboxes 
    MetadataToTreeConverter.prototype.dimensionIndexByKey = function(key, data){
		if(key=="NONE") return -1;
		if(!data) return null;
		for(var i=0;i<data.dimensions.length;i++){
			if(data.dimensions[i].key==key) return i;
		}
		return null;
	};

    /**
     * Finds the first dimension that has a hierarchy node as its first member
     */
    function findHierarchicalMembers(data) {
        var dimensionsWithHierarchies = data.dimensions.filter(function(dimension) {
                var members = dimension.members;
                return members && members.length && isHierarchyNode(members[0]);
            });
        return dimensionsWithHierarchies.length ? dimensionsWithHierarchies[0].members : [{"text": "No Hierarchies"}]; 
    }

    function isHierarchyNode(member) {
        return member.type && member.type === "HIERARCHY_NODE";
    }

    function getAncestor(node, depth) {
        var ancestor = node;
        for (var i = 0; i < depth; i++) {
            ancestor = ancestor.parent;   
        }
        return ancestor;
    }
    
 // Returns position of Keyfigure dimension 
	function dimensionKFIndex(data){
		if (data) { // otherwise there is an exception with no data connection ..
			if (data.dimensions) { // check if there is a dimensions property ...
				for(var i=0;i<data.dimensions.length;i++){
					if(data.dimensions[i].hasOwnProperty("containsMeasures")) return i;
				}
				return null;
			} else { // there is no this.rsltSet().dimensions
				return null;
			}
		} else { // there is no this.rsltSet()
			return null;
		}
		
	};
	
// Round to specified number of decimal places
	function roundKpi(value){
		if (value){
			value = parseFloat(value).toFixed(2);
			return value;
		}
		else {
			return value;
		}
	};
	
	function getTrafficColor(trafficLight){
		if (trafficLight == 1 || trafficLight == 2 || trafficLight == 3) {
			return "green";
		}
		else if (trafficLight == 4 || trafficLight == 5 || trafficLight == 6) {
			return "yellow";
		}
		else if (trafficLight == 7 || trafficLight == 8 || trafficLight == 9) {
			return "red";
		}
		else {
			return "pink";
		}
	};
	
    sap.sample = sap.sample || {};
    sap.sample.dendogram = sap.sample.dendogram || {};
    sap.sample.dendogram.MetadataToTreeConverter = MetadataToTreeConverter;


})(sap);