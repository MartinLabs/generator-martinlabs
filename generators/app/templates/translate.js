(function(){
    
    var $ = require("jquery");
    require("jquery-localize");
    
    module.exports = function() {
        
        var init = function() {
            $("[data-localize]").localize("strings", {
                language: "en",
                pathPrefix: "json"
            });
        };
        
        init();
    };

    module.exports.datatable = function(selector, className) {
        $(selector).find("th").each(function(){
            $(this).data("localize", "classes." + className + ".columns." + $(this).html());
        });

        $(selector).localize("strings", {
            language: "en",
            pathPrefix: "json"
        });
    };
    
})();