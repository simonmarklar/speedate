define( ['categories', 'prefixes', 'config', 'lib/lucid', 'difficulties', 'CardList' ],
function( categories, prefixes, config, lucid, difficulties, cardList )
{

	var $container = $("#girl"),
		$speech = $("#speech");

	var sndOps = { formats: ['mp3'] }
	var sounds = [ 
		new buzz.sound( 'snd/button-it-up', sndOps),
		new buzz.sound( 'snd/laughing', sndOps),
		new buzz.sound( 'snd/mmmhm', sndOps),
		new buzz.sound( 'snd/oh-boogers', sndOps),
		new buzz.sound( 'snd/woohoo', sndOps),
		new buzz.sound( 'snd/yawn', sndOps)
	];


	var Girl = function( options )
	{
		this.img = options.img;
		this.categories = options.categories;
		this.likes = options.likes;
		////console.log( 'girl likes', this.likes );
		this.dislikes = _.difference( options.categories, options.likes );
		////console.log( 'girl dislikes', this.dislikes );
		this.loves = options.loves;
		this.hates = options.hates;

		this.difficulty = options.difficulty;

		/*this.lovesYou = [
			"<3 You got me in the feels. Here's my number",
			"<3 oohh we're so compatible!",
			"<3 Here's my number, call me maybe?",
			"<3 See you after this, at my place ;)",
			"<3 <3 <3 <3"
		];

		this.hatesYou = [
			"You're not my type",
			"You're so up yourself",
			"You. No. Just no.",
			"All the good ones are taken :(",
			"o_O what. ever."
		];*/

		this.loveMultiplier = options.loveMultiplier || 3;
		this.hateMultiplier = options.hateMultiplier || 3;


		this.categoriesUsed = [];
		this.lovesUsed = [];
		this.hatesUsed = [];

		lucid.emitter( this );


		this.currentRound = 1;

		$container.empty().append( this.img ); //css( 'background', 'url(' + this.img + ') no-repeat right top' );
		$container.removeClass('bounce')

		this.debug && this.debug();

	}

	Girl.prototype.optionsLeft = function()
	{
		return ( this.categories.length + this.loves.length + this.hates.length ) - 
			   ( this.categoriesUsed.length + this.lovesUsed.length + this.hatesUsed.length );
	}

	Girl.prototype.howManyHints = function()
	{
		if ( this.currentRound === 1 )
			return 1;

		var roundsLeft = config.maxRounds - this.currentRound,
			optionsLeft = this.optionsLeft();

		if ( roundsLeft === 0 )
			return optionsLeft;

		var maxChoices= 3;
		if ( optionsLeft <= maxChoices )
			maxChoices = optionsLeft - 1;

		var num = Math.min( maxChoices, Math.floor( Math.random() * optionsLeft  ) );
		////console.log( 'im going to say', num, 'things' );
		return num > 0 ? num : 1;// < 4 ? num : 3;
	}

	Girl.prototype.talk = function( speech )
	{
		speech = speech || "";
		$container.addClass('bounce');
		var height = 0;

		if ( speech === "" )
		{
			for( var i = 0, l = this.howManyHints(); i < l; ++i )
			{

				previousPrefix = null;
				speech += this.selectSpeech(   );
			}
			height = i * 30;
		}

		$speech	.fadeOut( 'fast', function()
				{
					$speech.empty()
					//.html( '<div style="position:relative; top:" >' +  speech + '</div>' )
						.html( speech )
						.fadeIn( 'fast' );	
				} )
				

		config.debug && this.debugTalking();

		

		this.currentRound++;
		//$container.removeClass('animated');
		
	}

	var previousPrefix = null;
	var speechTypes = [
		//category
		function()
		{
			////console.log( 'saying what a category');
			var available = _.difference( this.categories, this.categoriesUsed ),
				idx = Math.floor( Math.random() * ( available.length  ) );

			if ( available.length === 0 )
				return false;

				////console.log( 'randon index ', idx, 'availableCategories', availableCategories.length );
			var category = available[ idx ],
				liked = _.contains( this.likes, category ),
				data = liked ? prefixes.like : prefixes.dislike
				idx = null;

			while( idx === previousPrefix )
			{
				idx = Math.floor( Math.random() * data.length );
			}
			previousPrefix = idx;

			var prefix = data[ idx ];

			this.categoriesUsed.push( category );

			

			var c = categories[ category ];
				////console.log ( c, c.substring(c.length -1) === 's' );
			return prefix.format( c, c.substring(c.length-1) === 's'? "they're" : "it's" );

		},


		//loves
		function()
		{
			////console.log( 'saying what I love');
			var available = _.difference( this.loves, this.lovesUsed ),
				idx = Math.floor( Math.random() * ( available.length  ) );

			if ( available.length === 0 )
				return false;

				////console.log( 'randon index ', idx, 'availableCategories', availableCategories.length );
			var loves = available[ idx ]
				prefix = prefixes.love[ Math.floor( Math.random() * prefixes.love.length ) ];

				this.lovesUsed.push( loves );

				////console.log ( loves, loves.substring(loves.length-1) === 's' );

			return prefix .format( loves, loves.substring(loves.length-1) === 's'? "they're" : "it's" );
		},

		//hates
		function()
		{
			////console.log( 'saying what I hate');
			var available = _.difference( this.hates, this.hatesUsed ),
				idx = Math.floor( Math.random() * ( available.length  ) );

			if ( available.length === 0 )
				return false;

				////console.log( 'randon index ', idx, 'availableCategories', availableCategories.length );
			var hates = available[ idx ]
				prefix = prefixes.hate[ Math.floor( Math.random() * prefixes.hate.length ) ];

				this.hatesUsed.push( hates );
				////console.log ( hates, hates.substring(hates.length-1) === 's' );
			return prefix.format( hates, hates.substring(hates.length-1) === 's'? "they're" : "it's" );
		}
	]

	Girl.prototype.selectSpeech = function(  )
	{
		/*var totalAvail = ( this.categories.length - this.categoriesUsed.length ) +
						 ( this.loves.length - this.lovesUsed.length ) +
						 ( this.hates.length - this.hatesUsed.length );
*/
		

	
		var speech = null, 
			availableTypes = speechTypes;

		while (!speech )
		{
			var rand = Math.floor( Math.random() * availableTypes.length );
			////console.log( 'random speech = ', rand)
			speech = availableTypes[ rand ].call( this );
			if ( !speech )
			{
				//return;
				////console.log( "i've said all I can about type", rand )
				// speech type not available
				//max -= 4;
				////console.log( 'removing type ', rand );

				availableTypes = _.without( availableTypes, availableTypes[ rand ] );

				////console.log( 'speech types left ', availableTypes.length );
				if ( availableTypes.length === 0 )
				{

					//this.reset();

					var finished = function()
					{
						var cardNames = _.reduce(  $("#card-holder").children( ), function( m, card )
						{
							m.push( $(card).text() );
							return m;
						}, [] );

						var cards = _.filter( cardList, function( card )
						{
							return _.contains( cardNames, card.name );
						});


						this.decide( cards );
					}.bind( this );
					setTimeout( function(){ finished(); }, 750 );
					return "Hmmmm";
					//return this.chitchat();
				}
			}
		}
		return '<p>' + speech + '.</p>';

	}

	Girl.prototype.chitchat = function()
	{
		//sounds[ Math.floor( Math.random() * sounds.length ) ].play();
		return prefixes.chitchat[ Math.floor( Math.random() * prefixes.chitchat.length) ];
	}

	Girl.prototype.done = function( gotNumber )
	{
		this.trigger( 'decided', gotNumber );
	}

	Girl.prototype.decide = function( finalCards )
	{
		////console.log( "######################## final cards", finalCards);
		var points = 0;

		var likes = _.filter( finalCards, function( card )
		{
			////console.log( 'likes ', this.likes, 'card cats=', card.categories );
			return _.intersection( card.categories, this.likes ).length > 0;
		}, this).length;

		var dislikes = _.filter( finalCards, function( card )
		{

			////console.log( 'dislikes ', this.dislikes, 'card cats=', card.categories );
			return _.intersection( card.categories, this.dislikes ).length > 0;
		}, this).length;

		var loves = _.filter( finalCards, function( card )
		{

			////console.log( 'loves ', this.loves, 'card name=', card.name );
			return _.contains( this.loves, card.name );
		}, this).length * this.loveMultiplier;

		var hates = _.filter( finalCards, function( card )
		{

			////console.log( 'hates ', this.hates, 'card name=', card.name );
			return _.contains( this.hates, card.name );
		}, this).length  * this.hateMultiplier;

		//console.log( 'like points = ', likes + loves, 'dislike point =', dislikes + hates);

		points = likes - dislikes + loves - hates;

		var d = difficulties[ this.difficulty ];
		//console.log( 'total points', points, 'soulmate=', d.soulmate, 'number=', d.getNumber );
		var self = this;

		if ( points >= d.soulmate )
		{
			this.talk("<3 Oh my god!, where have you been all my life?!");
			setTimeout( function() { self.done('soulmate') }, 500 );
			return;
		}

		if ( points >= d.getNumber )
		{
			this.talk("Hey, I just met you, and this is crazy, but here's my number. Call me, maybe?");
			setTimeout( function() { self.done('number') }, 500 );
			return;
		}

		this.talk( "Its not you, it's me. No actually, it's you.");
		setTimeout( function() { self.done('nothing') }, 500 );
		return;
		
		/*if ( points <= 0 )
		{
			this.talk( "You're a creep!" );
			setTimeout( function() { self.done() }, 500 );
			return;
		}

		
		if ( points > 0 )
		{
			this.talk( "Oooh you make my heart beat so fast!<br/><br /> Here's my number. Call me, maybe?");
			setTimeout( function() { self.done(true) }, 500 );
			return;
		}*/
		/*if ( points < -1 )
		{
			this.talk( "You're a creep!" );
			setTimeout( function() { self.done() }, 2000 );
			return;
		}

		if ( points > -1 && points < 1 )
		{
			this.talk( 'meh' );
			setTimeout( function() { self.done() }, 2000 );
			return;
		}

		if (points >= 1 && points <= 5)
		{
			this.talk( "You're nice, but not my type" );
			setTimeout( function() { self.done() }, 2000 );
			return;
		}

		if ( points > 5 )
		{
			this.talk( "Hey, this is crazy, and I just met you, so here's my number. Call me maybe ?");
			setTimeout( function() { self.done(true) }, 2000 );
			return;
		}*/


	}

	Girl.prototype.reset = function()
	{
		////console.log( '### resetting')
		this.categoriesUsed = [];
		this.lovesUsed = [];
		this.hatesUsed = [];
	}


	if ( config.debug )
	{
		$container.append("<div class='debug'></div>");

		

		Girl.prototype.debug = function()
		{
			var html = _.reduce( this.categories, function( m, cat )
			{
				//console.log( 'debug - cat =', cat);
				return m+='<li class="' + ( _.contains( this.likes, cat ) ? 'like' : 'dislike' ) +'"">' + categories[ cat ] + '</li>';
			}, "", this );

			html += _.reduce( this.loves, function( m, love)
			{
				return m += '<li class="loves">' + love + '</li>';
			}, "" );

			html += _.reduce( this.hates, function( m, hate)
			{
				return m += '<li class="hates">' + hate + '</li>';
			}, "" );



			$('.debug', $container).empty().append( '<ul>' + html + '</ul>' );
		}

		Girl.prototype.debugTalking = function()
		{
			var compile = function( available, title )
			{
				var html = _.reduce( available, function( m, cat )
				{
					if ( title === 'categories' )
						cat = categories[ cat ];

					return m+= '<li>' + cat + '</li>';
				}, '<p>Available ' + title + '</p><ul>')

				html += '</ul>';
				return html;
			}

			$("#speechDebug").empty().append( 	'<p> current round ' + this.currentRound + '</p>' +  
												compile( _.difference( this.categories, this.categoriesUsed ), 'categories' )+
									  			compile( _.difference(this.loves, this.lovesUsed ), 'loves') + 
								  				compile( _.difference(this.hates, this.hatesUsed ), 'hates') );
		}
	}

	return {
		create : function( options )
		{
			return new Girl( options );
		}
	};
});