(function(){
    
    var $ = require("jquery");

    window.jQuery = $;
    require("jquery-localize");

    var _language = "en";
    
    var translate = function() {
        
        var init = function() {
            $("[data-localize]").localize("strings", {
                language: _language,
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
                language: _language,
                pathPrefix: "json"
            });
        });
    };

    module.exports = translate;
    
})();