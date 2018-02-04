define( ['girl', 'categories', 'CardList', 'difficulties', 'preloader'],
function( Girl, categories, cardList, difficulties, preloader )
{
	

	

	var getCategories = function( difficulty )
	{
		return _.head( _.shuffle( _.range( categories.length ) ), 
					   difficulty.categories );
	}

	var getLikes = function( difficulty, cats )
	{
		var selected = _.head( 	_.shuffle( cats ), 
					   			difficulty.likes );
		return selected;
		var likes = [];
		for( var i = 0, l = categories.length; i < l; ++i )
		{

			if ( _.contains( selected, i ) )
			{
				//console.log( 'like', i );
				likes.push( i );
			}
		}

		return likes;
	}

	var cardsInCategory = function( cats )
	{
		return _.filter( cardList, function( card )
		{
			return _.intersection( cats, card.categories ).length > 0;
		});
	}

	var getLoves = function( difficulty, availableCards )
	{


		return _.reduce( _.head( _.shuffle( availableCards ),
								 difficulty.loves ),
						function( m, card )
						{
							m.push( card.name );

							return m;
						},
						[] );
	}

	var getHates = function( difficulty, availableCards, loves )
	{
		var filtered = _.filter( availableCards, function( card )
		{
			return !_.contains( loves, card.name );
		});

		return _.reduce( _.head( _.shuffle( filtered ), difficulty.hates ),
						function( m, card )
						{
							m.push( card.name );

							return m;
						},
						[] );
	}
	
/*girl = Girl.create( {
			img : 'img/girls/' + currentGirl + '.jpg',
			categories : [ 3, 6, 7, 5, 11 ],
			likes : [ 3, 6, 11 ],
			loves : [ 'cats', 'cartoons' ],
			hates : [ 'bodyBuilding', 'smoking' ]

		});*/
	var maxGirls = 10,
		girls = [];
	/*var finishedLoad = _.after( maxGirls, function()
	{

	})*/
	_.each( _.range( maxGirls ), function( id )
	{
		
		preloader.load('img/girls/girl' + id + '.png', function( img )
		{
			girls.push( img );
		});
	})
	
	var shuffleGirls = function()
	{
		girls = _.shuffle( _.range( maxGirls ) );
	}
	var generate = function( currentGirl, d )
	{
		difficulty = difficulties[ d ];
		var categories = getCategories( difficulty );
		////console.log( 'num cats = ', categories.length, categories );
		var likes  = getLikes( difficulty, categories );
		////console.log( 'likes', likes );
		var availableCards = cardsInCategory( likes );
		var loves = getLoves( difficulty, availableCards );
		////console.log( 'loves', loves );
		var hates = getHates( difficulty, availableCards, loves );
		////console.log( 'hates', hates );



		////console.log( categories, likes, availableCards, loves, hates);
		return Girl.create( {
			img : preloader.get( 'img/girls/girl' + girls[ currentGirl ] + '.png' ),
			categories : categories,
			likes : likes,
			loves : loves,
			hates : hates,
			difficulty : d
		})
	}

	var ret =  {
		generate : generate,
		shuffleGirls : shuffleGirls,
		isReady : function()
		{
			return girls.length === maxGirls;
		}
	}

	return ret;
})