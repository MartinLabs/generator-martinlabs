(function() {

    var $ = require("jquery"),
        martinlabs = require("ml-js-commons"),
        URL = require("../const/url"),
        <% if (props.loginsys) { %>login = require("../service/login"),
        <% } %>defaultInterface = require("../service/defaultInterface");

    window.jQuery = $;
    require("bootstrap-sass");
    require("datatables");
    require("datatables-bootstrap");
    require("bootstrap-notify");
    
    module.exports = function() {
        
        var _list = [],
            _dataTable;
        
        var init = function() {
            <% if (props.loginsys) { %>login.inHome();
            <% } %>defaultInterface({ active: "<%= table.className %>" });
            request();
        };
        
        var request = function() {
            martinlabs.bodyRequest(URL.LIST_<%= table.classUpper %>, {},
            function(resp){
                if (resp.Success) {
                    _list = resp.Data;
                    render(_list);
                } else {
                    $.notify({ message: resp.Message },{
                        type: "danger",
                        placement: { align: "center" },
                        delay: 2000
                    });
                }

            });
        };
        
        var render = function() {
            var dataSet = [];
            
            for (var i in _list) {
                var obj = _list[i];
                
                var dSet = [
                    <% 
                    var columnPrimaryKey = 0; 
                	for (var i in table.columns) { 
                        var c = table.columns[i]; 
                        if (c.column_key === "PRI") {
                            columnPrimaryKey = i;
                        }
                        %><%= i > 0 ? "," : "" %>
                    obj.<%= c.propertyName %> != null ? obj.<%= c.propertyName %> : ""<% } %>
                ];
                
                dataSet.push(dSet);
            }
            
            _dataTable = $('#list').DataTable({
                data: dataSet,
                "columns": [
                	<% for (var i in table.columns) { var c = table.columns[i]; %><%= i > 0 ? "," : "" %>
                    { title: "<%= c.propertyName %>" }<% } %>
                ]
            });

            registerInteraction();
        };
        
        var registerInteraction = function() {
            $('#list').on("click", "tr", function(){
                location.href = "persist<%= table.className %>.html?id=" + _dataTable.row(this).data()[<%= columnPrimaryKey %>];
            });
        };
        
        init();
    };
    
})();