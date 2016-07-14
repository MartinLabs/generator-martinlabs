package <%= props.modelPackage %>;

import java.util.Date;
import java.util.List;
/**
 *
 * @author martinlabs CRUD generator
 */
public class <%= table.className %> {
    <% for (var i in table.columns) { var c = table.columns[i]; %>
    private <%= c.javaType %> <%= c.propertyName %>;<% } %>

    <% for (var i in table.NtoNcolumns) { var cn = table.NtoNcolumns[i]; %>
    private List<<%= cn.otherTable.className %>> <%= cn.NtoNtable.classLowerCamel %>;<% } %>
    
    <% for (var j in table.columns) { var cx = table.columns[j]; %>
    public <%= cx.javaType %> get<%= cx.propertyNameUpper %>() {
        return <%= cx.propertyName %>;
    }

    public void set<%= cx.propertyNameUpper %>(<%= cx.javaType %> <%= cx.propertyName %>) {
        this.<%= cx.propertyName %> = <%= cx.propertyName %>;
    }
    <% } %>
    
    <% for (var j in table.NtoNcolumns) { var cx = table.NtoNcolumns[j]; %>
    public List<<%= cx.otherTable.className %>> get<%= cx.NtoNtable.className %>() {
        return <%= cx.NtoNtable.classLowerCamel %>;
    }

    public void set<%= cx.NtoNtable.className %>(List<<%= cx.otherTable.className %>> <%= cx.NtoNtable.classLowerCamel %>) {
        this.<%= cx.NtoNtable.classLowerCamel %> = <%= cx.NtoNtable.classLowerCamel %>;
    }
    <% } %>
    
}
