var maxHP = 20;
var playerHP = maxHP;
var opponentHP = maxHP;

var myTurn = true;
var landsAbleToPlay = 1;
var status = 0; // 0 = main, 1 = combat, 2 = secondary, 3 = end
var statusGap = 25;
var timerStopped = true;
var maxTime = 10;
var timeLeft = maxTime;
var oldTime;
var newTime = 0;
var deltaTime = 0;

var cardDetailVisible = false;

var initializeGame = function () {

	bg_image.style.display = 'none';
	lobby_panel.style.display = 'none';
	bg_image.style.zIndex = -1;
	lobby_panel.style.zIndex = -1;
		
	player1_healthtext.innerHTML = playerHP;
	player2_healthtext.innerHTML = opponentHP;

	oldTime = new Date().getTime() / 1000;

	timerStopped = false;
};

var loseLife = function( value ) {

};

var gainLife = function( value ) {

};

var showCardDetail = function( name ) {
	cardInDetailedView.src = "images/" + name + ".jpg";

	cardInDetailedView.style.display = 'initial';

	$('#cardInDetailedView').removeClass('animated rollOut');
	$('#cardInDetailedView').addClass('animated rollIn');

	cardDetailVisible = true;
};

var hideCardDetail = function( name ) {

	$('#cardInDetailedView').removeClass('animated rollIn');
	$('#cardInDetailedView').addClass('animated rollOut');

	cardDetailVisible = false;

};

var changeStatus = function() {

	status++;

	if ( status >= 4 ) {
		status = status % 4
	}

	if ( myTurn ) { // left default: 107px
		p1_status.style.left = 107 + status * statusGap;
	} else {
		p2_status.style.left = 107 + status * statusGap;
	}

};

var runTimer = function() {

	if ( timeLeft <= 0 ) {

		timeLeft = maxTime;

		checkTurn();

		changeStatus();

	} else {
		newTime = new Date().getTime() / 1000;
		deltaTime = newTime - oldTime;
		timeLeft -= deltaTime;
		oldTime = newTime;

		if ( myTurn ) {
			p1_timer.style.width = Math.floor( ( timeLeft / maxTime ) * 90 );// 90px max
		} else {
			p2_timer.style.width = Math.floor( ( timeLeft / maxTime ) * 90 );// 90px max
		}
	}

};

var checkTurn = function() {

	if ( status == 3 ) {
		myTurn = myTurn ? false : true ;

		p1_timer.style.width = 90;
		p2_timer.style.width = 90;

		p1_status.style.left = 107;
		p2_status.style.left = 107;

		if ( myTurn ) { // Beginning of Phase

			// Untap lands
			if ( tappedLand.length > 0 ) {

				for ( l = 0; l < tappedLand.length; l++ )
					untapCard( tappedLand[l] );

			}

			// Untap creatures
			if ( tappedCreaturesInPlay.length > 0 ) {

				for ( l = 0; l < tappedCreaturesInPlay; l++ )
					untapCard( tappedCreaturesInPlay[l] );

			}

			// Draw a card
			drawCards( 1 );
			landsAbleToPlay++;

		} else {

			landsAbleToPlay = 0; // Reset Lands

		}
	}

};

var toggleTimer = function( pornp ) { // Pressed or not Pressed

	timerStopped = timerStopped ? false : true ;

	if ( !timerStopped )
		oldTime = new Date().getTime() / 1000;

	if ( pornp == "pressed" ) {

		conn.send(JSON.stringify({
	    	Title: "stopTimer",
	    	Action: {
	    		Title: "stopTimer", // Lose health
	    		Amount: null
	    	}
	    }));

	}
};

var skipPhase = function() {
	if ( myTurn ) {
		
		timeLeft = maxTime;
		checkTurn();
		changeStatus();

		conn.send(JSON.stringify({
	    	Title: "skipPhase",
	    	Action: {
	    		Title: "skipPhase", // Lose health
	    		Amount: null
	    	}
	    }));
	}
};

var otherPlayerSkipPhase = function() {

	if ( !myTurn ) {
		timeLeft = maxTime;
		checkTurn();
		changeStatus();
	}
};