define( [ 'lib/lucid' ],
function( lucid )
{
	var preloader = {},
		images = {};

	lucid.emitter( preloader );


	var load = function( url, callback )
	{
		var img = new Image();

        img.onload = function()
        {
            images[ url ] = img ;
            this.onload = null;
            //preloader.trigger( 'loaded', img );
            callback && callback( img );
        }
        img.src = url;	
	}

	preloader.load = function( urls,callback )
	{

		if ( urls.splice )
		{
			_.each( urls, function(url)
				{
					load( url, callback );
				});
		}
		else
		{
			load( urls, callback );
		}


		
	}

	preloader.get = function( url )
	{
		return images[ url ];
	}


	return preloader;


})