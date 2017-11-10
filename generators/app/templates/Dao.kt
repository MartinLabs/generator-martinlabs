package <%= props.daoPackage %>

import <%= props.modelPackage %>.<%= table.className %>
import com.google.common.base.Strings
import java.sql.Connection
import java.util.ArrayList
import java.util.HashMap
import com.simpli.model.LanguageHolder
import com.simpli.sql.Dao

/**
 * Responsible for <%= table.className %> database operations
 * @author martinlabs CRUD generator
 */
class <%= table.className %>Dao(con: Connection, lang: LanguageHolder) : Dao(con, lang) {
    
    fun getOne(<% 
for (var k in table.primaryColumns) {
    %><%= k > 0 ? ', ' : '' %><%= table.primaryColumns[k].propertyName %>: Long<%
} 
%>): <%= table.className %>? {
        //TODO: review generated method
        return selectOne("""
            SELECT *
            FROM <%= table.name %>
            WHERE <%= table.primaryColumns[0].column_name %> = ?<% 
for (var j = 1; j < table.primaryColumns.length; j++) { 
%>
            AND <%= table.primaryColumns[j].column_name %> = ?<%
}
%>
            """,
            { rs -> <%= table.className %>.buildAll(rs) }<% 
for (var k in table.primaryColumns) {
        %>, 
            <%= table.primaryColumns[k].propertyName %><%
} 
        %>)
    }
<% 
if (table.isReferenced) { 
%>
    fun list(): MutableList<<%= table.className %>> {
        //TODO: review generated method
        return selectList("""
            SELECT *
            FROM <%= table.name %> <%
    if (table.deactivableColumn) { %>
            WHERE <%= table.deactivableColumn.column_name %> = 1<%
    }
%>
            """,
            { rs -> <%= table.className %>.buildAll(rs) })
    }
<% 
} 
%>
    fun list(
        query: String?,
        page: Int?,
        limit: Int?,
        orderRequest: String?,
        asc: Boolean?): MutableList<<%= table.className %>> {
        //TODO: review generated method

        val orderRequestAndColumn = HashMap<String, String>()

<% 
for (var i in table.columns) { 
    var c = table.columns[i]; 
    if (c.smartType != "password") {
%>
        orderRequestAndColumn.put("<%= c.column_name %>", "<%= table.name %>.<%= c.column_name %>")<% 
    }
} 
%>
        val orderColumn = orderRequestAndColumn[orderRequest]

        val params = ArrayList<Any>()
        var where = <% if (table.deactivableColumn) { %>"WHERE <%= table.deactivableColumn.column_name %> = 1 "<% } else { %>""<% } %>

        if (!Strings.isNullOrEmpty(query)) {
            where += ("""
                <%= table.deactivableColumn ? 'AND' : 'WHERE' %> LOWER(CONCAT(<% 
var colocarVirgula = false;
for (var i in table.columns) { 
    var c = table.columns[i]; 
    if (c.smartType != 'password') {
%><%= colocarVirgula ? ',' : '' %>
                IFNULL(<%= table.name %>.<%= c.column_name %>, '')<% 
        colocarVirgula = true;
    }
} 
%>
                )) LIKE LOWER(?)
                """)
            params.add("%$query%")
        }

        var limitQuery = ""
        if (page != null && limit != null) {
            limitQuery = "LIMIT ?, ? "
            params.add(page * limit)
            params.add(limit)
        }

        return selectList("""
            SELECT *
            FROM <%= table.name %>
            $where
            ${(if (orderColumn != null && asc != null) "ORDER BY " + orderColumn + " " + (if (asc) "ASC " else "DESC ") else "")}
            $limitQuery
            """,
            { rs -> <%= table.className %>.buildAll(rs) }, 
            *params.toTypedArray())
    }
    
    fun count(): Int? {
        //TODO: review generated method
        return selectFirstInt("""
            SELECT COUNT(<%= table.primaryColumns[0].column_name %>)
            FROM <%= table.name %><%
if (table.deactivableColumn) { %>
            WHERE <%= table.deactivableColumn.column_name %> = 1<%
}
%>
            """)
    }
    
    fun count(search: String?): Int? {
        //TODO: review generated method
        return selectFirstInt("""
            SELECT COUNT(<%= table.primaryColumns[0].column_name %>)
            FROM <%= table.name %>
            WHERE LOWER(CONCAT(<% 
var colocarVirgula = false;
for (var i in table.columns) { 
    var c = table.columns[i]; 
    if (c.smartType != 'password') {
%><%= colocarVirgula ? ',' : '' %>
            IFNULL(<%= table.name %>.<%= c.column_name %>, '')<% 
        colocarVirgula = true;
    }
} 
%>
            )) LIKE LOWER(?)
            """, 
            "%$search%")
    }
    
    fun update<%= table.className %>(<%= table.classLowerCamel %>: <%= table.className %>): Int {
        //TODO: review generated method
        return update("""
            UPDATE <%= table.name %> SET<% 
var colocarVirgula = false;
for (var i in table.columns) { 
    var c = table.columns[i]; 
    if (c.extra !== 'auto_increment' && c.column_key != 'PRI' && c.smartType != 'createTime') {
        if (c.smartType === 'password') {
%><%= colocarVirgula ? ',' : '' %>
            <%= c.column_name %> = IF(? IS NOT NULL, SHA2(?, 256), <%= c.column_name %>)<%
        } else if (c.smartType == 'updateTime') {
%><%= colocarVirgula ? ',' : '' %>
            <%= c.column_name %> = NOW()<%
        } else {
%><%= colocarVirgula ? ',' : '' %>
            <%= c.column_name %> = ?<% 
        }
        colocarVirgula = true;
    }
} 
%>
            WHERE <%= table.primaryColumns[0].column_name %> = ?<% 
for (var j = 1; j < table.primaryColumns.length; j++) { 
%>
            AND <%= table.primaryColumns[j].column_name %> = ?<%
}
        %>
            """,<% 
for (var i in table.columns) { 
    var c = table.columns[i]; 
    if (c.extra !== "auto_increment" && c.column_key != "PRI" && c.smartType != "createTime" && c.smartType != "updateTime") { 
%>
            <%= table.classLowerCamel %>.<%= c.propertyName %>, <% if (c.smartType === "password") { %><%= table.classLowerCamel %>.<%= c.propertyName %>,<% } %><% 
    }
} 
%>
            <%= table.classLowerCamel %>.<%= table.primaryColumns[0].propertyName %><%
for (var j = 1; j < table.primaryColumns.length; j++) { 
            %>,
            <%= table.classLowerCamel %>.<%= table.primaryColumns[j].propertyName %><%
}
            %>).affectedRows
    }
    
    fun insert(<%= table.classLowerCamel %>: <%= table.className %>): Long {
        //TODO: review generated method
        return update("""
            INSERT INTO <%= table.name %> (<% 
var colocarVirgula = false;
for (var i in table.columns) { 
    var c = table.columns[i]; 
    if (c.extra !== 'auto_increment' && c.smartType != 'updateTime') { 
%><%= colocarVirgula ? ',' : '' %>
            <%= c.column_name %><% 
        colocarVirgula = true;
    }
} 
%>
            ) VALUES (
            <% 
var colocarVirgula = false;
for (var i in table.columns) { 
    var c = table.columns[i]; 
    if (c.extra !== 'auto_increment' && c.smartType != 'updateTime') { 
        %><%= colocarVirgula ? ',' : '' %><%
        if (c.smartType ===  'password') {
            %>SHA2(?, 256)<% 
        } else if (c.smartType == 'createTime') {
            %>NOW()<% 
        } else {
            %>?<% 
        }
        colocarVirgula = true;
    }
} 
%>
            )
            """,<% 
var colocarVirgula = false;
for (var i in table.columns) { 
    var c = table.columns[i]; 
    if (c.extra !== "auto_increment" && c.smartType != "createTime" && c.smartType != "updateTime") { 
%><%= colocarVirgula ? ',' : '' %>
            <%= table.classLowerCamel %>.<%= c.propertyName %><% 
        colocarVirgula = true;
    }
} 
        %>).key
    }
<% 
if (table.primaryColumns.length > 1 || table.primaryColumns[0].referencedTable) { 
%>
    fun exist<%= table.className %>(<% 
    for (var k in table.primaryColumns) {
        %><%= k > 0 ? ', ' : '' %><%= table.primaryColumns[k].propertyName %>: Long<%
    } %>): Boolean {
        //TODO: review generated method
        return exist("""
            SELECT <%= table.primaryColumns[0].column_name %> FROM <%= table.name %>
            WHERE <%= table.primaryColumns[0].column_name %> = ?<% 
        for (var j = 1; j < table.primaryColumns.length; j++) { %>
            AND <%= table.primaryColumns[j].column_name %> = ?<%
        }%>
            """<%       
        for (var k in table.primaryColumns) {
            %>, <%= table.primaryColumns[k].propertyName %><%
        } 
        %>)
    }
<% 
} 

for (var i in table.columns) { 
    var c = table.columns[i];

    if (c.column_key === "UNI") {
%>
    fun exist<%= c.propertyNameUpper %>(<%= c.propertyName %>: <%= c.kotlinType %><% 
        for (var k in table.primaryColumns) {
            %>, <%= table.primaryColumns[k].propertyName %>: Long<%
        } %>): Boolean {
        //TODO: review generated method
        return exist("""
            SELECT <%= c.column_name %> FROM <%= table.name %>
            WHERE <%= c.column_name %> = ?<% 
        for (var j = 0; j < table.primaryColumns.length; j++) { 
%>
            AND <%= table.primaryColumns[j].column_name %> != ?<%
        }
%>
            """, 
            <%= c.propertyName %><%
        for (var k in table.primaryColumns) {
            %>, <%= table.primaryColumns[k].propertyName %><%
        } 
        %>)
    }
<%
    }
}

if (table.deactivableColumn) { 
%>
    fun softDelete(<% 
    for (var k in table.primaryColumns) {
        %><%= k > 0 ? ', ' : '' %><%= table.primaryColumns[k].propertyName %>: Long<%
    } %>): Int {
        //TODO: review generated method
        return update("""
            UPDATE <%= table.name %> SET
            <%= table.deactivableColumn.column_name %> = 0
            WHERE <%= table.primaryColumns[0].column_name %> = ?<% 
    for (var j = 1; j < table.primaryColumns.length; j++) { 
%>
            AND <%= table.primaryColumns[j].column_name %> = ?<%
    } %>
            """<%
    for (var k in table.primaryColumns) {
%>,
            <%= table.primaryColumns[k].propertyName %><% 
    } 
        %>).affectedRows
        
    }
<%
}
%>

}
