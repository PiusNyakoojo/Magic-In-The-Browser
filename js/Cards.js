var untappedLandPos = { x: 1 -matWidth / 2, y: 0, z: -0.5 + matHeight / 2 };
var tappedLandPos = { x: 2 - matWidth / 2, y: 0, z: -0.5 + matHeight / 2 };
var creatureCardPos = { x: 1 -matWidth / 2, y: 0, z: -1 + matHeight / 2 };
var magicCardPos = { x: 0, y: 0, z: 0 };
var deckPos = { x: 0.5 - matWidth / 2, y: 0, z: -0.5 + matHeight / 2 };
//var deckPos = { x: -0.3, y: 1.3, z: 2.1 };

var handPos = { x: -0.4, y: 1, z: 2 };

var otherHandPos = { x: 0.4, y: 1, z: -2 };
var otherUntappedLandPos = { x: -1 + matWidth / 2, y: 0, z: 0.5 - matHeight / 2 };
var otherTappedLandPos = { x: -2 - matWidth / 2, y: 0, z: 0.5 - matHeight / 2 };
var otherCreaturePos = { x: -1 + matWidth / 2, y: 0, z: 1 - matHeight / 2 };

var handRot = { x: -Math.PI / 2 + Math.PI / 4, y: 0, z: 0 };
var untappedRot = { x: -Math.PI / 2, y: 0, z: 0 };
var tappedRot = { x: -Math.PI / 2, y: 0, z: Math.PI / 2 };

var otherUntappedRot = { x: -Math.PI / 2, y: 0, z: -Math.PI };

var untappedLand = [];
var tappedLand = [];
var creaturesInPlay = [];
var tappedCreaturesInPlay = [];
var magicCards = [];

var otherUntappedLand = [];
var otherTappedLand = [];
var otherCreaturesInPlay = [];

var deck = [];
var deckSize = 60;

var graveyard = [];
var exiled = [];

var hand = [];
var handCardGap = 0.2;
var landGap = 0.1;
var landGapY = 0.001;
var creatureGap = 0.41;
var reOrganizeHand = false;

var cardsBeingDrawn = [];
var drawMotionSpeed = 0.1;
var isDrawingCards = false;

var playMotionSpeed = 0.1;
var landBeingPlayed = [];
var creatureBeingPlayed = [];
var magicBeingPlayed = [];
var isPlayingCards = false;

var landBeingTapped = [];
var landBeingUntapped = [];
var creatureBeingTapped = [];
var creatureBeingUntapped = [];

var otherLandBeingPlayed = [];

var otherLandBeingTapped = [];
var otherLandBeingUntapped = [];
var otherCreatureBeingPlayed = [];

var cardWidth = 0.405;
var cardHeight = 0.505;
var cardGeo = new THREE.PlaneBufferGeometry( cardWidth, cardHeight );

var i, j, k, l; // Loop
var index;
var count;
var countedLands;
var temp = "";

var playCard = function( card ) {

	switch ( cards[card.name].type ) {
		case "Land":
			if ( landsAbleToPlay > 0 ) {
				sendMessageOfPlayingCard( "" + card.name + "" );
				landBeingPlayed.push( card );
				landsAbleToPlay -= 1;
				removeCardFromHand( card );
			}
			break;
		case "Creature": 
			if ( canAffordCard( card ) ) {
				sendMessageOfPlayingCard( "" + card.name + "" );
				creatureBeingPlayed.push( card );
				removeCardFromHand( card );
			}
			break;
		case "Enchantment": 
			if ( canAffordCard( card ) ) {
				//sendMessageOfPlayingCard( "" + card.name + "" );
				magicBeingPlayed.push( card );
				removeCardFromHand( card );
			}
			break;
		case "Sorcery": 
			if ( canAffordCard( card ) ) {
				//sendMessageOfPlayingCard( "" + card.name + "" );
				magicBeingPlayed.push( card );
				removeCardFromHand( card );
			}
			break;
		case "Instant": 
			if ( canAffordCard( card ) ) {
				//sendMessageOfPlayingCard( "" + card.name + "" );
				magicBeingPlayed.push( card );
				removeCardFromHand( card );
			}
			break;
		default: console.log( "error playing card" );
	}

	isPlayingCards = true;
};

var removeCardFromHand = function( card ) {

	index = hand.indexOf( card );

	if ( index > -1 )
		hand.splice( index, 1 );

	reOrganizeHand = true;
};

var playCardMotion = function( ) {

	if ( reOrganizeHand ) { // Re-Organize hand

		for ( j = 0; j < hand.length; j++ ) {
			/*+ ( hand.length + j ) * handCardGap*/
			hand[j].position.x += drawMotionSpeed * ( ( handPos.x + ( 0 + j ) * handCardGap ) - hand[j].position.x );
			hand[j].position.y += drawMotionSpeed * ( handPos.y - hand[j].position.y );
			hand[j].position.z += drawMotionSpeed * ( handPos.z - hand[j].position.z );

			hand[j].rotation.x += drawMotionSpeed * ( handRot.x - hand[j].rotation.x );
			hand[j].rotation.y += drawMotionSpeed * ( handRot.y - hand[j].rotation.y );
			hand[j].rotation.z += drawMotionSpeed * ( handRot.z - hand[j].rotation.z );
		}

		j-= 1;

		if ( Math.abs( ( handPos.x + ( 0 + j ) * handCardGap ) - hand[j].position.x ) <= 0.01 &&
			 Math.abs( handPos.y - hand[j].position.y ) <= 0.01 &&
			 Math.abs( handPos.z - hand[j].position.z ) <= 0.01
			 ) {

			isPlayingCards = false;

		} else {
			isPlayingCards = true;
		}

	}

	if ( landBeingPlayed.length > 0 ) { // Land Being Played

		for ( k = 0; k < landBeingPlayed.length; k++ ) {
			landBeingPlayed[k].position.x += playMotionSpeed * ( ( untappedLandPos.x + ( untappedLand.length + k ) * landGap ) - landBeingPlayed[k].position.x );
			landBeingPlayed[k].position.y += playMotionSpeed * ( ( untappedLandPos.y + ( untappedLand.length + k ) * landGapY ) - landBeingPlayed[k].position.y );
			landBeingPlayed[k].position.z += playMotionSpeed * ( untappedLandPos.z - landBeingPlayed[k].position.z );

			landBeingPlayed[k].rotation.x += playMotionSpeed * ( untappedRot.x - landBeingPlayed[k].rotation.x );
			landBeingPlayed[k].rotation.y += playMotionSpeed * ( untappedRot.y - landBeingPlayed[k].rotation.y );
			landBeingPlayed[k].rotation.z += playMotionSpeed * ( untappedRot.z - landBeingPlayed[k].rotation.z );
		}

		k -= 1;

		if ( Math.abs( ( untappedLandPos.x + ( untappedLand.length + k ) * landGap ) - landBeingPlayed[k].position.x ) <= 0.01 &&
		 Math.abs( ( untappedLandPos.y + ( untappedLand.length + k ) * landGapY ) - landBeingPlayed[k].position.y ) <= 0.01 &&
		 Math.abs( untappedLandPos.z - landBeingPlayed[k].position.z ) <= 0.01 ) {

			for ( k = 0; k < landBeingPlayed.length; k++ ) {
				untappedLand.push( landBeingPlayed[k] );
			}

			isPlayingCards = false;
			landBeingPlayed = [];
		} else {
			isPlayingCards = true;
		}

	}

	if ( landBeingTapped.length > 0 ) { // Land Being Tapped

		for ( k = 0; k < landBeingTapped.length; k++ ) {
			landBeingTapped[k].position.x += playMotionSpeed * ( ( tappedLandPos.x + ( tappedLand.length + k ) * landGap ) - landBeingTapped[k].position.x );
			landBeingTapped[k].position.y += playMotionSpeed * ( ( tappedLandPos.y + ( tappedLand.length + k ) * landGapY ) - landBeingTapped[k].position.y );
			landBeingTapped[k].position.z += playMotionSpeed * ( tappedLandPos.z - landBeingTapped[k].position.z );

			landBeingTapped[k].rotation.x += playMotionSpeed * ( untappedRot.x - landBeingTapped[k].rotation.x );
			landBeingTapped[k].rotation.y += playMotionSpeed * ( untappedRot.y - landBeingTapped[k].rotation.y );
			landBeingTapped[k].rotation.z += playMotionSpeed * ( untappedRot.z - landBeingTapped[k].rotation.z );
		}

		k -= 1;

		if ( Math.abs( ( tappedLandPos.x + ( tappedLand.length + k ) * landGap ) - landBeingTapped[k].position.x ) <= 0.01 &&
		 Math.abs( ( tappedLandPos.y + ( tappedLand.length + k ) * landGapY ) - landBeingTapped[k].position.y ) <= 0.01 &&
		 Math.abs( tappedLandPos.z - landBeingTapped[k].position.z ) <= 0.01 ) {

			for ( k = 0; k < landBeingTapped.length; k++ ) {

				tappedLand.push( landBeingTapped[k] );
				index = untappedLand.indexOf( landBeingTapped[k] );
				if ( index > -1 )
				    untappedLand.splice(index, 1); // Land is no longer untapped (i.e. available)

			}

			isPlayingCards = false;

		} else {
			isPlayingCards = true;
		}

	}

	if ( landBeingUntapped.length > 0 ) { // Land Being Untapped


	}

	if ( creatureBeingPlayed.length > 0 ) { // Creature Being Played

		for ( k = 0; k < creatureBeingPlayed.length; k++ ) {
			creatureBeingPlayed[k].position.x += playMotionSpeed * ( ( creatureCardPos.x + ( creaturesInPlay.length + k ) * creatureGap ) - creatureBeingPlayed[k].position.x );
			creatureBeingPlayed[k].position.y += playMotionSpeed * ( creatureCardPos.y - creatureBeingPlayed[k].position.y );
			creatureBeingPlayed[k].position.z += playMotionSpeed * ( creatureCardPos.z - creatureBeingPlayed[k].position.z );

			creatureBeingPlayed[k].rotation.x += playMotionSpeed * ( untappedRot.x - creatureBeingPlayed[k].rotation.x );
			creatureBeingPlayed[k].rotation.y += playMotionSpeed * ( untappedRot.y - creatureBeingPlayed[k].rotation.y );
			creatureBeingPlayed[k].rotation.z += playMotionSpeed * ( untappedRot.z - creatureBeingPlayed[k].rotation.z );
		}

		k -= 1;

		if ( Math.abs( ( creatureCardPos.x + ( creaturesInPlay.length + k ) * creatureGap ) - creatureBeingPlayed[k].position.x ) <= 0.01 &&
		 Math.abs( creatureCardPos.y - creatureBeingPlayed[k].position.y ) <= 0.01 &&
		 Math.abs( creatureCardPos.z - creatureBeingPlayed[k].position.z ) <= 0.01 ) {

			for ( k = 0; k < creatureBeingPlayed.length; k++ ) {
				creaturesInPlay.push( creatureBeingPlayed[k] );
			}

			isPlayingCards = false;
			creatureBeingPlayed = [];
		} else {
			isPlayingCards = true;
		}

	}

	if ( creatureBeingTapped.length > 0 ) { // Creature Being Tapped


	}

	if ( creatureBeingUntapped.length > 0 ) { // Creature Being Untapped


	}

	if ( magicBeingPlayed.length > 0 ) { // Magic Being Played


	}

	if ( otherLandBeingPlayed.length > 0 ) { // Other player land being played

		for ( k = 0; k < otherLandBeingPlayed.length; k++ ) {
			otherLandBeingPlayed[k].position.x += playMotionSpeed * ( ( otherUntappedLandPos.x - ( otherUntappedLand.length + k ) * landGap ) - otherLandBeingPlayed[k].position.x );
			otherLandBeingPlayed[k].position.y += playMotionSpeed * ( ( otherUntappedLandPos.y + ( otherUntappedLand.length + k ) * landGapY ) - otherLandBeingPlayed[k].position.y );
			otherLandBeingPlayed[k].position.z += playMotionSpeed * ( otherUntappedLandPos.z - otherLandBeingPlayed[k].position.z );

			otherLandBeingPlayed[k].rotation.x += playMotionSpeed * ( otherUntappedRot.x - otherLandBeingPlayed[k].rotation.x );
			otherLandBeingPlayed[k].rotation.y += playMotionSpeed * ( otherUntappedRot.y - otherLandBeingPlayed[k].rotation.y );
			otherLandBeingPlayed[k].rotation.z += playMotionSpeed * ( otherUntappedRot.z - otherLandBeingPlayed[k].rotation.z );
		}

		k -= 1;

		if ( Math.abs( ( otherUntappedLandPos.x - ( otherUntappedLand.length + k ) * landGap ) - otherLandBeingPlayed[k].position.x ) <= 0.01 &&
		 Math.abs( ( otherUntappedLandPos.y + ( otherUntappedLand.length + k ) * landGapY ) - otherLandBeingPlayed[k].position.y ) <= 0.01 &&
		 Math.abs( otherUntappedLandPos.z - otherLandBeingPlayed[k].position.z ) <= 0.01 ) {

			for ( k = 0; k < otherLandBeingPlayed.length; k++ ) {
				otherUntappedLand.push( otherLandBeingPlayed[k] );
			}

			for ( k = 0; k < otherUntappedLand.length; k++ ) {
				objects.push( otherUntappedLand[k] );
			}

			isPlayingCards = false;
			otherLandBeingPlayed = [];
		} else {
			isPlayingCards = true;
		}

	}

	if ( otherCreatureBeingPlayed.length > 0 ) {

		for ( k = 0; k < otherCreatureBeingPlayed.length; k++ ) {
			otherCreatureBeingPlayed[k].position.x += playMotionSpeed * ( ( otherCreaturePos.x - ( otherCreaturesInPlay.length + k ) * creatureGap ) - otherCreatureBeingPlayed[k].position.x );
			otherCreatureBeingPlayed[k].position.y += playMotionSpeed * ( otherCreaturePos.y - otherCreatureBeingPlayed[k].position.y );
			otherCreatureBeingPlayed[k].position.z += playMotionSpeed * ( otherCreaturePos.z - otherCreatureBeingPlayed[k].position.z );

			otherCreatureBeingPlayed[k].rotation.x += playMotionSpeed * ( otherUntappedRot.x - otherCreatureBeingPlayed[k].rotation.x );
			otherCreatureBeingPlayed[k].rotation.y += playMotionSpeed * ( otherUntappedRot.y - otherCreatureBeingPlayed[k].rotation.y );
			otherCreatureBeingPlayed[k].rotation.z += playMotionSpeed * ( otherUntappedRot.z - otherCreatureBeingPlayed[k].rotation.z );
		}

		k -= 1;

		if ( Math.abs( ( otherCreaturePos.x - ( otherCreaturesInPlay.length + k ) * creatureGap ) - otherCreatureBeingPlayed[k].position.x ) <= 0.01 &&
		 Math.abs( otherCreaturePos.y - otherCreatureBeingPlayed[k].position.y ) <= 0.01 &&
		 Math.abs( otherCreaturePos.z - otherCreatureBeingPlayed[k].position.z ) <= 0.01 ) {

			for ( k = 0; k < otherCreatureBeingPlayed.length; k++ ) {
				otherCreaturesInPlay.push( otherCreatureBeingPlayed[k] );
			}

			for ( k = 0; k < otherCreaturesInPlay.length; k++ ) {
				objects.push( otherCreaturesInPlay[k] );
			}

			isPlayingCards = false;
			otherCreatureBeingPlayed = [];
		} else {
			isPlayingCards = true;
		}

	}

};

var drawCards = function( value ) {

	for ( i = 0; i < value; i++ ) {

		var cardTexture = THREE.ImageUtils.loadTexture( "../images/" + deck[i] + ".jpg" );
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

		card.name = deck[i];

		//objects.push( card );
		scene.add( card );
		cardsBeingDrawn.push( card );
	}

	for ( i = 0; i < value; i++ ) {
		deck.shift();
	}

	isDrawingCards = true;

};

var drawCardMotion = function() {

	for ( j = 0; j < cardsBeingDrawn.length; j++ ) {
		/*+ ( hand.length + j ) * handCardGap*/
		cardsBeingDrawn[j].position.x += drawMotionSpeed * ( ( handPos.x + ( hand.length + j ) * handCardGap ) - cardsBeingDrawn[j].position.x );
		cardsBeingDrawn[j].position.y += drawMotionSpeed * ( handPos.y - cardsBeingDrawn[j].position.y );
		cardsBeingDrawn[j].position.z += drawMotionSpeed * ( handPos.z - cardsBeingDrawn[j].position.z );

		cardsBeingDrawn[j].rotation.x += drawMotionSpeed * ( handRot.x - cardsBeingDrawn[j].rotation.x );
		cardsBeingDrawn[j].rotation.y += drawMotionSpeed * ( handRot.y - cardsBeingDrawn[j].rotation.y );
		cardsBeingDrawn[j].rotation.z += drawMotionSpeed * ( handRot.z - cardsBeingDrawn[j].rotation.z );
	}

	j-= 1;

	if ( Math.abs( ( handPos.x + ( hand.length + j ) * handCardGap ) - cardsBeingDrawn[j].position.x ) <= 0.01 &&
		 Math.abs( handPos.y - cardsBeingDrawn[j].position.y ) <= 0.01 &&
		 Math.abs( handPos.z - cardsBeingDrawn[j].position.z ) <= 0.01
		 ) {

		for ( k = 0; k < cardsBeingDrawn.length; k++ ) {
			hand.push( cardsBeingDrawn[k] );
			objects.push( cardsBeingDrawn[k] );
		}

		isDrawingCards = false;
		cardsBeingDrawn = [];
	}

};

var tapCard = function( card ) {

	if ( cards[card.name].type == "Land" ) {
		landBeingTapped.push( card );
	} else if ( cards[card.name].type == "Creature" ) {
		creatureBeingTapped.push( card );
	}

};

var untapCard = function( card ) {

	if ( cards[card.name].type == "Land" ) {
		landBeingUntapped.push( card );
	} else if ( cards[card.name].type == "Creature" ) {
		creatureBeingUntapped.push( card );
	}

};

var canAffordCard = function( card ) {

	if ( cards[card.name].type == "Creature" ) {
		return true;
	}

	return false;

	// Not Working..
	for ( i = 0; i < cards[card.name].cost.length; i+= 2 ) {

		if ( cards[card.name].cost[i + 1] != "A" ) {
			for ( l = 0; l < untappedLand.length; l++ ) {
				if ( cards[untappedLand[l].name].type[0] == cards[card.name].cost[i + 1] && countedLands.indexOf( l ) == -1 ) {
					count++;
					countedLands.push( l );
				}
			}
		} else {
			for ( l = 0; l < untappedLand.length; l++ ) {
				if ( countedLands.indexOf( l ) == -1 ) {
					count++;
					countedLands.push( l );
				}
			}
		}

		if ( !( count >= cards[card.name].cost[i] ) ) {
			console.log( "Not enough resources!!" );
			return false;
		}

		count = 0;
	}
	
	// Player has enough resources to play this card..

	for ( i = 0; i < cards[card.name].cost.length; i+= 2 ) {

		if ( cards[card.name].cost[i + 1] != "A" ) {
			for ( l = 0; l < untappedLand.length; l++ ) {
				if ( cards[untappedLand[l].name].type[0] == cards[card.name].cost[i + 1] && count <  cards[untappedLand[l]].cost[i] ) {
					count++;
					tapCard( card ); // Tap Card
				}
			}
		} else {
			for ( l = 0; l < untappedLand.length; l++ ) {
				if ( count < cards[untappedLand[l]].cost[i] ) {
					count++;
					tapCard( card ); // Tap Card
				}
			}
		}

		count = 0;

	}

	count = 0;
	countedLands = [];

	return true;
};

var loadDeck = function( ) {


	for ( card in cards )
		deck.push( "" + card + "" );

	/*
	for ( i = 0; i < deckSize; i++ ) {
		deck.push( "" + "Forest" + "" );
	}*/
	

	shuffleDeck();

};

var shuffleDeck = function() {

	for ( i = 0; i < deck.length ; i++ ) {

		j = Math.floor( Math.random() * i );
		
		temp = deck[i];
		deck[i] = deck[j];
		deck[j] = temp;
	}

};
