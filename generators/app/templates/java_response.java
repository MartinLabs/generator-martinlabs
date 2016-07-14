package <%= props.responsePackage %>;

import java.util.List;
import <%= props.modelPackage %>.<%= table.className %>;<% 
var antiRepeat = [];
for (var i in table.columns) { 
    var c = table.columns[i]; 
    if (c.referencedTable && antiRepeat.indexOf(c.referencedTable.className) < 0) {
        antiRepeat.push(c.referencedTable.className);
%>
import <%= props.modelPackage %>.<%= c.referencedTable.className %>;<%
    }
}
antiRepeat = [];
for (var i in table.NtoNcolumns) { 
    var c = table.NtoNcolumns[i]; 
    if (antiRepeat.indexOf(c.otherTable.className) < 0) {
        antiRepeat.push(c.otherTable.className);
%>
import <%= props.modelPackage %>.<%= c.otherTable.className %>;<%
    }
}
%>

/**
 *
 * @author martinlabs CRUD generator
 */
public class <%= table.className %>Resp {

    private <%= table.className %> <%= table.classLowerCamel %>;
    <% 
    antiRepeat = [];
    for (var i in table.columns) { 
	    var c = table.columns[i]; 
	    if (c.referencedTable && antiRepeat.indexOf(c.referencedTable.className) < 0) {
            antiRepeat.push(c.referencedTable.className);
	%>
    private List<<%= c.referencedTable.className %>> all<%= c.referencedTable.className %>;<% 
        }
    }

    antiRepeat = [];
    for (var i in table.NtoNcolumns) { 
        var c = table.NtoNcolumns[i]; 
        if (antiRepeat.indexOf(c.otherTable.className) < 0) {
            antiRepeat.push(c.otherTable.className);
    %>
    private List<<%= c.otherTable.className %>> all<%= c.otherTable.className %>;<% 
        }
    } 
    %>
    
    public <%= table.className %> get<%= table.className %>() {
        return <%= table.classLowerCamel %>;
    }

    public void set<%= table.className %>(<%= table.className %> <%= table.classLowerCamel %>) {
        this.<%= table.classLowerCamel %> = <%= table.classLowerCamel %>;
    }
    <% 
    antiRepeat = [];
    for (var i in table.columns) { 
        var cx = table.columns[i]; 
        if (cx.referencedTable && antiRepeat.indexOf(cx.referencedTable.className) < 0) {
            antiRepeat.push(cx.referencedTable.className);
    %>
    public List<<%= cx.referencedTable.className %>> getAll<%= cx.referencedTable.className %>() {
        return all<%= cx.referencedTable.className %>;
    }

    public void setAll<%= cx.referencedTable.className %>(List<<%= cx.referencedTable.className %>> all<%= cx.referencedTable.className %>) {
        this.all<%= cx.referencedTable.className %> = all<%= cx.referencedTable.className %>;
    }<% 
        }
    }
    antiRepeat = [];
    for (var i in table.NtoNcolumns) { 
        var c = table.NtoNcolumns[i]; 
        if (antiRepeat.indexOf(c.otherTable.className) < 0) {
            antiRepeat.push(c.otherTable.className);
    %>
    public List<<%= c.otherTable.className %>> getAll<%= c.otherTable.className %>() {
        return all<%= c.otherTable.className %>;
    }

    public void setAll<%= c.otherTable.className %>(List<<%= c.otherTable.className %>> all<%= c.otherTable.className %>) {
        this.all<%= c.otherTable.className %> = all<%= c.otherTable.className %>;
    }<%
        }
    } 
    %>
    
}
