(function() {

    var $ = require("jquery"),
        martinlabs = require("ml-js-commons"),
        URL = require("../const/url"),
        defaultInterface = require("../service/defaultInterface"),
        <% if (props.loginsys) { %>simpleStorage = require("simpleStorage.js"),
        <% } %>translate = require("../service/translate");

    window.jQuery = $;
    require("bootstrap-sass");
    require("datatables");
    require("datatables-bootstrap");
    require("bootstrap-notify");
    
    module.exports = function() {
        
        var _list = [],
            _dataTable;
        
        var init = function() {
            defaultInterface({ active: "<%= table.className %>" });
            translate();
            request();
        };
        
        var request = function() {
            $.get(URL.LIST_<%= table.classUpper %>, {<% if (props.loginsys) { %>
                token: simpleStorage.get("token<%= props.modulenameUpper %>") || null<% } %>
            },
            function(resp){
                if (resp.Success) {
                    _list = resp.Data;
                    render(_list);<% if (props.loginsys) { %>
                } else if (resp.Code === 33) {
                    location.href = URL.login;<% } %>
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

            translate.datatable("#list", "<%= table.className %>");

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