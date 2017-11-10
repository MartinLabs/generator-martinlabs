package <%= props.daoPackage %>
<% for (var i in table.columns) { var c = table.columns[i]; %>
import <%= props.modelPackage %>.<%= c.referencedTable.className %><% } %>
import com.simpli.model.LanguageHolder
import com.simpli.sql.Dao
import java.sql.Connection


/**
 * Responsible for <%= table.className %> database operations
 * @author martinlabs CRUD generator
 */
class <%= table.className %>Dao(con: Connection, lang: LanguageHolder) : Dao(con, lang) {
    
    fun insert(<% 
for (var i in table.columns) { 
    var c = table.columns[i]; 
%><%= c.propertyName %>: Long<%= (i < table.columns.length -1 ? ', ' : '') %><% 
} 
%>): Int {
        //TODO: review generated method
        return update("""
            INSERT INTO <%= table.name %> ( <% 
for (var i in table.columns) { 
    var c = table.columns[i]; 
%>
            <%= c.column_name %><%= (i < table.columns.length -1 ? ',' : '') %><% 
} 
%>
            ) VALUES (
            <% 
for (var i in table.columns) { 
    var c = table.columns[i]; 
%>?<%= i < table.columns.length -1 ? ',' : '' %><% 
} 
%>
            )
            """,<% 
for (var i in table.columns) { 
    var c = table.columns[i]; 
%>
            <%= c.propertyName %><%= (i < table.columns.length -1 ? ',' : '') %><% 
} 
%>).affectedRows
    }
<% 
for (var i in table.columns) { 
    var c = table.columns[i]; 
%>
    fun removeAllFrom<%= c.referencedTable.className %>(<%= c.propertyName %>: Long): Int {
        //TODO: review generated method
        return update("DELETE FROM <%= table.name %> WHERE <%= c.propertyName %> = ? ",
            <%= c.propertyName %>).affectedRows
    }
<% 
} 
var c = table.columns[0];
var other = table.columns[1];
%>
    fun list<%= c.referencedTable.className %>Of<%= other.referencedTable.className %>(<%= other.propertyName %>: Long): MutableList<<%= c.referencedTable.className %>> {
        //TODO: review generated method
        return selectList("""
            SELECT *
            FROM <%= c.referencedTable.name %>
            INNER JOIN <%= table.name %> ON <%= c.referencedTable.name %>.<%= c.referencedTable.primaryColumns[0].column_name %> = <%= table.name %>.<%= c.column_name %>
            WHERE <%= table.name %>.<%= other.column_name %> = ?<%
if (c.referencedTable.deactivableColumn) { 
%>
            AND <%= c.referencedTable.name %>.<%= c.referencedTable.deactivableColumn.column_name %> = 1<%
}
%>
            """, 
            { rs -> <%= c.referencedTable.className %>.buildAll(rs) }, 
            <%= other.propertyName %>)
    } 
<% 
c = table.columns[1];
other = table.columns[0];
%>
    fun list<%= c.referencedTable.className %>Of<%= other.referencedTable.className %>(<%= other.propertyName %>: Long): MutableList<<%= c.referencedTable.className %>> {
        //TODO: review generated method
        return selectList("""
            SELECT *
            FROM <%= c.referencedTable.name %>
            INNER JOIN <%= table.name %> ON <%= c.referencedTable.name %>.<%= c.referencedTable.primaryColumns[0].column_name %> = <%= table.name %>.<%= c.column_name %>
            WHERE <%= table.name %>.<%= other.column_name %> = ?<%
if (c.referencedTable.deactivableColumn) { 
%>
            AND <%= c.referencedTable.name %>.<%= c.referencedTable.deactivableColumn.column_name %> = 1<%
}
%>
            """, 
            { rs -> <%= c.referencedTable.className %>.buildAll(rs) }, 
            <%= other.propertyName %>)
    }

}
