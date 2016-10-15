(function() {

    var $ = require("jquery"),
        martinlabs = require("ml-js-commons"),
        moment = require("moment"),
        tableExport = require("ml-js-commons/tableExport"),
        URL = require("../const/url"),
        defaultInterface = require("../service/defaultInterface"),
        translate = require("../service/translate"),
        <% if (props.loginsys) { %>simpleStorage = require("simpleStorage.js"),
        <% } %>
        Chart = require('chart.js');

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

    <% 
        var existDateCol = false;
        var existValueCol = false;
        for (var i in table.columns) { 
            var col = table.columns[i];

            if (col.javaType === "Date") {
                existDateCol = true;
            }

            if (col.extra !== "auto_increment" 
                && !col.referencedTable 
                && ["Double", "double", "Long", "long"].indexOf(col.javaType) > -1) {
                existValueCol = true;
            }
        }
    %>
        
        var initDataTable = function() {
            _dataTable = $('#list').DataTable({
                serverSide: true,
                language: translate.data.dataTable,
                columns: [
                    <% for (var i in table.columns) { var c = table.columns[i]; %><%= i > 0 ? "," : "" %>
                    { data: "<%= !c.referencedTable ? c.propertyName : c.notIdPropertyName %>", title: "<%= !c.referencedTable ? c.propertyName : c.notIdPropertyName %>" }<% } %>
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
                                data: prepareTableDataSet(resp.Data)
                            });

                            translate.datatable("#list", "<%= table.className %>");
                        <% if (existDateCol && existValueCol) { %>
                            renderCharts(resp.Data);<% } %>

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
        
        var prepareTableDataSet = function(list<%= table.className %>) {
            var dataSet = [];
            
            for (var i in list<%= table.className %>) {
                var <%= table.classLowerCamel %> = list<%= table.className %>[i];
                
                dataSet.push({
            <% 
        	for (var i in table.columns) { 
                var c = table.columns[i]; 
                %><%= i > 0 ? "," : "" %><%
                if (!c.referencedTable) {
                    if (c.javaType === "Date") {
                %>
                    <%= c.propertyName %>: <%= table.classLowerCamel %>.<%= c.propertyName %> != null ? moment(<%= table.classLowerCamel %>.<%= c.propertyName %>).format(translate.data.dateFormat.minute) : null<% 
                    } else {
                %>
                    <%= c.propertyName %>: <%= table.classLowerCamel %>.<%= c.propertyName %> != null ? <%= table.classLowerCamel %>.<%= c.propertyName %> : null<% 
                    }
                } else { %>
                    <%= c.notIdPropertyName %>: <%= table.classLowerCamel %>.<%= c.notIdPropertyName %> != null && <%= table.classLowerCamel %>.<%= c.notIdPropertyName %>.<%= c.referencedTable.idColumn.propertyName %> != null ? <%= table.classLowerCamel %>.<%= c.notIdPropertyName %>.<%= c.referencedTable.idColumn.propertyName %> : null<% 
                }
            }
            %>
                });
            }

            return dataSet;

        };
    <% if (existDateCol && existValueCol) { %>

        var renderCharts = function (list<%= table.className %>) {
            $("#charts .carousel-inner").html("");
            <% 
            var firstChart = true;
            for (var i in table.columns) { 
                var col = table.columns[i];

                if (col.javaType === "Date") {
                    for (var j in table.columns) { 
                        var colI = table.columns[j];

                        if (colI.extra !== "auto_increment" 
                            && !colI.referencedTable 
                            && ["Double", "double", "Long", "long"].indexOf(colI.javaType) > -1) {

                            %>
            renderAChart(list<%= table.className %>, "<%= colI.propertyName %>", "<%= col.propertyName %>"<%= firstChart ? ", true" : "" %>);<%
                            firstChart = false;
                        }
                    }
                }
            } 
            %>

            $('.carousel').carousel();

        };
        
        var renderAChart = function(list<%= table.className %>, colYName, colXName, active) {
            
            var newPage = $("<div class='item " + (active ? "active": "") + "'><h1>"
                    + translate.data.classes.<%= table.className %>.columns[colYName]
                    + " x "
                    + translate.data.classes.<%= table.className %>.columns[colXName]
                    + "</h1><canvas></canvas></div>");
            
            newPage.appendTo("#charts .carousel-inner");

            new Chart(newPage.find("canvas"), {
                type: 'line',
                data: {
                    datasets: [{
                        data: prepareChartDataset(list<%= table.className %>, colXName, colYName),
                        fill: false
                    }]
                },
                options: {
                    legend: {
                        display: false
                    },
                    scales: {
                        xAxes: [{
                            type: "time",
                            time: {
                                displayFormats: translate.data.dateFormat
                            }
                        }]
                    },
                    tooltips: {
                        callbacks: {
                            title: function(tooltip, data) {
                                return moment(tooltip[0].xLabel).format(translate.data.dateFormat.hour);
                            }
                        }
                    }
                }
            });
        };
        
        var prepareChartDataset = function(list<%= table.className %>, colXName, colYName) {
            var dataSet = [];
            
            for (var i in list<%= table.className %>) {
                var <%= table.classLowerCamel %> = list<%= table.className %>[i];
                
                dataSet.push({
                    x: <%= table.classLowerCamel %>[colXName],
                    y: <%= table.classLowerCamel %>[colYName]
                });
            }
            
            dataSet.sort(function (a, b) {
                if (a.x < b.x) {
                    return -1;
                } else if (a.x > b.x) {
                    return 1;
                } else {
                    return 0;
                }
            });
            
            return dataSet;
        };

    <% } %>      
        var registerInteraction = function() {
            $(document).on("click", "#list tbody tr", function(){
                location.href = "persist<%= table.className %>.html?id=" + _dataTable.row(this).data().<%= c.propertyName %>;
            });
            
            $("#export").click(function() {
                $(this).attr("download", "<%= table.className %>.csv");
                tableExport.csv(this, "list");
            });
        };
        
        init();
    };
    
})();