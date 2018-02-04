define(
function()
{
	var  sayings = {

		like : [
			"I'm totally into {0}",
			"I really like {0}",
			"I dig {0}"		
		],

		love : [
			"I loooove {0}, dont you?",
			"I am so in love with {0}",
			"I'm crazy about {0}"
		],

		dislike : [
			"I don't care much about {0}",
			"Really, you like {0} ? oooo-kay",
			"I'm not that into {0}",
			"{0}. No. Just No."
		],

		hate :[
			"I so hate {0}. I dont know why",
			"I can't stand {0}",
			"Nothing upsets me more than {0}"
		],

		chitchat : [
			"So I was watching Oprah the other day, and she said that blah blah blah blah...",
			"My girlfriends say I'm too needy, you don't think i'm needy, do you. DO YOU?! ANSWER ME!",
			"I hope you put the toilet seat down. My Ex used to blah blah blah blah blah...",
			"Are you listening to me?",
			"My cat is malting everywhere. All these tiny little hairs all over my floor, I'm so blah blah blah blah... And there was this one time, at band camp..."
		]
	}

	/*var mappings = {
		//key				  like | love | dislike | hate
		'cute things' 		: [ 'sooooo cute', 'zOMG amazeballs!', "i'm not a kid", 'disgusting' ],
		'scary stuff' 		: [ '']	
		'most movies' 		:	
		'music in general'	:
		'nerdy stuff'		:	
		'sports'			:	
		'macho blokes'		:	
		'sensitive guys'	:	
		'sophisticated guys':	
		'immature people'	:
		'wealthy men'		:
		'funny things'		:
	}
*/

	var sentenceBuilder = function( word )
	{
		var isPlural = word.substring(c.length-1) === 's';
	}

	/*return {
		sentenceBuilder : sentenceBuilder
	}*/

	return sayings;
});