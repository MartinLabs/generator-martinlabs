var words = ['lorem', 'ipsum', 'dolor', 'sit', 'amet', 'consectetur',
'adipiscing', 'elit', 'curabitur', 'vel', 'hendrerit', 'libero',
'eleifend', 'blandit', 'nunc', 'ornare', 'odio', 'ut',
'orci', 'gravida', 'imperdiet', 'nullam', 'purus', 'lacinia',
'a', 'pretium', 'quis', 'congue', 'praesent', 'sagittis', 
'laoreet', 'auctor', 'mauris', 'non', 'velit', 'eros',
'dictum', 'proin', 'accumsan', 'sapien', 'nec', 'massa',
'volutpat', 'venenatis', 'sed', 'eu', 'molestie', 'lacus',
'quisque', 'porttitor', 'ligula', 'dui', 'mollis', 'tempus',
'at', 'magna', 'vestibulum', 'turpis', 'ac', 'diam',
'tincidunt', 'id', 'condimentum', 'enim', 'sodales', 'in',
'hac', 'habitasse', 'platea', 'dictumst', 'aenean', 'neque',
'fusce', 'augue', 'leo', 'eget', 'semper', 'mattis', 
'tortor', 'scelerisque', 'nulla', 'interdum', 'tellus', 'malesuada',
'rhoncus', 'porta', 'sem', 'aliquet', 'et', 'nam',
'suspendisse', 'potenti', 'vivamus', 'luctus', 'fringilla', 'erat',
'donec', 'justo', 'vehicula', 'ultricies', 'varius', 'ante',
'primis', 'faucibus', 'ultrices', 'posuere', 'cubilia', 'curae',
'etiam', 'cursus', 'aliquam', 'quam', 'dapibus', 'nisl',
'feugiat', 'egestas', 'class', 'aptent', 'taciti', 'sociosqu',
'ad', 'litora', 'torquent', 'per', 'conubia', 'nostra',
'inceptos', 'himenaeos', 'phasellus', 'nibh', 'pulvinar', 'vitae',
'urna', 'iaculis', 'lobortis', 'nisi', 'viverra', 'arcu',
'morbi', 'pellentesque', 'metus', 'commodo', 'ut', 'facilisis',
'felis', 'tristique', 'ullamcorper', 'placerat', 'aenean', 'convallis',
'sollicitudin', 'integer', 'rutrum', 'duis', 'est', 'etiam',
'bibendum', 'donec', 'pharetra', 'vulputate', 'maecenas', 'mi',
'fermentum', 'consequat', 'suscipit', 'aliquam', 'habitant', 'senectus',
'netus', 'fames', 'quisque', 'euismod', 'curabitur', 'lectus',
'elementum', 'tempor', 'risus', 'cras'];

var separators = [" ", ", ", ". "];

var urls = [
	"http://www.martinlabs.com.br",
	"https://github.com/MartinLabs",
	"https://www.facebook.com/martinlabsdev",
	"https://github.com/melanke",
	"http://melanke.deviantart.com",
	"https://twitter.com/melanke",
	"http://ulige.com.br",
	"http://www.naosalvo.com.br/",
	"https://www.reddit.com/r/gifs",
	"https://www.youtube.com/cozinhaulige",
	"https://www.youtube.com/cidcidoso",
	"https://en.wikipedia.org/wiki/Programming_paradigm",
	"https://en.wikipedia.org/wiki/Mobile_application_development",
	"https://en.wikipedia.org/wiki/Mussum",
	"http://www.uol.com.br/",
	"http://g1.globo.com/"
];

var lorem = function(maxsize) {
	if (maxsize === 1) {
		return words[Math.floor(Math.random() * words.length)];
	}

	var pretext = "";
	var text = "";
	while (pretext.length < maxsize) {
		var iW = Math.floor(Math.random() * words.length);
		var rS = Math.floor(Math.random() * 15);
		var iS = rS < 8 ? 0 : rS < 12 ? 1 : 2;
		pretext = text + words[iW] + separators[iS];
		if (pretext.length < maxsize) {
			text = pretext;
		}
	}

	return text;
};

lorem.url = function() {
	return urls[Math.floor(Math.random() * urls.length)];
};

module.exports = lorem;