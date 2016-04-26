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
	    	martinlabs.bodyRequest(URL.LOGIN, {
                Account: account,
                Password: martinlabs.sha1.hash(password)
            }, function(resp) {

            	if (resp.Success) {
            		simpleStorage.set("token<%= modulenameUpper %>", resp.Data);
            		location.href = URL.home;
            	} else {
	            	$.notify({ message: resp.Message },{
		                type: "danger",
		                placement: { align: "center" },
		                delay: 2000
		            });
	            }
            });
	    };
	    
	    $("#form-login").submit(function(){
	        login($("#input-account").val(), $("#input-password").val());
	        return false;
	    });
	    
	    init();
	    
	};

})();