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
        
        var _<%= table.classLowerCamel %>;<% 
var antiRepeat = [];
for (var i in table.columns) { 
    var c = table.columns[i]; 
    if (c.referencedTable && antiRepeat.indexOf(c.referencedTable.className) < 0) {
        antiRepeat.push(c.referencedTable.className);
%>
        var _all<%= c.referencedTable.className %>;<%
    }
}

antiRepeat = [];
for (var i in table.NtoNcolumns) { 
    var c = table.NtoNcolumns[i]; 
    if (antiRepeat.indexOf(c.otherTable.className) < 0) {
        antiRepeat.push(c.otherTable.className);
%>
        var _all<%= c.otherTable.className %>;<%
    }
}
%>
        
        var init = function() {
            defaultInterface({ active: "<%= table.className %>" });
            translate();
            registerInteraction();
            requestContent();
        };
        
        var requestContent = function() {
            var id = martinlabs.getParam("id") || 0;
            
            $.get(URL.GET_<%= table.classUpper %>, {<% if (props.loginsys) { %> 
                token: simpleStorage.get("token<%= props.modulenameUpper %>") || null,<% } %>
                id: id
            },
            function(resp){
                if (resp.Success) {
                    _<%= table.classLowerCamel %> = resp.Data.<%= table.classLowerCamel %>;<% 
            antiRepeat = [];
            for (var i in table.columns) { 
                var c = table.columns[i]; 
                if (c.referencedTable && antiRepeat.indexOf(c.referencedTable.className) < 0) {
                    antiRepeat.push(c.referencedTable.className);
            %>
                    _all<%= c.referencedTable.className %> = resp.Data.all<%= c.referencedTable.className %>;
            <% 
                }
            }
            antiRepeat = [];
            for (var i in table.NtoNcolumns) { 
                var c = table.NtoNcolumns[i]; 
                if (antiRepeat.indexOf(c.otherTable.className) < 0) {
                    antiRepeat.push(c.otherTable.className);
            %>
                    _all<%= c.otherTable.className %> = resp.Data.all<%= c.otherTable.className %>;
            <% 
                }
            }
            %>
                    render();<% if (props.loginsys) { %>
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
    
        var persist = function() {
            extractFromFields();
            
            martinlabs.bodyRequest(URL.PERSIST_<%= table.classUpper %>, {
                <%= table.classLowerCamel %>: _<%= table.classLowerCamel %><% 
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
                    });
                    
                    setTimeout(function() {
                        location.href = URL.listPages.<%= table.className %>;
                    }, 2000);
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
        
        var extractFromFields = function() {
            var aux;

            if (!_<%= table.classLowerCamel %>) {
                _<%= table.classLowerCamel %> = {};
            }<% 

for (var i in table.columns) { 
    var c = table.columns[i]; 
    if (c.extra !== "auto_increment") {
        if (c.referencedTable) {
            %>
            _<%= table.classLowerCamel %>.<%= c.notIdPropertyName %> = {
                <%= c.referencedTable.idColumn.propertyName %>: parseInt($("#input-<%= c.propertyName %>").val())
            };<% 
        } else if (c.javaType === "String") { 
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

for (var i in table.NtoNcolumns) {
    var c = table.NtoNcolumns[i];
%>
            _<%= table.classLowerCamel%>.<%= c.NtoNtable.classLowerCamel %> = extract<%= c.NtoNtable.className %>();<%
}
%>
        };
    <% for (var i in table.NtoNcolumns) { var col = table.NtoNcolumns[i]; %>
        var extract<%= col.NtoNtable.className %> = function() {
            var <%= col.NtoNtable.classLowerCamel %> = [];
            
            $("#input-<%= col.NtoNtable.classLowerCamel %> input[type=checkbox]:checked").each(function(){
                <%= col.NtoNtable.classLowerCamel %>.push({ 
                    <%= col.otherTable.idColumn.propertyName %>: $(this).data("id") 
                });
            });
            
            return <%= col.NtoNtable.classLowerCamel %>;
        };
    <% } %>
        var render = function() {
            if (_<%= table.classLowerCamel %>) {<% 
for (var i in table.columns) { 
    var c = table.columns[i]; 
    if (c.extra !== "auto_increment" && !c.referencedTable) {
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
            }
<% 
for (var i in table.columns) { 
    var c = table.columns[i]; 
    if (c.referencedTable) {
%>
            var <%= c.propertyName %>V = $("#input-<%= c.propertyName %>");
            for (var i in _all<%= c.referencedTable.className %>) {
                var item = _all<%= c.referencedTable.className %>[i];
                <%= c.propertyName %>V.append("<option value='"+item.<%= c.referencedTable.idColumn.propertyName %>+"'>"<% 

                for (var j in c.referencedTable.columns) { var r = c.referencedTable.columns[j]; %>
                    + (item.<%= r.propertyName %> === undefined ? "" : item.<%= r.propertyName %> + "; ")<% 
                } %>
                +"</option>");
            }

            if (_<%= table.classLowerCamel %> && _<%= table.classLowerCamel %>.<%= c.notIdPropertyName %> && _<%= table.classLowerCamel %>.<%= c.notIdPropertyName %>.<%= c.referencedTable.idColumn.propertyName %>) {
                <%= c.propertyName %>V.val(_<%= table.classLowerCamel %>.<%= c.notIdPropertyName %>.<%= c.referencedTable.idColumn.propertyName %>);
            }
<%
    }
}

for (var i in table.NtoNcolumns) { var col = table.NtoNcolumns[i]; %>

            var groupV = $("#input-<%= col.NtoNtable.classLowerCamel %>");
            for (var i in _all<%= col.otherTable.className %>) {
                var item = _all<%= col.otherTable.className %>[i];
                groupV.append("<div class='checkbox'><label><input type='checkbox' data-id='"+item.<%= col.otherTable.idColumn.propertyName %>+"'>"<% 

                    for (var j in col.otherTable.columns) { var r = col.otherTable.columns[j]; %>
                        + (item.<%= r.propertyName %> === undefined ? "" : item.<%= r.propertyName %> + "; ")<% 
                    } %>+"</label></div>");
            }
            
            for (var i in _<%= table.classLowerCamel %>.<%= col.NtoNtable.classLowerCamel %>) {
                var item = _<%= table.classLowerCamel %>.<%= col.NtoNtable.classLowerCamel %>[i];
                $("#input-<%= col.NtoNtable.classLowerCamel %> input[type=checkbox][data-id='"+item.<%= col.otherTable.idColumn.propertyName %>+"']").prop("checked", true);
            }
<% } %>

    
            translate();

        };
        
        var registerInteraction = function() {
            $("form").validator({ disable: false }).on("submit", function(e){
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