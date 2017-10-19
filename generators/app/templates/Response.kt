package <%= props.responsePackage %>

import io.swagger.annotations.ApiModel
import io.swagger.annotations.ApiModelProperty
import <%= props.modelPackage %>.<%= table.className %><% 
var antiRepeat = [];
for (var i in table.columns) { 
    var c = table.columns[i]; 
    if (c.referencedTable && antiRepeat.indexOf(c.referencedTable.className) < 0) {
        antiRepeat.push(c.referencedTable.className);
%>
import <%= props.modelPackage %>.<%= c.referencedTable.className %><%
    }
}
antiRepeat = [];
for (var i in table.NtoNcolumns) { 
    var c = table.NtoNcolumns[i]; 
    if (antiRepeat.indexOf(c.otherTable.className) < 0) {
        antiRepeat.push(c.otherTable.className);
%>
import <%= props.modelPackage %>.<%= c.otherTable.className %><%
    }
}
%>

@ApiModel(value = "Contains the <%= table.className %> and possible values for it's properties")
class <%= table.className %>Resp {

    var <%= table.classLowerCamel %>: <%= table.className %>? = null<% 
    antiRepeat = [];
    for (var i in table.columns) { 
	    var c = table.columns[i]; 
	    if (c.referencedTable && antiRepeat.indexOf(c.referencedTable.className) < 0) {
            antiRepeat.push(c.referencedTable.className);
	%>

    @ApiModelProperty(value = "Possible <%= c.referencedTable.className %> values")
    var all<%= c.referencedTable.className %>: MutableList<<%= c.referencedTable.className %>>? = null<% 
        }
    }

    antiRepeat = [];
    for (var i in table.NtoNcolumns) { 
        var c = table.NtoNcolumns[i]; 
        if (antiRepeat.indexOf(c.otherTable.className) < 0) {
            antiRepeat.push(c.otherTable.className);
    %>

    @ApiModelProperty(value = "Possible <%= c.otherTable.className %> values")
    var all<%= c.otherTable.className %>: MutableList<<%= c.otherTable.className %>>? = null<% 
        }
    } 
    %>
}
