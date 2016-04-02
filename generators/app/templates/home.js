(function() {

    var <% if (loginsys) { %>login = require("../service/login"),
        <% } %>defaultInterface = require("../service/defaultInterface"),
	    translate = require("../service/translate");
    
    module.exports = function() {
        
        var init = function() {
            <% if (loginsys) { %>login.inHome();
            <% } %>defaultInterface({ active: "home" });
            translate();
        };
        
        init();
    };
    
})();