(function() {

    var defaultInterface = require("../service/defaultInterface"),
	    translate = require("../service/translate");
    
    module.exports = function() {
        
        var init = function() {
            defaultInterface({ active: "home" });
            translate();
        };
        
        init();
    };
    
})();