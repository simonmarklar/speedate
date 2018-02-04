define(
function()
{
	var cardTemplate = _.template('<li id="<%= name %>" class="card"><%= name %></li>'),

	dragFunc = function( ev, dd )
		{
			$( this ).css({
				top: dd.offsetY,
				left: dd.offsetX,
				position:'absolute'
			});

			cardBeingDragged = $(dd.drag);
		},
	
	dragOpts = { relative:true };



	var Card = function( config )
	{
		this.categories = config.categories;
		this.name = config.name;
	}

	Card.prototype.render = function()
	{
		return 
	}

	return Card;
})