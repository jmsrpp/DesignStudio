/*global sap */
(function(sap, undefined) {

    "use strict";

    function MetadataToTreeConverter() {}


    /**
     * Function to convert the metadata from a flat structure to a tree structure
     * that can be used with D3.
     * @param metadata Metadata that comes from the associated data source.
     */
    MetadataToTreeConverter.prototype.convert = function(metadata) {
        var members = findHierarchicalMembers(metadata),
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
        members.forEach(function(member) {
            var memberLevel = member.level || 0,
                levelDiff = memberLevel - lastLevel,
                node = {
                    "name": member.text,
                    "isLeaf": !isHierarchyNode(member),
                    "level": member.level,
                    "nodeState": member.nodeState
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
     * Finds the first dimension that has a hierarchy node as its first member
     */
    function findHierarchicalMembers(metadata) {
        var dimensionsWithHierarchies = metadata.dimensions.filter(function(dimension) {
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


    sap.sample = sap.sample || {};
    sap.sample.dendogram = sap.sample.dendogram || {};
    sap.sample.dendogram.MetadataToTreeConverter = MetadataToTreeConverter;


})(sap);
