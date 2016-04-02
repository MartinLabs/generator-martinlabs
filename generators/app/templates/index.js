(function(){
    var martinlabs = require("ml-js-commons"),
        URL = require("./const/url");
    
    var url = martinlabs.url(location.href);

<% if (loginsys) { %>
    if (!url.file.length || url.file === URL.login) {
        require("./controller/index")();
    }
<% } %>
    if (url.file === URL.home) {
        require("./controller/home")();
    }
    
    <% for (var i in tables) { var t = tables[i]; %>
	if (url.file === URL.listPages.<%= t.className %>) {
	    require("./controller/list<%= t.className %>.js")();
	}

	if (url.file === URL.persistPages.<%= t.className %>) {
	    require("./controller/persist<%= t.className %>.js")();
	}
    <% } %>
    
})();
