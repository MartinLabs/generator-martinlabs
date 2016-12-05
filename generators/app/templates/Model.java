package <%= props.modelPackage %>;

import java.util.Date;
import java.util.List;

/**
 * <%= table.comment %>
 * @author martinlabs CRUD generator
 */
public class <%= table.className %> {
<% for (var i in table.columns) { 
    var c = table.columns[i]; 
    if (!c.referencedTable) {
    %>
    private <%= c.javaType %> <%= c.propertyName %>;<% 
    } else { %>
    private <%= c.referencedTable.className %> <%= c.notIdPropertyName %>;<% 
    } %><%= c.column_comment ? " //" + c.column_comment : "" %><% 
} %>

    <% for (var i in table.NtoNcolumns) { var cn = table.NtoNcolumns[i]; %>
    private List<<%= cn.otherTable.className %>> <%= cn.NtoNtable.classLowerCamel %>;<% } %>

    public <%= table.className %>() {
    }

    public <%= table.className %>(<%= table.className %> other) {
        <% for (var i in table.columns) { 
            var c = table.columns[i]; 
            if (!c.referencedTable) {
        %>
        this.<%= c.propertyName %> = other.<%= c.propertyName %>;<% 
        } else { %>
        this.<%= c.notIdPropertyName %> = other.<%= c.notIdPropertyName %>;<% 
            } 
        } 

        for (var i in table.NtoNcolumns) { var cn = table.NtoNcolumns[i]; %>
        this.<%= cn.NtoNtable.classLowerCamel %> = other.<%= cn.NtoNtable.classLowerCamel %>;<% 
        } %>
    }
    
<% for (var j in table.columns) { 
    var cx = table.columns[j]; 
    if (!cx.referencedTable) {
    %>
    public <%= cx.javaType %> get<%= cx.propertyNameUpper %>() {
        return <%= cx.propertyName %>;
    }

    public void set<%= cx.propertyNameUpper %>(<%= cx.javaType %> <%= cx.propertyName %>) {
        this.<%= cx.propertyName %> = <%= cx.propertyName %>;
    }
    <% } else { %>
    public <%= cx.referencedTable.className %> get<%= cx.notIdPropertyNameUpper %>() {
        return <%= cx.notIdPropertyName %>;
    }

    public void set<%= cx.notIdPropertyNameUpper %>(<%= cx.referencedTable.className %> <%= cx.notIdPropertyName %>) {
        this.<%= cx.notIdPropertyName %> = <%= cx.notIdPropertyName %>;
    }

    public <%= cx.javaType %> get<%= cx.propertyNameUpper %>() {
        return <%= cx.notIdPropertyName %> == null ? 0 : <%= cx.notIdPropertyName %>.get<%= cx.referencedTable.idColumn.propertyNameUpper %>();
    }

    public void set<%= cx.propertyNameUpper %>(<%= cx.javaType %> <%= cx.propertyName %>) {
        if (<%= cx.notIdPropertyName %> == null) {
            <%= cx.notIdPropertyName %> = new <%= cx.referencedTable.className %>();
        }
        
        <%= cx.notIdPropertyName %>.set<%= cx.referencedTable.idColumn.propertyNameUpper %>(<%= cx.propertyName %>);
    }
    <% } 
} 
%>
    
    <% for (var j in table.NtoNcolumns) { var cx = table.NtoNcolumns[j]; %>
    public List<<%= cx.otherTable.className %>> get<%= cx.NtoNtable.className %>() {
        return <%= cx.NtoNtable.classLowerCamel %>;
    }

    public void set<%= cx.NtoNtable.className %>(List<<%= cx.otherTable.className %>> <%= cx.NtoNtable.classLowerCamel %>) {
        this.<%= cx.NtoNtable.classLowerCamel %> = <%= cx.NtoNtable.classLowerCamel %>;
    }
    <% } %>
    
}
