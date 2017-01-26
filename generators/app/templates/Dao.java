package <%= props.daoPackage %>;

import <%= props.modelPackage %>.<%= table.className %>;
import br.com.martinlabs.commons.DaoWrapper;
import com.google.common.base.Strings;
import java.sql.Connection;
import java.util.ArrayList;
import java.util.List;
import java.util.HashMap;

/**
 *
 * @author martinlabs CRUD generator
 */
public class <%= table.className %>Dao extends DaoWrapper {
    
    public <%= table.className %>Dao(Connection con) {
        super(con);
    }
    
    public <%= table.className %> get(<% 
for (var k in table.primaryColumns) {
    %><%= k > 0 ? ', ' : '' %>long <%= table.primaryColumns[k].propertyName %><%
} 
%>){
        //TODO: review generated method
        return selectOne("SELECT "<% 
for (var i in table.columns) { 
    var c = table.columns[i]; 
%>
            + "<%= c.column_name + (i < table.columns.length -1 ? ',' : '') %> "<% 
} 
%>
            + "FROM <%= table.name %> "
            + "WHERE <%= table.primaryColumns[0].column_name %> = ? "<% 
for (var j = 1; j < table.primaryColumns.length; j++) { 
%>
            + "AND <%= table.primaryColumns[j].column_name %> = ? "<%
}
%>, 
        rs -> {
            <%= table.className %> <%= table.classLowerCamel %> = new <%= table.className %>();
<% 
for (var i in table.columns) { 
    var c = table.columns[i]; 
%>
            <%= table.classLowerCamel %>.set<%= c.propertyNameUpper %>(rs.<%= c.resultSetGetter %>("<%= c.column_name %>"));<% 
} 
%>
            return <%= table.classLowerCamel %>;
        }<% 
for (var k in table.primaryColumns) {
        %>, <%= table.primaryColumns[k].propertyName %><%
} 
        %>);
    }
<% 
if (table.isReferenced) { 
%>
    public List<<%= table.className %>> list(){
        //TODO: review generated method
        return selectList("SELECT "<% 
    for (var i in table.columns) { var c = table.columns[i]; 
%>
            + "<%= c.column_name + (i < table.columns.length -1 ? ',' : '') %> "<% 
    } 
%>
            + "FROM <%= table.name %> ", 
        rs -> {
            <%= table.className %> <%= table.classLowerCamel %> = new <%= table.className %>();
<% 
    for (var i in table.columns) { 
        var c = table.columns[i]; 
%>
            <%= table.classLowerCamel %>.set<%= c.propertyNameUpper %>(rs.<%= c.resultSetGetter %>("<%= c.column_name %>"));<% 
    } 
%>
            
            return <%= table.classLowerCamel %>;
        });
    }
<% 
} 
%>
    public List<<%= table.className %>> list(
        String query,
        Integer page,
        Integer limit,
        String orderRequest,
        Boolean asc){
        //TODO: review generated method

        HashMap<String, String> orderRequestAndColumn = new HashMap<>();
<% 
for (var i in table.columns) { var c = table.columns[i]; 
%>
        orderRequestAndColumn.put("<%= c.column_name %>", "<%= c.column_name %>");<% 
} 
%>
        String orderColumn = orderRequestAndColumn.get(orderRequest);

        ArrayList<Object> params = new ArrayList<>();
        String where = "";

        if (!Strings.isNullOrEmpty(query)) {
            where = "WHERE LOWER(CONCAT("<% 
for (var i in table.columns) { var c = table.columns[i]; 
%>
            + "IFNULL(<%= c.column_name %>, '')<%= (i < table.columns.length -1 ? ',' : '') %> "<% 
} 
%>
            +")) LIKE LOWER(?) ";
            params.add("%" + query + "%");
        }

        params.add(page * limit);
        params.add(limit);
        return selectList("SELECT "<% 
for (var i in table.columns) { 
    var c = table.columns[i]; 
%>
            + "<%= c.column_name + (i < table.columns.length -1 ? ',' : '') %> "<% 
} 
%>
            + "FROM <%= table.name %> "
            + where
            + (orderColumn != null ? "ORDER BY " + orderColumn + " " + (asc ? "ASC " : "DESC ") : "")
            + "LIMIT ?, ? ", 
        rs -> {
            <%= table.className %> <%= table.classLowerCamel %> = new <%= table.className %>();
<% 
for (var i in table.columns) { 
    var c = table.columns[i]; 
%>
            <%= table.classLowerCamel %>.set<%= c.propertyNameUpper %>(rs.<%= c.resultSetGetter %>("<%= c.column_name %>"));<% 
} 
%>
            
            return <%= table.classLowerCamel %>;
        }, params.toArray());
    }
    
    public Integer count(){
        //TODO: review generated method
        return selectFirstInt("SELECT "
            + "COUNT(<%= table.primaryColumns[0].column_name %>) "
            + "FROM <%= table.name %> ");
    }
    
    public Integer count(String search) {
        //TODO: review generated method
        return selectFirstInt("SELECT "
            + "COUNT(<%= table.primaryColumns[0].column_name %>) "
            + "FROM <%= table.name %> "
            + "WHERE LOWER(CONCAT("<% 
for (var i in table.columns) { 
    var c = table.columns[i]; 
%>
            + "IFNULL(<%= c.column_name %>, '')<%= (i < table.columns.length -1 ? ',' : '') %> "<% 
} 
%>
            +")) LIKE LOWER(?) ", 
            "%" + search + "%");
    }
    
    public int update(<%= table.className %> <%= table.classLowerCamel %>){
        //TODO: review generated method
        return update("UPDATE <%= table.name %> SET "<% 
for (var i in table.columns) { 
    var c = table.columns[i]; 
    if (c.extra !== "auto_increment" && c.column_key != "PRI") { 
%>
            + "<%= c.column_name %> = ?<%= i < table.columns.length -1 ? ',' : '' %> "<% 
    }
} 
%>
            + "WHERE <%= table.primaryColumns[0].column_name %> = ? "<% 
for (var j = 1; j < table.primaryColumns.length; j++) { 
%>
            + "AND <%= table.primaryColumns[j].column_name %> = ? "<%
}
        %>,<% 
for (var i in table.columns) { 
    var c = table.columns[i]; 
    if (c.extra !== "auto_increment" && c.column_key != "PRI") { 
%>
            <%= table.classLowerCamel %>.get<%= c.propertyNameUpper %>(),<% 
    }
} 
%>
            <%= table.classLowerCamel %>.get<%= table.primaryColumns[0].propertyNameUpper %>()<%
for (var j = 1; j < table.primaryColumns.length; j++) { 
            %>,
            <%= table.classLowerCamel %>.get<%= table.primaryColumns[j].propertyNameUpper %>()<%
}
            %>).affectedRows;
    }
    
    public long insert(<%= table.className %> <%= table.classLowerCamel %>){
        //TODO: review generated method
        return update("INSERT INTO <%= table.name %> ( "<% 
for (var i in table.columns) { 
    var c = table.columns[i]; 
    if (c.extra !== "auto_increment") { 
%>
            + "<%= c.column_name + (i < table.columns.length -1 ? ',' : '') %> "<% 
    }
} 
%>
            + ") VALUES ( "
            + "<% 
for (var i in table.columns) { 
    var c = table.columns[i]; 
    if (c.extra !== 'auto_increment') { 
        %>?<%= i < table.columns.length -1 ? ',' : '' %><% 
    }
} 
%>"
            + ") ",<% 
for (var i in table.columns) { 
    var c = table.columns[i]; 
    if (c.extra !== "auto_increment") { 
%>
            <%= table.classLowerCamel %>.get<%= c.propertyNameUpper %>()<%= i < table.columns.length -1 ? ',' : '' %><% 
    }
} 
        %>).key;
    }
<% 
if (table.primaryColumns.length > 1 || table.primaryColumns[0].referencedTable) { 
%>
    public boolean exist<%= table.className %>(<% 
    for (var k in table.primaryColumns) {
        %><%= k > 0 ? ', ' : '' %>long <%= table.primaryColumns[k].propertyName %><%
    } %>) {
        //TODO: review generated method
        return exist("SELECT <%= table.primaryColumns[0].column_name %> FROM <%= table.name %> "
            + "WHERE <%= table.primaryColumns[0].column_name %> = ? "<% 
        for (var j = 1; j < table.primaryColumns.length; j++) { %>
            + "AND <%= table.primaryColumns[j].column_name %> = ? "<%
        }

        for (var k in table.primaryColumns) {
            %>, <%= table.primaryColumns[k].propertyName %><%
        } 
        %>);
    }
<% 
} 

for (var i in table.columns) { 
    var c = table.columns[i];

    if (c.column_key === "UNI") {
%>
    public boolean exist<%= c.propertyNameUpper %>(<%= c.javaType %> <%= c.propertyName %><% 
        for (var k in table.primaryColumns) {
            %>, long <%= table.primaryColumns[k].propertyName %><%
        } %>) {
        //TODO: review generated method
        return exist("SELECT <%= c.column_name %> FROM <%= table.name %> "
            + "WHERE <%= c.column_name %> = ? "<% 
        for (var j = 0; j < table.primaryColumns.length; j++) { 
%>
            + "AND <%= table.primaryColumns[j].column_name %> != ? "<%
        }
%>, 
            <%= c.propertyName %><%
        for (var k in table.primaryColumns) {
%>, 
            <%= table.primaryColumns[k].propertyName %><%
        } 
%>
%>);
    }
<%
    }
}
%>

}
