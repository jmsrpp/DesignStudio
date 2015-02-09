sap.designstudio.sdk.Component.subclass("com.sap.sample.three.Three", function() {

var that = this;
	
    "use strict";

    	var container,
    	margin = {top: 5, right: 5, bottom: 5, left: 5},
    	SCREEN_WIDTH_HALF, SCREEN_HEIGHT_HALF, SCREEN_HEIGHT, SCREEN_WIDTH,
    	scene,
    	camera,
    	renderer,
    	geometry,
    	material,
    	cube;
    	
    this.init = function() {
        
    	container = this.$()[0];
    	SCREEN_WIDTH = that.$().outerWidth(true) - margin.left - margin.right;
		SCREEN_HEIGHT = that.$().outerHeight(true) - margin.top - margin.bottom;
		SCREEN_WIDTH_HALF = SCREEN_WIDTH  / 2,
		SCREEN_HEIGHT_HALF = SCREEN_HEIGHT / 2;
		
		scene = new THREE.Scene();
		camera = new THREE.PerspectiveCamera( 75, SCREEN_WIDTH / SCREEN_HEIGHT, 0.1, 1000 );
		camera.position.z = 5;
		
		renderer = new THREE.WebGLRenderer();
		renderer.setSize( SCREEN_WIDTH, SCREEN_HEIGHT );
		
		// attach the render-supplied DOM element
		this.$().append(renderer.domElement);
		
		geometry = new THREE.BoxGeometry( 1, 1, 1 );
		material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
		cube = new THREE.Mesh( geometry, material );
		
		scene.add( cube );

		
		
    };

    this.afterUpdate = function() {
    	
    	renderer.render(scene, camera);
    	
    };
    
    function render() {
    	
    	requestAnimationFrame( render );

		cube.rotation.x += 0.1;
		cube.rotation.y += 0.1;

		renderer.render(scene, camera);
		
    }

});