var matHeight = 3;
var matWidth = 6;
var matGeo = new THREE.PlaneBufferGeometry( matWidth, matHeight );
var matName = "magicmat0";
var mat;

var matPos = { x: 0, y: 0, z: 0 };
var matRot = { x: -Math.PI / 2, y: 0, z: 0 };

var fakeDeckPos = { x: 0.5 - matWidth / 2, y: 0, z: -0.5 + matHeight / 2 };
var fakeDeckPos2 = { x: -0.5 + matWidth / 2, y: 0, z: 0.5 - matHeight / 2 };

var fakeDeck;
var fakeDeck2;

var fakeCard;
var fakeCard2;

var loadMat = function( ) {

	var matTexture = THREE.ImageUtils.loadTexture( "images/" + matName + ".jpg" );
	matTexture.minFilter = THREE.NearestFilter;

	mat = new THREE.Mesh( matGeo, 
		new THREE.MeshFaceMaterial ( 
			[new THREE.MeshLambertMaterial( { transparent: true, map: matTexture } ),
		 	 new THREE.MeshBasicMaterial( { color: 0x660000 } ) ]
		) );

	//mat.material.side = THREE.DoubleSide;

	mat.position.x = matPos.x;
	mat.position.y = matPos.y;
	mat.position.z = matPos.z;

	mat.rotation.x = matRot.x;
	mat.rotation.y = matRot.y;
	mat.rotation.z = matRot.z;

	scene.add( mat );
	
};

var loadFakeDeck = function() {

	// Fake Deck
	var fdGeo = new THREE.BoxGeometry( 0.4, 0.5, 0.5 );

	//var fdMat = new THREE.MeshBasicMaterial( {color: 0x7777ff, wireframe: false} );

	var fdTexture = THREE.ImageUtils.loadTexture( "images/" + "sidetexture" + ".jpg" );
	fdTexture.minFilter = THREE.NearestFilter;

	var fdMat = new THREE.MeshLambertMaterial( { transparent: true, map: fdTexture } );

	fakeDeck = new THREE.Mesh( fdGeo, fdMat );

	fakeDeck.position.x = fakeDeckPos.x;
	fakeDeck.position.y = fakeDeckPos.y;
	fakeDeck.position.z = fakeDeckPos.z;

	// Fake Card
	var fkTexture = THREE.ImageUtils.loadTexture( "images/" + "magicback" + ".jpg" );
	fkTexture.minFilter = THREE.NearestFilter;

	var fakeCard = new THREE.Mesh( cardGeo, 
		new THREE.MeshFaceMaterial ( 
			[new THREE.MeshLambertMaterial( { transparent: true, map: fkTexture } ),
		 	 new THREE.MeshBasicMaterial( { color: 0x660000 } ) ]
		) );

	fakeCard.position.x = fakeDeckPos.x;
	fakeCard.position.y = 0.26;
	fakeCard.position.z = fakeDeckPos.z;

	fakeCard.rotation.x = -Math.PI / 2;
	
	scene.add( fakeCard );
	scene.add( fakeDeck );

};

var loadFakeDeck2 = function() {

	// Fake Deck
	var fdGeo = new THREE.BoxGeometry( 0.4, 0.5, 0.5 );

	//var fdMat = new THREE.MeshBasicMaterial( {color: 0x7777ff, wireframe: false} );

	var fdTexture = THREE.ImageUtils.loadTexture( "images/" + "sidetexture" + ".jpg" );
	fdTexture.minFilter = THREE.NearestFilter;

	var fdMat = new THREE.MeshLambertMaterial( { transparent: true, map: fdTexture } );

	fakeDeck2 = new THREE.Mesh( fdGeo, fdMat );

	fakeDeck2.position.x = fakeDeckPos2.x;
	fakeDeck2.position.y = fakeDeckPos2.y;
	fakeDeck2.position.z = fakeDeckPos2.z;

	// Fake Card
	var fkTexture = THREE.ImageUtils.loadTexture( "images/" + "magicback" + ".jpg" );
	fkTexture.minFilter = THREE.NearestFilter;

	var fakeCard2 = new THREE.Mesh( cardGeo, 
		new THREE.MeshFaceMaterial ( 
			[new THREE.MeshLambertMaterial( { transparent: true, map: fkTexture } ),
		 	 new THREE.MeshBasicMaterial( { color: 0x660000 } ) ]
		) );

	fakeCard2.position.x = fakeDeckPos2.x;
	fakeCard2.position.y = 0.26;
	fakeCard2.position.z = fakeDeckPos2.z;

	fakeCard2.rotation.x = -Math.PI / 2;
	fakeCard2.rotation.z = -Math.PI;
	
	scene.add( fakeCard2 );
	scene.add( fakeDeck2 );

};

var initLights = function( ) {
	var directionalLight = new THREE.DirectionalLight( 0xffffff );
    directionalLight.position.set( 0, 3, 0 ).normalize();
    scene.add( directionalLight );
}

var loadSky = function() {
	var geometry = new THREE.SphereGeometry(100, 20, 20);
	var material = new THREE.MeshBasicMaterial();
	var texture = THREE.ImageUtils.loadTexture("images/sky.jpg");
	texture.minFilter = THREE.NearestFilter;
	material.map = texture;
	material.side = THREE.BackSide;
	var mesh = new THREE.Mesh( geometry, material );
	scene.add(mesh);
};

var toggleOrbitControls = function() {

	controls.enable = controls.enable ? false : true ;

	if ( !controls.enable ) {
		
		camera.position.x = 0;
		camera.position.y = 3;
		camera.position.z = 3;

		camera.lookAt( new THREE.Vector3( 0, 0, 0 ) );
	}
};