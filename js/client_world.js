var container, scene, camera, renderer, raycaster, objects = [];

var controls;

init();
animate();

function init() {

	// Setup
	container = document.getElementById( 'container' );
	scene = new THREE.Scene();

	camera = new THREE.PerspectiveCamera( 50, window.innerWidth / window.innerHeight, 1, 1000 );
	camera.position.y = 3;
	camera.position.z = 3;

	camera.lookAt( new THREE.Vector3( 0, 0, 0 ) );

	controls = new THREE.OrbitControls( camera );
	controls.enable = false;

	renderer = new THREE.WebGLRenderer( { alpha: true } );
	renderer.setSize( window.innerWidth, window.innerHeight);

	raycaster = new THREE.Raycaster();

	initLights();
	loadSky();
	loadMat();
	loadFakeDeck();
	loadFakeDeck2();
	loadDeck();


	var oldFunc = username_area.onmousedown;
	username_area.onmousedown = function (evt) {
	    username_area.focus()
	}

	controls.addEventListener( 'change', render );
	document.addEventListener( "mousewheel", onMouseWheel2, false );
	document.addEventListener( "mousedown", onMouseDown, false );
	document.addEventListener( "mouseup", onMouseUp, false );
	document.addEventListener( 'click', onMouseClick2, false );
	document.addEventListener( "keydown", onKeyDown, false );
	window.addEventListener( 'resize', onWindowResize, false );

	// Final touches
	container.appendChild( renderer.domElement );
	document.body.appendChild( container );
}

function animate() {
	requestAnimationFrame( animate );
	if ( controls.enable )
		controls.update();
	render();
}

function render() {

	if ( isDrawingCards ) {
		drawCardMotion();
	}

	if ( isPlayingCards ) {
		playCardMotion();
	}

	if ( !timerStopped ) {
		runTimer();
	}
	// Render Scene
	renderer.clear();
	renderer.render( scene , camera );
}

function onWindowResize() {

	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
	
	renderer.setSize( window.innerWidth, window.innerHeight );

}