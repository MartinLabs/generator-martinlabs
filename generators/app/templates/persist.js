(function() {

    var $ = require("jquery"),
        moment = require("moment"),
        martinlabs = require("ml-js-commons"),
        URL = require("../const/url"),
        <% if (props.loginsys) { %>login = require("../service/login"),
        <% } %>defaultInterface = require("../service/defaultInterface"),
        translate = require("../service/translate");

    window.jQuery = $;
    require("bootstrap-sass");
    require("bootstrap-validator");
    require("ml-js-commons/datetimepicker");
    require("moment/locale/pt-br");
    require("bootstrap-notify");
    
    module.exports = function() {
        
        var _obj = {};
        
        var init = function() {
            <% if (props.loginsys) { %>login.inHome();
            <% } %>defaultInterface({ active: "<%= table.className %>" });
            translate();
            requestContent();
            registerInteraction();
        };
        
        var requestContent = function() {
            var id = martinlabs.getParam("id");
            
            if (!id) {
                return;
            }
            
            $.get(URL.GET_<%= table.classUpper %>, {
                id: id
            },
            function(resp){
                if (resp.Success) {
                    _obj = resp.Data;
                    render();
                } else {
                    $.notify({ message: resp.Message },{
                        type: "danger",
                        placement: { align: "center" },
                        delay: 2000
                    });
                }

            });
        };
        
        var persist = function() {
            extractFromFields();
            
            martinlabs.bodyRequest(URL.PERSIST_<%= table.classUpper %>, _obj,
            function(resp){
                if (resp.Success) {
                    if (!_obj.<%= table.idColumn.propertyName %>) {
                        _obj.<%= table.idColumn.propertyName %> = resp.Data;
                    }

                    $.notify({ message: "Persisted Successfully" },{
                        type: "success",
                        placement: { align: "center" },
                        delay: 2000
                    });
                } else {
                    $.notify({ message: resp.Message },{
                        type: "danger",
                        placement: { align: "center" },
                        delay: 2000
                    });
                }

            });
        };
        
        var extractFromFields = function() {
            var aux;
            
            <% for (var i in table.columns) { 
                var c = table.columns[i]; 
                if (c.extra !== "auto_increment") {
                	if (c.javaType === "String") { 
    		%>
                		_obj.<%= c.propertyName %> = $("#input-<%= c.propertyName %>").val();
                	<% } else if (["Long", "long"].indexOf(c.javaType) > -1) { %>
                		_obj.<%= c.propertyName %> = parseInt($("#input-<%= c.propertyName %>").val());
            		<% } else if (["Double", "double"].indexOf(c.javaType) > -1) { %>
            			_obj.<%= c.propertyName %> = parseFloat($("#input-<%= c.propertyName %>").val());
        			<% } else if (c.javaType === "Date") { %>
        				aux = $("#input-<%= c.propertyName %>").data("DateTimePicker").date();
            			_obj.<%= c.propertyName %> = aux === null ? null : aux.format("YYYY-MM-DDTHH:mm:ss");
        			<% } else { %>
        				_obj.<%= c.propertyName %> = $("#input-<%= c.propertyName %>").is(':checked');
    		<% 
    				}
    			}
    		} 
    		%>
        };
        
        var render = function() {
        	<% for (var i in table.columns) { 
                var c = table.columns[i]; 
                if (c.extra !== "auto_increment") {
        			if (c.javaType === "Date") {
			%>
						$("#input-<%= c.propertyName %>").data("DateTimePicker").date(moment(_obj.<%= c.propertyName %>, "YYYY-MM-DDTHH:mm:ss"));
        			<% } else if (["Boolean", "boolean"].indexOf(c.javaType) > -1) { %>
        				$("#input-<%= c.propertyName %>").prop('checked', _obj.<%= c.propertyName %>);
    				<% } else { %>
    					$("#input-<%= c.propertyName %>").val(_obj.<%= c.propertyName %>);
    		<% 
    				}
    			}
    		} 
    		%>
            
            translate();
        };
        
        var registerInteraction = function() {
            $("form").validator().on("submit", function(e){
                if (!e.isDefaultPrevented()) {
                    persist();
                }
                
                return false;
            });
            
            $(".datetime").datetimepicker({
                locale: "pt-br"
            });
        };
        
        init();
    };
    
})();