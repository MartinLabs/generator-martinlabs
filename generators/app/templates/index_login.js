(function(){

    var $ = require("jquery"),
        URL = require("../const/url"),
        translate = require("../service/translate"),
        martinlabs = require("ml-js-commons"),
        simpleStorage = require("simpleStorage.js");

    window.jQuery = $;
    require("bootstrap-sass");
    require("bootstrap-notify");


    module.exports = function() {
        
        var init = function(){
            translate();
        };

        var login = function(account, password) {
            post(URL.LOGIN, {
                account: account,
                password: martinlabs.sha1.hash(password)
            }, function(resp) {

                if (resp.success) {
                    simpleStorage.set("token<%= modulenameUpper %>", resp.data);
                    location.href = URL.home;
                } else {
                    $.notify({ message: resp.message },{
                        type: "danger",
                        placement: { align: "center" },
                        delay: 2000
                    });
                }
            });
        };

        var post = function(url, data, success) {
            $.ajax({
                type: "POST",
                url: url,
                processData: false,
                contentType: 'application/json',
                data: JSON.stringify(data),
                success: success
            });
        };
        
        $("#form-login").submit(function(){
            login($("#input-account").val(), $("#input-password").val());
            return false;
        });
        
        init();
        
    };

})();