define( ["./ManagerBase", "./prototypes/Texture" ], 
function( BASE, Texture )
{

    var mgr = BASE.create( "ImageManager" ),
        EVENTS = mgr.EVENTS,
        m_complete = [],
        m_loading = [];


    mgr.clearAll = function()
    {
        m_complete= [];
        m_loading = [];
    }


    mgr.checkAllLoaded = function()
    {
        if ( m_loading.length === 0 )
        {
            m_complete = _.sortBy( m_complete, 'src' );
            this.fireEvent( EVENTS.Ready );
        }
    }


    mgr.get = function( url )
    {
        return  _.find( m_complete, function( el )
        {
            return ( !!~el.m_source.src.indexOf( url ) );
        });
    }



    mgr.load = function( url, callback )
    {
        if ( typeof url !== 'string' ) return url;

        var me = this,
            img = me.get( url );
        
        if ( !img )
        {
            img = new Image();
            m_loading[ m_loading.length ] = img;

            img.onload = function()
            {
                m_complete[ m_complete.length ] = new Texture( this );
                m_loading.splice( _.indexOf( m_loading, this, true ), 1 );

                callback && callback( m_complete[ m_complete.length - 1 ] );

                me.checkAllLoaded();
                this.onload = null;



            }
            img.src = url;
        }

        return img.src;

    }

    return mgr;
});
