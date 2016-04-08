(function(){

	var $ = require("jquery");
	    martinlabs = require("ml-js-commons"),
	    URL = require("../const/url");


    window.jQuery = $;
    require("bootstrap-sass");
    require("bootstrap-notify");
	    
	var login = function(){
	    if (arguments.length >= 2) {
	        var account = arguments[0];
	        var password = arguments[1];
	        var onError = arguments[2];

	        var passwordSha1 = martinlabs.sha1.hash(password);

	        var success = function(resp){

	            if (resp && resp.Success) {

	                martinlabs.cookie.set("login<%= modulenameUpper %>", JSON.stringify({
	                    Account: account,
	                    Password: passwordSha1
	                }));

	                location.href = URL.home;

	            } else {
	                onError && onError(resp);
	            }

	        };

	        martinlabs.bodyRequest(URL.LOGIN, {
                Account: account,
                Password: passwordSha1
            }, success);

	    } else if (arguments.length === 1){
	        var callback = arguments[0];

	        var params = martinlabs.cookie.get("login<%= modulenameUpper %>");
	        if (params) {
                    params = JSON.parse(params);

	            var success = function(resp){

	                if (resp && resp.Success) {
	                    callback(true);
	                } else {
	                    martinlabs.cookie.del("login<%= modulenameUpper %>");
	                    callback(false);
	                }
	            };

	            martinlabs.bodyRequest(URL.LOGIN, params, success);

	        } else {
	            callback(false);
	        }
	    }
	};

	login.outHome = function(){

	    login(function(success){
	        if (success) {
	            location.href = URL.home;
	        }
	    });

	};

	login.inHome = function(){

	    login(function(success){
	        if (!success) {
	            location.href = URL.login;
	        }
	    });

	};

	login.logout = function(){
	    martinlabs.cookie.del("login<%= modulenameUpper %>");
	};

	login.get = function() {
	    var params = martinlabs.cookie.get("login<%= modulenameUpper %>");
	    if (params) {
	        return JSON.parse(params);
	    } else {
	        return null;
	    }
	};

	module.exports = login;

})();