(function() {

    var $ = require("jquery"),
        moment = require("moment"),
        martinlabs = require("ml-js-commons"),
        URL = require("../const/url"),
        <% if (props.loginsys) { %>simpleStorage = require("simpleStorage.js"),
        <% } %>defaultInterface = require("../service/defaultInterface"),
        translate = require("../service/translate");

    window.jQuery = $;
    require("bootstrap-sass");
    require("bootstrap-validator");
    require("ml-js-commons/datetimepicker");
    require("moment/locale/pt-br");
    require("bootstrap-notify");
    
    module.exports = function() {
        
        var _<%= table.classLowerCamel %> = {};
        
        var init = function() {
            defaultInterface({ active: "<%= table.className %>" });
            translate();
            registerInteraction();<% 

    for (var i in table.columns) { 
        var c = table.columns[i]; 
        if (c.referencedTable) { %>
            populate<%= c.propertyNameUpper %>();<%
        }
    }

    if (!table.NtoNcolumns) { %>
            requestContent();<% 
    } else { 

        for (var i in table.NtoNcolumns) { var col = table.NtoNcolumns[i]; %>
            populateAll<%= col.NtoNtable.className %>Checkbox();<% 
        } %>
            requestContent(function() {<% 
            for (var i in table.NtoNcolumns) { var col = table.NtoNcolumns[i]; %>
                populateThis<%= col.NtoNtable.className %>();<% 
            } %>
            });
    <% } %>
        };
        
        var requestContent = function(cb) {
            var id = martinlabs.getParam("id");
            
            if (!id) {
                return;
            }
            
            $.get(URL.GET_<%= table.classUpper %>, {
                id: id<% if (props.loginsys) { %>, 
                token: simpleStorage.get("token<%= props.modulenameUpper %>") || null<% } %>
            },
            function(resp){
                if (resp.Success) {
                    _<%= table.classLowerCamel %> = resp.Data;
                    render();
                    cb && cb();<% if (props.loginsys) { %>
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

<% for (var i in table.columns) { 
    var c = table.columns[i]; 
    if (c.referencedTable) {

%>
        var populate<%= c.propertyNameUpper %> = function() {
            $.get(URL.LIST_<%= c.referencedTable.classUpper %>, {<% if (props.loginsys) { %> 
                token: simpleStorage.get("token<%= props.modulenameUpper %>") || null<% } %>
            }, function(resp){
                if (resp.Success) {
                    var selectV = $("#input-<%= c.propertyName %>");
                    for (var i in resp.Data) {
                        var item = resp.Data[i];
                        selectV.append("<option value='"+item.<%= c.referencedTable.idColumn.propertyName %>+"'>"<% 

                        for (var j in c.referencedTable.columns) { var r = c.referencedTable.columns[j]; %>
                            + (item.<%= r.propertyName %> === undefined ? "" : item.<%= r.propertyName %> + "; ")<% 
                        } %>
                            +"</option>");
                    }
                    
                    if (_<%= table.classLowerCamel %> && _<%= table.classLowerCamel %>.<%= c.propertyName %>) {
                        selectV.val(_<%= table.classLowerCamel %>.<%= c.propertyName %>);
                    }
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
        };
<% 
    }
} 
%>

    <% for (var i in table.NtoNcolumns) { var col = table.NtoNcolumns[i]; %>
        var populateAll<%= col.NtoNtable.className %>Checkbox = function() {
            $.get(URL.LIST_<%= col.otherTable.classUpper %>, { 
                token: simpleStorage.get("token<%= props.modulenameUpper %>") || null
            }, function(resp){
                if (resp.Success) {
                    var groupV = $("#input-<%= col.NtoNtable.classLowerCamel %>");
                    for (var i in resp.Data) {
                        var item = resp.Data[i];
                        groupV.append("<div class='checkbox'><label><input type='checkbox' data-id='"+item.<%= col.otherTable.idColumn.propertyName %>+"'>"<% 

                            for (var j in col.otherTable.columns) { var r = col.otherTable.columns[j]; %>
                                + (item.<%= r.propertyName %> === undefined ? "" : item.<%= r.propertyName %> + "; ")<% 
                            } %>+"</label></div>");
                    }
                    
                    render<%= col.NtoNtable.className %>();
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
        };

        var populateThis<%= col.NtoNtable.className %> = function() {
            $.get(URL.LIST_<%= col.otherTable.classUpper %>FROM<%= col.NtoNtable.classUpper %>, { 
                <%= col.column.propertyName %>: _<%= table.classLowerCamel %>.<%= table.idColumn.propertyName %>,
                token: simpleStorage.get("token<%= props.modulenameUpper %>") || null
            }, function(resp){
                if (resp.Success) {
                    _<%= table.classLowerCamel %>.<%= col.NtoNtable.classLowerCamel %> = resp.Data;
                    render<%= col.NtoNtable.className %>();
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
        };
    <% } %>
        
        var persist = function() {
            extractFromFields();
            
            martinlabs.bodyRequest(URL.PERSIST_<%= table.classUpper %>, {
                <%= table.classLowerCamel %>: _<%= table.classLowerCamel %><% 
            for (var i in table.NtoNcolumns) { var col = table.NtoNcolumns[i]; %>,
                ids<%= col.otherTable.className %>: extractIds<%= col.NtoNtable.className %>()<% 
            } 
            if (props.loginsys) { %>,
                token: simpleStorage.get("token<%= props.modulenameUpper %>") || null<% } %>
            }, function(resp){
                if (resp.Success) {
                    if (!_<%= table.classLowerCamel %>.<%= table.idColumn.propertyName %>) {
                        _<%= table.classLowerCamel %>.<%= table.idColumn.propertyName %> = resp.Data;
                    }

                    $.notify({ message: "Persisted Successfully" },{
                        type: "success",
                        placement: { align: "center" },
                        delay: 2000
                    });<% if (props.loginsys) { %>
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
        
        var extractFromFields = function() {
            var aux;<% 

for (var i in table.columns) { 
    var c = table.columns[i]; 
    if (c.extra !== "auto_increment") {
        if (c.javaType === "String") { 
            %>
            _<%= table.classLowerCamel %>.<%= c.propertyName %> = $("#input-<%= c.propertyName %>").val();<% 
        
        } else if (["Long", "long"].indexOf(c.javaType) > -1) { 
            %>
            _<%= table.classLowerCamel %>.<%= c.propertyName %> = parseInt($("#input-<%= c.propertyName %>").val());<% 
        } else if (["Double", "double"].indexOf(c.javaType) > -1) { 
            %>
            _<%= table.classLowerCamel %>.<%= c.propertyName %> = parseFloat($("#input-<%= c.propertyName %>").val());<% 
        } else if (c.javaType === "Date") { 
            %>
            aux = $("#input-<%= c.propertyName %>").data("DateTimePicker").date();
            _<%= table.classLowerCamel %>.<%= c.propertyName %> = aux === null ? null : aux.format("YYYY-MM-DDTHH:mm:ss");<% 
        } else { 
            %>
            _<%= table.classLowerCamel %>.<%= c.propertyName %> = $("#input-<%= c.propertyName %>").is(':checked');<% 
        }
    }
} 
%>
        };
    <% for (var i in table.NtoNcolumns) { var col = table.NtoNcolumns[i]; %>
        var extractIds<%= col.NtoNtable.className %> = function() {
            var ids = [];
            
            $("#input-<%= col.NtoNtable.classLowerCamel %> input[type=checkbox]:checked").each(function(){
                ids.push($(this).data("id"));
            });
            
            return ids;
        };
    <% } %>
        var render = function() {
<% for (var i in table.columns) { 
    var c = table.columns[i]; 
    if (c.extra !== "auto_increment") {
        if (c.javaType === "Date") {
%>
            $("#input-<%= c.propertyName %>").data("DateTimePicker").date(moment(_<%= table.classLowerCamel %>.<%= c.propertyName %>, "YYYY-MM-DDTHH:mm:ss"));<% 
        } else if (["Boolean", "boolean"].indexOf(c.javaType) > -1) { 
            %>
            $("#input-<%= c.propertyName %>").prop('checked', _<%= table.classLowerCamel %>.<%= c.propertyName %>);<% 
        } else { 
            %>
            $("#input-<%= c.propertyName %>").val(_<%= table.classLowerCamel %>.<%= c.propertyName %>);<% 
        }
    }
} 
%>
            
            translate();
        };
    <% for (var i in table.NtoNcolumns) { var col = table.NtoNcolumns[i]; %>

        var render<%= col.NtoNtable.className %> = function() {
            if (!$("#input-<%= col.NtoNtable.classLowerCamel %> input[type=checkbox]").length){
                return;
            }
            
            for (var i in _<%= table.classLowerCamel %>.<%= col.NtoNtable.classLowerCamel %>) {
                var item = _<%= table.classLowerCamel %>.<%= col.NtoNtable.classLowerCamel %>[i];
                $("#input-<%= col.NtoNtable.classLowerCamel %> input[type=checkbox][data-id='"+item.<%= col.otherTable.idColumn.propertyName %>+"']").prop("checked", true);
            }
        };
    <% } %>
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