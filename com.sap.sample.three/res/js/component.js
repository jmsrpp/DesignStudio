sap.designstudio.sdk.Component.subclass("com.sap.sample.three.Three", function() {

var that = this;
	
    "use strict";

    	var margin = {top: 5, right: 5, bottom: 5, left: 5},
    	SCREEN_WIDTH_HALF, SCREEN_HEIGHT_HALF, SCREEN_HEIGHT, SCREEN_WIDTH,
    	scene,
    	scene2,
    	camera,
    	renderer,
    	renderer2,
    	controls,
    	material,
    	cube;
    	
    this.init = function() {
        
    	SCREEN_WIDTH = this.$().outerWidth(true) - margin.left - margin.right;
		SCREEN_HEIGHT = this.$().outerHeight(true) - margin.top - margin.bottom;
		SCREEN_WIDTH_HALF = SCREEN_WIDTH  / 2,
		SCREEN_HEIGHT_HALF = SCREEN_HEIGHT / 2;
		
		camera = new THREE.PerspectiveCamera( 45, SCREEN_WIDTH / SCREEN_HEIGHT, 1, 1000 );
		camera.position.set( 200, 200, 200 );
		
		controls = new THREE.TrackballControls( camera );
		
		scene = new THREE.Scene();
		scene2 = new THREE.Scene();
		
		material = new THREE.MeshBasicMaterial( { color: 0x000000, wireframe: true, wireframeLinewidth: 1, side: THREE.DoubleSide } );
		
		//

		for ( var i = 0; i < 10; i ++ ) {
			this.element = document.createElement("DIV");
			$(this.element).appendTo(this.$());
			console.log("break");
			this.element.style.width = '100px';
			this.element.style.height = '100px';
			this.element.style.opacity = 0.5;
			this.element.style.background = new THREE.Color( Math.random() * 0xffffff ).getStyle();

			var object = new THREE.CSS3DObject( this.element );
			object.position.x = Math.random() * 200 - 100;
			object.position.y = Math.random() * 200 - 100;
			object.position.z = Math.random() * 200 - 100;
			object.rotation.x = Math.random();
			object.rotation.y = Math.random();
			object.rotation.z = Math.random();
			object.scale.x = Math.random() + 0.5;
			object.scale.y = Math.random() + 0.5;
			scene2.add( object );

			var geometry = new THREE.PlaneGeometry( 100, 100 );
			var mesh = new THREE.Mesh( geometry, material );
			mesh.position.copy( object.position );
			mesh.rotation.copy( object.rotation );
			mesh.scale.copy( object.scale );
			scene.add( mesh );
			
		}
		
		renderer = new THREE.WebGLRenderer();
		renderer.setClearColor( 0xf0f0f0 );
		renderer.setPixelRatio( this.$().devicePixelRatio );
		renderer.setSize( SCREEN_WIDTH, SCREEN_HEIGHT );
		// attach the render-supplied DOM element
		this.$().append(renderer.domElement);
		
		renderer2 = new THREE.CSS3DRenderer();
		renderer2.setSize( SCREEN_WIDTH, SCREEN_HEIGHT );
		renderer2.domElement.style.position = 'absolute';
		renderer2.domElement.style.top = 0;
		this.$().append(renderer2.domElement);
			
    };

    this.afterUpdate = function() {
    	
    	animate();
    	
    };
    
    function animate() {
    	
    	requestAnimationFrame( animate );

		controls.update();

		renderer.render( scene, camera );
		renderer2.render( scene2, camera );
		
    }

});