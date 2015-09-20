var addr = "localhost:8081"; // when selected: wss -> ws
var pubAddr = document.domain; // when selected: ws -> wss
//afternoon-taiga-9428.herokuapp.com
var conn = new WebSocket( "ws://" + addr + "/ws" );
var connected = false;

var data;
var lobby = [];
var selectedUsername = "";
var requester = "";
var alreadyBeingAskedToPlay = false;

var i, j;
var index;

conn.onopen = function( e ) {
	console.log( "Connected" );
	connStatus.innerHTML = "Connected";
	connStatus.style.backgroundColor = "green";
	connected = true;
	
	// Uncomment this if deploying to Heroku
	setInterval( function() {
		if ( connected )
			conn.send( "Keep connection alive!" ); // ping server every 50000 milliseconds = 50 seconds to prevent disconnection
	}, 50000 );
	
};

conn.onclose = function( e ) {
	console.log( "Disconnected" );
	connStatus.innerHTML = "Disconnected";
	connStatus.style.backgroundColor = "red";
	connected = false;
};

conn.onmessage = function( e ) {
	
	data = JSON.parse( e.data );

	switch ( data.Title ) {
		case "requestToPlay": beingAskedToPlay( data.Action.Title ); break;
		case "respondToRequest": respondToRequest( data.Action.Amount ); break;
		case "playCard": playOtherPlayersCard( data.Action.Title ); break;
		case "addPlayer": addPlayer( data.Player.Username ); break;
		case "updateHealth": updateOtherPlayerHealth( data.Action ); break;
		case "removePlayer": removePlayer( data.Player.Username ); break;
		case "removePlayer2": removePlayer( data.Action.Title ); break;
		case "skipPhase": otherPlayerSkipPhase(); break;
		case "stopTimer": toggleTimer( "npressed" ); break;
		default: console.log( "error" );
	}
	
};

var updateOtherPlayerHealth = function( data ) {

	// convert string to int, add or subtract data.Amount
	if ( data.Title == "L" ) {

	} else if ( data.Title == "G" ) {

	}
};

var updatePlayerHealth = function( LorG, amount ) { // Tell other player Lose or Gain, amount
	
	conn.send(JSON.stringify({
    	Title: "updateHealth",
    	Action: {
    		Title: LorG, // Lose health
    		Amount: amount
    	}
    }));
    
};

var setUsername = function() {

	if ( username_area.value.length > 0 ) {

		conn.send(JSON.stringify({
	    	Title: "setUsername",
	    	Action: {
	    		Title: username_area.value, // Lose health
	    		Amount: null
	    	}
	    }));

		username_prompt.style.display = 'none';
		username_prompt.style.zIndex = -1;
		lobby_panel.style.display = 'initial';
	}
};

var addPlayer = function( name ) {
	
	lobby.push( name );
	updateLobby();
	
};

var removePlayer = function( name ) {
	
	// remove player from lobby array and update lobby gui
	index = lobby.indexOf( name );

	if ( index > -1 )
		lobby.splice( index, 1 );

	updateLobby();

	selectedUsername = "";
};

var updateLobby = function() {

	while( usernames.firstChild ){
		usernames.removeChild( usernames.firstChild );
	}

	for ( i = 0; i < lobby.length; i++ ) {
		var temp = document.createElement('li');
		
		/*
		temp.innerHTML.addEventListener( 'onclick', function() {
			console.log( "" + lobby[i] );
			selectedUsername = "" + lobby[i];
			selectedUser.innerHTML = "Selected: " + lobby[i];
		}, false);
		*/
		
		temp.innerHTML = "<a onclick = 'updateSelectedUsername(" + i + ")'>" + lobby[i] + "</a>";
		usernames.appendChild( temp );
		lobby_usernames.scrollTop = lobby_usernames.scrollHeight;
	}

};

var updateSelectedUsername = function( index ) {
	console.log( "" + lobby[index] );
	selectedUsername = "" + lobby[index];
	selectedUser.innerHTML = "Selected: " + lobby[index];
};

var beingAskedToPlay = function( name ) {

	if ( !alreadyBeingAskedToPlay ) {

		showRequest( name );

		alreadyBeingAskedToPlay = true;

	} else { // Reject request

		conn.send(JSON.stringify({
	    	Title: "respondToRequest",
	    	Action: {
	    		Title: name,
	    		Amount: 2 // Already being requested
	    	}
	    }));
	}

};

var showRequest = function( name ) {

	requester = name;
	requestMessage.innerHTML = name + " has requested to play with you!";
	playRequest_panel.style.display = 'initial';

};

var acceptRequest = function() {

	conn.send(JSON.stringify({
    	Title: "respondToRequest",
    	Action: {
    		Title: requester,
    		Amount: 1 // Accept
    	}
    }));

	playRequest_panel.style.display = 'none';
	playRequest_panel.style.zIndex = -1;

	alreadyBeingAskedToPlay = false;

	myTurn = true; // Going first
	initializeGame();

	player1_pic.src = "images/player1.jpg";
	player2_pic.src = "images/player2.jpg";
	
	drawCards( 7 );
};	

var rejectRequest = function() {

	conn.send(JSON.stringify({
    	Title: "respondToRequest",
    	Action: {
    		Title: requester,
    		Amount: 0 // Reject
    	}
    }));

	playRequest_panel.style.display = 'none';
	alreadyBeingAskedToPlay = false;

};

var requestToPlay = function() {

	if ( selectedUsername.length > 0 ) {

		conn.send(JSON.stringify({
	    	Title: "requestToPlay",
	    	Action: {
	    		Title: selectedUsername, // Lose health
	    		Amount: null
	    	}
	    }));
	}

};

var respondToRequest = function( reply ) {

	if ( reply == 0 ) { // Rejected

		alert( "Sorry, user rejected your request. Keep trying!" );

	} else if ( reply == 1 ) { // Accepted

		goingFirst = 0; // No

		myTurn = false; // Going second
		landsAbleToPlay = 0; // Reset lands
		initializeGame();

		player1_pic.src = "images/player2.jpg";
		player2_pic.src = "images/player1.jpg";
		
		drawCards( 7 );
	} else if ( reply == 2 ) { // Rejected

		alert( "Sorry, user already has pending request. Try again later!" );

	}

};

var sendMessageOfPlayingCard = function( cardName ) {

	conn.send(JSON.stringify({
    	Title: "playCard",
    	Action: {
    		Title: cardName, // Lose health
    		Amount: null
    	}
    }));

};

var playOtherPlayersCard = function( cardName ) {

	var cardTexture = THREE.ImageUtils.loadTexture( "../images/" + cardName + ".jpg" );
	cardTexture.minFilter = THREE.NearestFilter;

	var card = new THREE.Mesh( cardGeo, 
	new THREE.MeshFaceMaterial ( 
		[new THREE.MeshLambertMaterial( { transparent: false, map: cardTexture } ),
	 	 new THREE.MeshBasicMaterial( { color: 0x660000 } ) ]
	) );

	card.material.side = THREE.DoubleSide;

	card.position.x = otherHandPos.x;
	card.position.y = otherHandPos.y;
	card.position.z = otherHandPos.z;

	card.name = cardName;

	scene.add( card );

	if ( cards[cardName].type == "Land" ) {

		otherLandBeingPlayed.push( card );

	} else if ( cards[cardName].type == "Creature" ) {

		otherCreatureBeingPlayed.push( card );

	}

	isPlayingCards = true;

};