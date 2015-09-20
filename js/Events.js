var mouse = new THREE.Vector2();
var intersects;
var mouseIsDown = false;
var wantedCardName = "Forest";

function onMouseDown( event ) {

	mouseIsDown = true;

}

function onMouseUp( event ) {

	mouseIsDown = false;

}

function onMouseClick2( event ) {

	intersects = calculateIntersects( event );

	if ( intersects.length > 0 ) {

		if ( hand.indexOf( intersects[0].object ) != -1 && myTurn && ( status == 0 || status == 2 ) ) // Card must be in hand to play
			playCard( intersects[0].object );

	}
	
	if ( cardDetailVisible )
			hideCardDetail();

}

function onMouseWheel2( event ) {

	intersects = calculateIntersects( event );

	if ( intersects.length > 0 ) {

		showCardDetail( intersects[0].object.name );

	}

}

function onKeyDown( event ) {

	if ( event.keyCode == '81' ) {
		console.log( "Q pressed!!" );
	}

	if ( event.keyCode == '72' && mouseIsDown ) { // h and mouse is down

		toggleOrbitControls();

	} else if ( event.keyCode == '74' && mouseIsDown ) { // j and mouse is down

		landsAbleToPlay = 10;

		for ( l = 0; l < landsAbleToPlay; l++ ) {

			var cardTexture = THREE.ImageUtils.loadTexture( "../images/" + wantedCardName + ".jpg" );
			cardTexture.minFilter = THREE.NearestFilter;

			var card = new THREE.Mesh( cardGeo, 
			new THREE.MeshFaceMaterial ( 
				[new THREE.MeshLambertMaterial( { transparent: false, map: cardTexture } ),
			 	 new THREE.MeshBasicMaterial( { color: 0x660000 } ) ]
			) );

			card.material.side = THREE.DoubleSide;

			card.position.x = deckPos.x;
			card.position.y = deckPos.y;
			card.position.z = deckPos.z;

			card.name = wantedCardName;

			//objects.push( card );
			scene.add( card );

			playCard( card );
		}

		landsAbleToPlay = 0;

	}
	/*
	if ( event.keyCode == '81' ) { //q
		rightToLeft();
	} else if ( event.keyCode == '69') { //e
		leftToRight();
	} else if ( event.keyCode == '87') { //w
		bottomToTop();
	} else if ( event.keyCode == '83') { //s
		topToBottom();
	}
	*/

}


function calculateIntersects( event ){

	event.preventDefault();

	mouse.x = ( event.clientX / renderer.domElement.width ) * 2 - 1;
	mouse.y = - ( event.clientY / renderer.domElement.height ) * 2 + 1;

	raycaster.setFromCamera( mouse, camera );

	intersects = raycaster.intersectObjects( objects );

	return intersects;

}