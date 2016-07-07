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
        return selectOne("SELECT "<% 
        for (var i in table.columns) { var c = table.columns[i]; %>
            + "<%= c.column_name + (i < table.columns.length -1 ? ',' : '') %> "<% } %>
            + "FROM <%= table.name %> "
            + "WHERE <%= table.idColumn.column_name %> = ? ", 
        rs -> {
            <%= table.className %> <%= table.classLowerCamel %> = new <%= table.className %>();
            <% for (var i in table.columns) { var c = table.columns[i]; %>
            <%= table.classLowerCamel %>.set<%= c.propertyNameUpper %>(rs.<%= c.resultSetGetter %>("<%= c.column_name %>"));<% } %>
            
            return <%= table.classLowerCamel %>;
        }, id);
    }
    
    public List<<%= table.className %>> list(){
        return selectList("SELECT "<% 
        for (var i in table.columns) { var c = table.columns[i]; %>
            + "<%= c.column_name + (i < table.columns.length -1 ? ',' : '') %> "<% } %>
            + "FROM <%= table.name %> ", 
        rs -> {
            <%= table.className %> <%= table.classLowerCamel %> = new <%= table.className %>();
            <% for (var i in table.columns) { var c = table.columns[i]; %>
            <%= table.classLowerCamel %>.set<%= c.propertyNameUpper %>(rs.<%= c.resultSetGetter %>("<%= c.column_name %>"));<% } %>
            
            return <%= table.classLowerCamel %>;
        });
    }
    
    public int update(<%= table.className %> <%= table.classLowerCamel %>){
        return update("UPDATE <%= table.name %> SET "<% 
        for (var i in table.columns) { var c = table.columns[i]; if (c.extra !== "auto_increment") { %>
            + "<%= c.column_name %> = ?<%= i < table.columns.length -1 ? ',' : '' %> "<% }} %>
            + "WHERE <%= table.idColumn.column_name %> = ? ",<% 
        for (var i in table.columns) { var c = table.columns[i]; if (c.extra !== "auto_increment") { %>
            <%= table.classLowerCamel %>.get<%= c.propertyNameUpper %>(),<% }} %>
            <%= table.classLowerCamel %>.get<%= table.idColumn.propertyNameUpper %>()).affectedRows;
    }
    
    public long insert(<%= table.className %> <%= table.classLowerCamel %>){
        return update("INSERT INTO <%= table.name %> ( "<% 
        for (var i in table.columns) { var c = table.columns[i]; if (c.extra !== "auto_increment") { %>
            + "<%= c.column_name + (i < table.columns.length -1 ? ',' : '') %> "<% }} %>
            + ") VALUES ( "
            + "<% for (var i in table.columns) { var c = table.columns[i]; if (c.extra !== 'auto_increment') { %>?<%= i < table.columns.length -1 ? ',' : '' %><% }} %>"
            + ") ",<% 
        for (var i in table.columns) { var c = table.columns[i]; if (c.extra !== "auto_increment") { %>
            <%= table.classLowerCamel %>.get<%= c.propertyNameUpper %>()<%= i < table.columns.length -1 ? ',' : '' %><% }} %>).key;
    }
}
