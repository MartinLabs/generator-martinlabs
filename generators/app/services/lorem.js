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

var firstNames = [
	"Gil",
	"Ricardo",
	"Tiago",
	"Felipe",
	"Bruno",
	"Dr.",
	"Sr.",
	"Mr.",
	"Sra.",
	"Bobby",
	"Dunha",
	"Johnny",
	"Jack",
	"Jessica",
	"Fiona",
	"Claire",
	"Amy",
	"Dora",
	"Monica",
	"Rachel"
];

var lastNames = [
	"Bueno",
	"Prado",
	"Kobayashi",
	"Campos",
	"Gibran",
	"Gonçalves",
	"Lopes",
	"Meira",
	"Akio",
	"Cunha",
	"Fishermann",
	"Bravo",
	"Sherman",
	"Jones",
	"Underwood",
	"Winehouse",
	"Marquez",
	"Smith",
	"Anderson",
	"Monteiro"
];

var placeType = [
	"Rua",
	"Street",
	"Av",
	"Ave"
];

var ufs = [
	"AC",
	"AL",
	"AP",
	"AM",
	"BA",
	"CE",
	"DF",
	"ES",
	"GO",
	"MA",
	"MT",
	"MS",
	"MG",
	"PR",
	"PB",
	"PA",
	"PE",
	"PI",
	"RJ",
	"RN",
	"RS",
	"RO",
	"RR",
	"SC",
	"SE",
	"SP",
	"TO"
];

var lorem = function(maxsize, startWithLorem) {
	if (maxsize === 1) {
		return words[Math.floor(Math.random() * words.length)];
	}

	var pretext = "";
	var text = "";
	while (pretext.length < maxsize) {
		var iW;

		if (!text.length && startWithLorem) {
			iW = 0;
		} else {
			var iW = Math.floor(Math.random() * words.length);
		}
		
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

lorem.unique = function(index) {
	return words[index];
};

lorem.fullname = function() {
	return firstNames[Math.floor(Math.random() * firstNames.length)] + " " + lastNames[Math.floor(Math.random() * lastNames.length)];
};

lorem.title = function() {
	return words[Math.floor(Math.random() * words.length)] + " " + words[Math.floor(Math.random() * words.length)];
};

lorem.street = function() {
	return placeType[Math.floor(Math.random() * placeType.length)] + " " + words[Math.floor(Math.random() * words.length)] + " " + words[Math.floor(Math.random() * words.length)];
};

lorem.zipcode = function() {
	return "" + randomInt() + randomInt() + randomInt() + randomInt() + randomInt();
};

lorem.cep = function() {
	return "" + randomInt() + randomInt() + randomInt() + randomInt() + randomInt() + "-" + randomInt() + randomInt() + randomInt();
};

lorem.uf = function() {
	return ufs[Math.floor(Math.random() * ufs.length)];
};

lorem.latitude = function() {
	return (Math.random() * 180) -90;
};

lorem.longitude = function() {
	return (Math.random() * 360) -180;
};

var randomInt = function() {
    return Math.round(Math.random()*9);
};

var mod = function(dividendo,divisor) {
    return Math.round(dividendo - (Math.floor(dividendo/divisor)*divisor));
};

lorem.cpf = function() {
    var n1 = randomInt();
    var n2 = randomInt();
    var n3 = randomInt();
    var n4 = randomInt();
    var n5 = randomInt();
    var n6 = randomInt();
    var n7 = randomInt();
    var n8 = randomInt();
    var n9 = randomInt();
    var d1 = n9 * 2 + n8 * 3 + n7 * 4 + n6 * 5 + n5 * 6 + n4 * 7 + n3 * 8 + n2 * 9 + n1 * 10;
    d1 = 11 - (mod(d1,11));

    if (d1>=10) {
        d1 = 0;
    }

    var d2 = d1 * 2 + n9 * 3 + n8 * 4 + n7 * 5 + n6 * 6 + n5 * 7 + n4 * 8 + n3 * 9 + n2 * 10 + n1 * 11;
    d2 = 11 - (mod(d2,11));

    if (d2>=10) {
        d2 = 0;
    }

    return '' + n1 + n2 + n3 + '.' + n4 + n5 + n6 + '.' + n7 + n8 + n9 + '-' + d1 + d2;
};

lorem.cnpj = function() {
    var n1  = randomInt();
    var n2  = randomInt();
    var n3  = randomInt();
    var n4  = randomInt();
    var n5  = randomInt();
    var n6  = randomInt();
    var n7  = randomInt();
    var n8  = randomInt();
    var n9  = 0;
    var n10 = 0;
    var n11 = 0;
    var n12 = 1;
    var d1 = n12 * 2 + n11 * 3 + n10 * 4 + n9 * 5 + n8 * 6 + n7 * 7 + n6 * 8 + n5 * 9 + n4 * 2 + n3 * 3 + n2 * 4 + n1 * 5;
    d1 = 11 - (mod(d1,11));

    if (d1>=10) {
        d1 = 0;
    }

    var d2 = d1 * 2 + n12 * 3 + n11 * 4 + n10 * 5 + n9 * 6 + n8 * 7 + n7 * 8 + n6 * 9 + n5 * 2 + n4 * 3 + n3 * 4 + n2 * 5 + n1 * 6;
    d2 = 11 - (mod(d2,11));
    if (d2>=10) { 
        d2 = 0;
    }

    return '' + n1 + n2 + '.' + n3 + n4 + n5 + '.' + n6 + n7 + n8 + '/' + n9 + n10 + n11 + n12 + '-' + d1 + d2;
};

lorem.rg = function() {
    var n1 = randomInt();
    var n2 = randomInt();
    var n3 = randomInt();
    var n4 = randomInt();
    var n5 = randomInt();
    var n6 = randomInt();
    var n7 = randomInt();
    var n8 = randomInt();
    var n9 = randomInt();

    return n1 + n2 + "." + n3 + n4 + n5 + "." + n6 + n7 + n8 + "-" + n9;
};

lorem.phone = function() {
	return "(" + randomInt() + randomInt() + ") " + randomInt() + randomInt() + randomInt() + randomInt() + randomInt() + "-" + randomInt() + randomInt() + randomInt() + randomInt();
};

module.exports = lorem;