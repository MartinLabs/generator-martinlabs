(function(){

	var $ = require("jquery"),
	    login = require("../service/login"),
	    translate = require("../service/translate");

    window.jQuery = $;
    require("bootstrap-sass");
    require("bootstrap-notify");


	module.exports = function() {
	    
	    var init = function(){
	        login.outHome();
	        translate();
	    };
	    
	    var loginError = function(resp){
	        $.notify({ message: resp.Message },{
                type: "danger",
                placement: { align: "center" },
                delay: 2000
            });
	    };
	    
	    $("#form-login").submit(function(){
	        login($("#input-account").val(), $("#input-password").val(), loginError);
	        return false;
	    });
	    
	    init();
	    
	};

})();