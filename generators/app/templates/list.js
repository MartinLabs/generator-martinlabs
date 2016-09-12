(function() {

    var $ = require("jquery"),
        martinlabs = require("ml-js-commons"),
        tableExport = require("ml-js-commons/tableExport"),
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
        
        var _dataTable;
        
        var init = function() {
            defaultInterface({ active: "<%= table.className %>" });
            translate();
            initDataTable();
            registerInteraction();
        };
        
        var initDataTable = function() {
            _dataTable = $('#list').DataTable({
                serverSide: true,
                language: translate.data.dataTable,
                columns: [
                    <% for (var i in table.columns) { var c = table.columns[i]; %><%= i > 0 ? "," : "" %>
                    { title: "<%= !c.referencedTable ? c.propertyName : c.notIdPropertyName %>" }<% } %>
                ],
                ajax: function(data, callback, settings) { 

                    $.get(URL.LIST_<%= table.classUpper %>, {<% if (props.loginsys) { %>
                        token: simpleStorage.get("token<%= props.modulenameUpper %>") || null,<% } %>
                        search: data.search.value,
                        start: data.start,
                        length: data.length,
                        orderColumn: data.order[0].column,
                        orderDir: data.order[0].dir
                    },
                    function(resp){
                        if (resp.Success) {
                            callback({
                                recordsTotal: resp.QuantidadeTotal,
                                recordsFiltered: resp.QuantidadeFiltrada,
                                data: prepareDataSet(resp.Data)
                            });

                            translate.datatable("#list", "<%= table.className %>");
                            <% if (props.loginsys) { %>
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

                }
            });


            
        };
        
        var prepareDataSet = function(list<%= table.className %>) {
            var dataSet = [];
            
            for (var i in list<%= table.className %>) {
                var <%= table.classLowerCamel %> = list<%= table.className %>[i];
                
                var dSet = [
            <% 
            var columnPrimaryKey = 0; 
        	for (var i in table.columns) { 
                var c = table.columns[i]; 
                if (c.column_key === "PRI") {
                    columnPrimaryKey = i;
                }
                %><%= i > 0 ? "," : "" %><%
                if (!c.referencedTable) { 
                %>
                    <%= table.classLowerCamel %>.<%= c.propertyName %> != null ? <%= table.classLowerCamel %>.<%= c.propertyName %> : null<% 
                } else { %>
                    <%= table.classLowerCamel %>.<%= c.notIdPropertyName %> != null && <%= table.classLowerCamel %>.<%= c.notIdPropertyName %>.<%= c.referencedTable.idColumn.propertyName %> != null ? <%= table.classLowerCamel %>.<%= c.notIdPropertyName %>.<%= c.referencedTable.idColumn.propertyName %> : null<% 
                }
            }
            %>
                ];
                
                dataSet.push(dSet);
            }

            return dataSet;

        };
        
        var registerInteraction = function() {
            $(document).on("click", "#list tbody tr", function(){
                location.href = "persist<%= table.className %>.html?id=" + _dataTable.row(this).data()[<%= columnPrimaryKey %>];
            });
            
            $("#export").click(function() {
                $(this).attr("download", "<%= table.className %>.csv");
                tableExport.csv(this, "list");
            });
        };
        
        init();
    };
    
})();