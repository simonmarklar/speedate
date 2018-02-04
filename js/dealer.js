define( [ 'config', 'CardList', 'Card'],
function( config, cardList, Card )
{
	var availableCards = cardList,
		cardsPlayed = [],
		girl = null,

		shuffleSound = new buzz.sound( "snd/shuffling-cards", { formats: ['mp3'] } );
		cardBeingDragged = null,

		$cardHolder = $("#card-holder"),

		cardTemplate = _.template('<li id="<%= name %>" class="card"><span><br/><br/><br/><%= name %></span></li>'),

		dragFunc = function( ev, dd )
		{
			$( this ).css({
				top: dd.offsetY,
				left: dd.offsetX,
				position:'absolute'
			});

			cardBeingDragged = $(dd.drag);
		},
		dragOpts = { relative:true },

		dropFunc = function( e )
		{
			/*cardBeingDragged.css('-webkit-transform', 'scale(0)');
			setTimeout( function(){ 
				cardBeingDragged.off('drag').remove(); 
				cardBeingDragged = null;
				}, 350 );
*/
			cardBeingDragged.animate({'top': 10000 }, 400, function()
			{
				cardBeingDragged.off('drag').remove(); 
				cardBeingDragged = null;
			})




			//putCardsInPlay( selectCards( 1 ) );
		},
		cancelDrop = function()
		{
			cardBeingDragged.css( {'position' : 'static', 'top' : 0 , 'left' : 0});
	
		};


		


	$('#stage').drop( null, dropFunc );
	$cardHolder.drop(null, cancelDrop );
	$('body').drop(null, cancelDrop );

	var selectCards = function( numCards )
		{
			var cards 

			if ( girl.difficult = "easy" )
			{
				//console.log( 'selected cards' );
				cards =  _.head( _.shuffle( availableCards ) ,numCards );
			}
			else
			{
				//console.log( 'full deck')
				//select cars based on girls likes
				cards  =_.head(  _.filter( _.shuffle( availableCards ), function( card )
				{
					var categories = card.categories;

					var inBoth = _.intersection( categories, girl.categories );
					return !( inBoth.length === 0) ;
				}), numCards );
			}


			availableCards = _.difference( availableCards, cards );

			_.each( availableCards, function( card )
			{
				cardsPlayed.push( card );
			})

			var remainder =  numCards - cards.length;
			if ( remainder )
			{
				var extraCards = _.head( _.difference(cardList, cardsPlayed ),
										remainder  );

				_.each( extraCards, function( card )
				{
					cards.push( card );
				})
			}

			return cards;

		},

		putCardsInPlay = function( cards )
		{
			//cardsInPlay = cards;
			shuffleSound.play();
			setTimeout( function(){shuffleSound.stop();}, 400);
			var html = _.reduce( cards, function( m, card )
			{
				return m += cardTemplate( card );
			}, "");

			$cardHolder.append( html );

			if ( girl.currentRound > config.maxRounds )
			{
				//console.log( '##### no more discarding ####');
				$(".card", $cardHolder).off( 'drag' );
				$("#dealCards").fadeOut( 'fast', function()
				{
					//$("#playYourHand").fadeIn( 'fast' );
				});
				return;
			}
				
			$(".card", $cardHolder).drag( dragFunc, dragOpts );
			setTimeout( function(){ shuffleSound.stop() }, 400 );
		}


		setGirl = function( g )
		{
			girl = g;
			availableCards = cardList;
			cardsPlayed = [];
			$('#playYourHand').off( 'click')
				.on( 'click', _.debounce(function()
				{
					var cardNames = _.reduce(  $cardHolder.children( ), function( m, card )
					{
						m.push( $(card).text() );
						return m;
					}, [] );

					var cards = _.filter( cardList, function( card )
					{
						return _.contains( cardNames, card.name );
					});


					girl.decide( cards );

					return false;
				},5000, true) )
		}




	return {
		setGirl : setGirl,

		selectCards : selectCards,

		putCardsInPlay : putCardsInPlay
	}
})