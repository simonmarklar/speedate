define( ['girlGenerator', 'dealer', 'config', 'countDown', 'preloader' ],
function( girlGenerator, dealer, config, timeLimit, preloader )
{
	String.prototype.format = function() {
	  var args = arguments;
	  return this.replace(/{(\d+)}/g, function(match, number) { 
	    return typeof args[number] != 'undefined'
	      ? args[number]
	      : match
	    ;
	  });
	};

	/*var $cardContainer = $("#card-holder");

	$cardContainer.dragdrop();*/

	var currentRound = config.maxRounds,
		currentGirl = -1,
		numPhoneNumbers = 0,
		//timeLimit = null,
		$cardHolder = $("#card-holder"),
		$next = $("#next"),
		$game = $("#game"),
		difficulty = "",
		score = {
			soulmate : 0,
			number : 0,
			nothing : 0
		};

	var backgroundSound = new buzz.sound( 'snd/ambient-talking', { formats: ['mp3']} );


	var girl = null,
		guysImg = [];

	_.each( _.range( 3 ), function( id )
	{
		preloader.load( 'img/guys/guy'+id+'.png', function( img )
		{
			guysImg.push( img );
		} )
	} );
	
	var finished = function()
	{
		var guys = {
			easy : guysImg[0],
			medium : guysImg[1],
			hard : guysImg[2],
		}
		$("#guy").empty().append( guys[difficulty]);//.css( 'background', 'url(' + guys[difficulty] + ') no-repeat center center' );
		$game.fadeOut( 1000, function()
		{
			$("#summaryScreen").slideDown('fast', function()
			{
				var html = _.reduce( _.range( score.number), function(m)
				{
					return m+= '<img src="img/phone.png" class="phone" />';
				}, "" )
				$("#numbers").html( "<p>You got " + score.number + " numbers</p>" + html);

				html = _.reduce( _.range( score.soulmate), function(m)
				{
					return m+= '<img src="img/soulmate.png" class="phone" />';
				}, "" )
				$("#soulmates").html( "<p>You found " + score.soulmate + " soulmates</p>" + html );

				
			});
		} );
	}

	var next = function()
	{
		

		$("#game").css('opacity', 0.3 );
		$next.fadeIn( 'slow', function()
		{
			$next.fadeOut( 500, function()
			{
				$game.css('opacity', 1 );
				setupNextGirl();
			})
		})
	}

	var setupNextGirl = function( )
	{
		currentGirl++;
		if ( currentGirl > config.maxGirls )
		{
			finished();
			return;
		}

		girl = girlGenerator.generate( currentGirl,difficulty); 

		dealer.setGirl( girl );

		girl.talk( );

		$cardHolder.empty();

		dealer.putCardsInPlay( dealer.selectCards( config.maxCards ) );

		girl.on( 'decided', function( result )
		{
			
			girl.off( 'decided' );
			//console.log( result );
			score[ result ]++;
			next();

		});

		$("#playYourHand").fadeOut( 'fast', function()
		{
			$("#dealCards").fadeIn( 'fast' );
		} );

		
	}

	//dealer.setGirl( girl );

	$("#dealCards").on( 'click', _.debounce( function( e )
	{
		var children = $cardHolder.children().length;

		/*if ( children === config.maxCards )
			return;
		config.debug && //console.log('cards in play=', children);
		if ( children ) 
		{*/
			dealer.putCardsInPlay( dealer.selectCards( config.maxCards - children ));

			girl.talk(  );

			if ( currentRound < 0 )
				currentRound = config.maxRounds
		//}


		return false;
	}, 500, true));	

	//setupNextGirl();
	var $startScreen = $('#startScreen'),
		$gameScreen = $('#game');

	var onTimeout = function()
	{
		timeLimit.reset();
		/*next();
		setupNextGirl();*/
		setTimeout( function() { finished(); }, 2000 );
	}
	timeLimit.on( 'timeout', onTimeout );

	var $guy = $("#boy");
	$('.btn', $startScreen).on( 'click', function()
	{
		if ( !girlGenerator.isReady() ) 
		{
			alert( 'Hang on, the girls are late! Wait until their makeup is on');

			return false;
		}
		var self = $(this);
		difficulty =  self.attr('id');
		var guys = {
			easy : guysImg[0],
			medium : guysImg[1],
			hard : guysImg[2],
		}
		$guy.empty().append( guys[ difficulty ] );
		/*if ( difficulty === 'easy' )
		{
			$guy.css( 'background', 'url( img/guys/guy0.png) no-repeat left bottom');
		}

		if ( difficulty === 'medium' )
		{
			$guy.css( 'background', 'url( img/guys/guy1.png) no-repeat left bottom');
		}

		if ( difficulty === 'hard' )
		{
			$guy.css( 'background', 'url( img/guys/guy2.png) no-repeat left bottom');
		}*/
		girlGenerator.shuffleGirls();
		$startScreen.animate( {'left' :5000 }, 'fast', function()
		{
			$gameScreen.fadeIn( 'fast', function( )
			{
				backgroundSound	.setVolume( 50 )
								.play()
								.loop();
				//timeLimit = countDown.create( difficulty );
				!config.debug && timeLimit.start( difficulty );
				//console.log( difficulty);
				setupNextGirl( );
			});
		});
	});

	$("#restart").on('click', function()
	{
		currentGirl = 0;
		score = {
			soulmate : 0,
			number : 0,
			nothing : 0
		};
		$("#summaryScreen").slideUp( 'fast', function()
		{
			$startScreen.animate({'left': 0}, 'fast' );
		})
	})

	//dealer.putCardsInPlay( dealer.selectCards( config.maxCards ) );


})