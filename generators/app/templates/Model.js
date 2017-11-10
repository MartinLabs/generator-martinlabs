/**
 * <%= table.className %><%
 if (table.comment && table.comment.length) { %>
 * <%= table.comment %><%
 } %>
 * @author martinlabs CRUD generator
 */
export default class {
  constructor() {<%
for (var i in table.columns) { 
    var col = table.columns[i];
    if (col.extra !== "auto_increment") { 
    	if (["Boolean", "boolean"].indexOf(col.javaType) > -1) { %>
    this.<%= col.notIdPropertyName %> = false;<%
    	} else { %>
    this.<%= col.notIdPropertyName %> = <%= col.referencedTable ? '{}' : 'null' %>;<%
    	}
  }
}
for (var i in table.NtoNcolumns) { 
    var col = table.NtoNcolumns[i]; %>
    this.<%= col.NtoNtable.classLowerCamel %> = [];<%
}
%>
  }
}
