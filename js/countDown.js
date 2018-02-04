define( ['difficulties', 'lib/lucid'],
function( difficulties, lucid )
{
	var $timer = $("#timer"),
		limit = 0;

	var Timer = function(  )
	{
		//this.timeLimit = limit = difficulties[ difficulty ].timeLimit;

		lucid.emitter( this );

		
	}

	Timer.prototype.start = function()
	{
		//console.log( 'starting timer ') ;

		var countDown = function()
		{
			$timer.text( limit );

			if ( limit-- == 0 )
			{
				this.trigger( 'timeout' );
			}
		}.bind( this );

		this.timer = setInterval( countDown, 1000);
	}

	Timer.prototype.reset = function()
	{
		//console.log('stopping Timer');
		this.timeLimit = limit;
		clearInterval( this.timer );
	}


	var timer = new Timer();


	var t = {
		start : function( diff )
		{
			limit = difficulties[ diff ].timeLimit
			timer.start();
			$timer.text( limit );
		},
		reset : function()
		{
			timer.reset();
		}
	}

	lucid.emitter( t );
	t.pipe(  timer );

	return t;
})