(function(){
    
    var $ = require("jquery"),
        defaultTpl = require("../../tmpl/default.html"),
        <% if (loginsys) { %>
            URL = require("../const/url"),
            login = require("../service/login"),
        <% } %>
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
                    login.logout();
                    location.href = URL.login;
                });
            <% } %>
        };

        init();
    };

})();