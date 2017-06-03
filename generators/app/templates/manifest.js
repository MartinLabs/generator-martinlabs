/*******************************************************************************
 * This file appends to the HTML the current version of js and css compiled by *
 * Webpack To do this, just add this meta tag with the name of js and css and  *
 * add this script at the end of body tag                                      *
 *******************************************************************************
 <html>
 <head>
 ...
 <meta name="manifest" content="[NAME_OF_JS_AND_CSS]">
 <meta name="webpack" content="[PATH_OF_DIST]">
 ...
 </head>
 <body>
 ...
 <script type="text/javascript" src="manifest.js"></script>
 </body>
 </html>
 ******************************************************************************/

if (document.body) document.body.style.visibility = "hidden";

var dist = readMeta('webpack');
var app = readMeta('manifest');

function readMeta(name) {
    var metas = document.getElementsByTagName('meta');
    for (var i = 0; i < metas.length; i++) {
        if (metas[i].getAttribute("name") == name) {
            return metas[i].getAttribute("content");
        }
    }
}

function loadJSON(callback) {
    var xobj = new XMLHttpRequest();
    xobj.overrideMimeType("application/json");
    xobj.open('GET', dist + '/manifest.json', true);
    xobj.onreadystatechange = function () {
        if (xobj.readyState == 4 && xobj.status == "200") {
            callback(xobj.responseText);
        }
    };
    xobj.send(null);
}

loadJSON(function (response) {
    var data = JSON.parse(response);

    var head = document.getElementsByTagName('head')[0];
    var link = document.createElement('link');
    link.setAttribute('rel', 'stylesheet');
    link.setAttribute('type', 'text/css');
    link.setAttribute('href', dist + '/' + data[app][1]);
    head.appendChild(link);

    var body = document.getElementsByTagName('body')[0];
    var script = document.createElement('script');
    script.setAttribute('src', dist + '/' + data[app][0]);
    body.appendChild(script);
    
    if (document.body) document.body.style.visibility = "visible";
});
