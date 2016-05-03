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

    <% for (var i in urlConstants.listPages) { %>
        if (url.file === URL.listPages.<%= i %>) {
            require("./controller/list<%= i %>.js")();
        }
    <% } %>

    <% for (var i in urlConstants.persistPages) { %>
        if (url.file === URL.persistPages.<%= i %>) {
            require("./controller/persist<%= i %>.js")();
        }
    <% } %>
    
})();
