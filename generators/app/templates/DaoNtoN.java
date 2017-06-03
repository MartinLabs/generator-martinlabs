package <%= props.daoPackage %>;
<% for (var i in table.columns) { var c = table.columns[i]; %>
import <%= props.modelPackage %>.<%= c.referencedTable.className %>;<% } %>
import br.com.martinlabs.commons.DaoWrapper;
import java.sql.Connection;
import java.util.List;
import br.com.martinlabs.commons.LanguageHolder;


/**
 *
 * @author martinlabs CRUD generator
 */
public class <%= table.className %>Dao extends DaoWrapper {
    
    public <%= table.className %>Dao(Connection con, LanguageHolder lang) {
        super(con, lang);
    }
    
    public int insert(<% 
for (var i in table.columns) { 
    var c = table.columns[i]; 
%>long <%= c.propertyName + (i < table.columns.length -1 ? ',' : '') %><% 
} 
%>){
        //TODO: review generated method
        return update("INSERT INTO <%= table.name %> ( "<% 
for (var i in table.columns) { 
    var c = table.columns[i]; 
%>
            + "<%= c.column_name + (i < table.columns.length -1 ? ',' : '') %> "<% 
} 
%>
            + ") VALUES ( "
            + "<% 
for (var i in table.columns) { 
    var c = table.columns[i]; 
%>?<%= i < table.columns.length -1 ? ',' : '' %><% 
} 
%>"
            + ") ",<% 
for (var i in table.columns) { 
    var c = table.columns[i]; 
%>
            <%= c.propertyName + (i < table.columns.length -1 ? ',' : '') %><% 
} 
%>).affectedRows;
    }
<% 
for (var i in table.columns) { 
    var c = table.columns[i]; 
%>
    public int removeAllFrom<%= c.referencedTable.className %>(long <%= c.propertyName %>){
        //TODO: review generated method
        return update("DELETE FROM <%= table.name %> "
                + "WHERE <%= c.propertyName %> = ? ",
            <%= c.propertyName %>).affectedRows;
    }
<% 
} 
var c = table.columns[0];
var other = table.columns[1];
%>
    public List<<%= c.referencedTable.className %>> list<%= c.referencedTable.className %>Of<%= other.referencedTable.className %>(long <%= other.propertyName %>){
        //TODO: review generated method
        return selectList("SELECT * "
            + "FROM <%= c.referencedTable.name %> "
            + "INNER JOIN <%= table.name %> ON <%= c.referencedTable.name %>.<%= c.referencedTable.primaryColumns[0].column_name %> = <%= table.name %>.<%= c.column_name %> "
            + "WHERE <%= table.name %>.<%= other.column_name %> = ? "<%
if (c.referencedTable.deactivableColumn) { 
%>
            + "AND <%= c.referencedTable.name %>.<%= c.referencedTable.deactivableColumn.column_name %> = 1 "<%
}
%>, 
            rs -> <%= c.referencedTable.className %>.buildAll(rs), 
            <%= other.propertyName %>);
    } 
<% 
c = table.columns[1];
other = table.columns[0];
%>
    public List<<%= c.referencedTable.className %>> list<%= c.referencedTable.className %>Of<%= other.referencedTable.className %>(long <%= other.propertyName %>){
        //TODO: review generated method
        return selectList("SELECT * "
            + "FROM <%= c.referencedTable.name %> "
            + "INNER JOIN <%= table.name %> ON <%= c.referencedTable.name %>.<%= c.referencedTable.primaryColumns[0].column_name %> = <%= table.name %>.<%= c.column_name %> "
            + "WHERE <%= table.name %>.<%= other.column_name %> = ? "<%
if (c.referencedTable.deactivableColumn) { 
%>
            + "AND <%= c.referencedTable.name %>.<%= c.referencedTable.deactivableColumn.column_name %> = 1 "<%
}
%>, 
            rs -> <%= c.referencedTable.className %>.buildAll(rs), 
            <%= other.propertyName %>);
    }

}
