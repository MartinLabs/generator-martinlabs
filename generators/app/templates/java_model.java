package <%= props.modelPackage %>;

import java.util.Date;
/**
 *
 * @author martinlabs CRUD generator
 */
public class <%= table.className %> {
    <% for (var i in table.columns) { var c = table.columns[i]; %>
    private <%= c.javaType %> <%= c.propertyName %>;<% } %>
    
    <% for (var j in table.columns) { var cx = table.columns[j]; %>
    public <%= cx.javaType %> get<%= cx.propertyNameUpper %>() {
        return <%= cx.propertyName %>;
    }

    public void set<%= cx.propertyNameUpper %>(<%= cx.javaType %> <%= cx.propertyName %>) {
        this.<%= cx.propertyName %> = <%= cx.propertyName %>;
    }
    <% } %>
    
}
