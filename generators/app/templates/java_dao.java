package <%= props.daoPackage %>;

import <%= props.modelPackage %>.<%= table.className %>;
import br.com.martinlabs.commons.DaoWrapper;
import java.sql.Connection;
import java.util.List;

/**
 *
 * @author martinlabs CRUD generator
 */
public class <%= table.className %>Dao extends DaoWrapper {
    
    public <%= table.className %>Dao(Connection con) {
        super(con);
    }
    
    public boolean exist(long id) {
        return exist(""
                + "SELECT <%= table.idColumn.column_name %> "
                + "FROM <%= table.name %> "
                + "WHERE <%= table.idColumn.column_name %> = ? ", 
                id);
    }
    
    public <%= table.className %> get(long id){
        return selectOne("SELECT "
            <% for (var i in table.columns) { var c = table.columns[i]; %>
            + "<%= c.column_name + (i < table.columns.length -1 ? ',' : '') %> "<% } %>
            + " FROM <%= table.name %> "
            + "WHERE <%= table.idColumn.column_name %> = ? ", 
        rs -> {
            <%= table.className %> obj = new <%= table.className %>();
            
            <% for (var i in table.columns) { var c = table.columns[i]; %>
            obj.set<%= c.propertyNameUpper %>(rs.<%= c.resultSetGetter %>("<%= c.column_name %>"));<% } %>
            
            return obj;
        }, id);
    }
    
    public List<<%= table.className %>> list(){
        return selectList("SELECT "
            <% for (var i in table.columns) { var c = table.columns[i]; %>
            + "<%= c.column_name + (i < table.columns.length -1 ? ',' : '') %> "<% } %>
            + " FROM <%= table.name %> ", 
        rs -> {
            <%= table.className %> obj = new <%= table.className %>();
            
            <% for (var i in table.columns) { var c = table.columns[i]; %>
            obj.set<%= c.propertyNameUpper %>(rs.<%= c.resultSetGetter %>("<%= c.column_name %>"));<% } %>
            
            return obj;
        });
    }
    
    public int update(<%= table.className %> obj){
        return update("UPDATE <%= table.name %> SET "
            <% for (var i in table.columns) { var c = table.columns[i]; if (c.extra !== "auto_increment") { %>
            + "<%= c.column_name %> = ?<%= i < table.columns.length -1 ? ',' : '' %> "<% }} %>
            + "WHERE <%= table.idColumn.column_name %> = ? ",
            <% for (var i in table.columns) { var c = table.columns[i]; if (c.extra !== "auto_increment") { %>
            obj.get<%= c.propertyNameUpper %>(),<% }} %>
            obj.get<%= table.idColumn.propertyNameUpper %>()).affectedRows;
    }
    
    public long insert(<%= table.className %> obj){
        return update("INSERT INTO <%= table.name %> ( "
            <% for (var i in table.columns) { var c = table.columns[i]; if (c.extra !== "auto_increment") { %>
            + "<%= c.column_name + (i < table.columns.length -1 ? ',' : '') %> "<% }} %>
            + ") VALUES ( "
            + "<% for (var i in table.columns) { var c = table.columns[i]; if (c.extra !== 'auto_increment') { %>?<%= i < table.columns.length -1 ? ',' : '' %><% }} %>"
            + ") ",
            <% for (var i in table.columns) { var c = table.columns[i]; if (c.extra !== "auto_increment") { %>
            obj.get<%= c.propertyNameUpper %>()<%= i < table.columns.length -1 ? ',' : '' %><% }} %>).key;
    }
}
