(function() {

    var <% if (loginsys) { %>login = require("../service/login"),
        <% } %>defaultInterface = require("../service/defaultInterface");
    
    module.exports = function() {
        
        var init = function() {
            <% if (loginsys) { %>login.inHome();
            <% } %>defaultInterface({ active: "home" });
        };
        
        init();
    };
    
})();