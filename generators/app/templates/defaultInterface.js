(function(){
    
    var $ = require("jquery"),
        defaultTpl = require("../../tmpl/default.html"),<% 
    if (loginsys) { 
        %>
        simpleStorage = require("simpleStorage.js"),
        URL = require("../const/url"),<% 
    } 
    %>
        URL = require("../const/url");

    module.exports = function(opt){
        opt.URL = URL;
        opt.mayLogout = <%= loginsys %>;

        var self = $("#main");

        var init = function() {
            self.before(defaultTpl(opt));
            self.appendTo("#defaultInner");

            $("body").show();
        <% if (loginsys) { %>
            $("#logout").click(function(){
                simpleStorage.deleteKey("token<%= modulenameUpper %>");
                location.href = URL.login;
            });
        <% } %>
        };

        init();
    };

})();