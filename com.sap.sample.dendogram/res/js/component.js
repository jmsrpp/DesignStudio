/*global sap */
sap.designstudio.sdk.Component.subclass("com.sap.sample.dendogram.Dendogram", function() {
	
	var that = this;
	"use strict";

    var savedMetadata = null,
    	savedData = null,
    	selectedNode = null,
        metadataToTreeConverter,
        treeRenderer;

    this.init = function() {
        metadataToTreeConverter = new sap.sample.dendogram.MetadataToTreeConverter();
        // The object that will take in a hierarchy and render it into a dom object
        treeRenderer = new sap.sample.dendogram.D3DendogramRenderer();
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

    this.afterUpdate = function() {
        var root = metadataToTreeConverter.convert(savedMetadata);
        treeRenderer.render(root, this.$(), that);
    };    

});
