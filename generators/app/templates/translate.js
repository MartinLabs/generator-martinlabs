(function(){
    
    var $ = require("jquery");

    window.jQuery = $;
    require("jquery-localize");
    
    var translate = function() {
        
        var init = function() {
            $("[data-localize]").localize("strings", {
                language: "en",
                pathPrefix: "json",
                callback: function(data, defaultCallback) {
                    translate.data = data;
                    defaultCallback(data);
                }
            });
        };
        
        init();
    };

    translate.datatable = function(selector, className) {
        $(selector).find("th").each(function(){
            $(this).data("localize", "classes." + className + ".columns." + $(this).html());
            $(this).localize("strings", {
                language: "en",
                pathPrefix: "json"
            });
        });
    };

    module.exports = translate;
    
})();