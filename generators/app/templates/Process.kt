package <%= props.processPackage %>

import <%= props.modelPackage %>.<%= table.className %><% 
var antiRepeat = [];
for (var i in table.NtoNcolumns) { 
    var cn = table.NtoNcolumns[i]; 
    if (cn != null && antiRepeat.indexOf(cn.otherTable.className) < 0) {
        antiRepeat.push(cn.otherTable.className);
%>
import <%= props.modelPackage %>.<%= cn.otherTable.className %><%
    }
}
%>
import <%= props.responsePackage %>.<%= table.className %>Resp
import <%= props.daoPackage %>.<%= table.className %>Dao<% 
antiRepeat = [];
for (var i in table.columns) { 
    var c = table.columns[i]; 
    if (c.referencedTable && antiRepeat.indexOf(c.referencedTable.className) < 0) {
        antiRepeat.push(c.referencedTable.className);
%>
import <%= props.daoPackage %>.<%= c.referencedTable.className %>Dao<%
    }
}
antiRepeat = [];
for (var i in table.NtoNcolumns) { 
    var c = table.NtoNcolumns[i]; 
    if (antiRepeat.indexOf(c.otherTable.className) < 0) {
        antiRepeat.push(c.otherTable.className);
%>
import <%= props.daoPackage %>.<%= c.NtoNtable.className %>Dao
import <%= props.daoPackage %>.<%= c.otherTable.className %>Dao<% 
    }
} 
%>
import com.google.common.base.Strings
import com.simpli.model.LanguageHolder
import com.simpli.model.PagedResp
import com.simpli.model.RespException
import java.sql.Connection

/**
 * <%= table.className %> business logic
 * @author martinlabs CRUD generator
 */
class <%= table.className %>Process(private val con: Connection, private val lang: LanguageHolder, private val clientVersion: String) {

    private val loginS = LoginServices(con, lang, clientVersion)

    fun list(
        token: String?, 
        queryP: String?,
        page: Int?,
        limit: Int?,
        orderRequest: String?,
        asc: Boolean?): PagedResp<<%= table.className %>> {
        //TODO: review generated method
        var query = queryP
        
        if (query != null) {
            query = query.replace("[.,:\\-\\/]".toRegex(), "")
        }

        loginS.allowAccess(token)

        val dao = <%= table.className %>Dao(con, lang)

        val list<%= table.className %> = dao.list(query, page, limit, orderRequest, asc)

        val resp = PagedResp(list<%= table.className %>)

        if (!Strings.isNullOrEmpty(query)) {
            dao.count(query)?.let {
                count -> resp.recordsTotal = count
            }
        } else {
            dao.count()?.let{
                count -> resp.recordsTotal = count
            }
        }

        return resp
    }

    fun getOne(<% 
for (var k in table.primaryColumns) {
    %><%= k > 0 ? ', ' : '' %><%= table.primaryColumns[k].propertyName %>: Long?<%
} 
    %>, token: String?): <%= table.className %>Resp {
        //TODO: review generated method
        loginS.allowAccess(token)
<% 
antiRepeat = [];
antiRepeat.push(table.className);
%>
        val <%= table.classLowerCamel %>Dao = <%= table.className %>Dao(con, lang)<% 
for (var i in table.columns) { 
    var c = table.columns[i]; 
    if (c.referencedTable && antiRepeat.indexOf(c.referencedTable.className) < 0) {
        antiRepeat.push(c.referencedTable.className);
%>
        val <%= c.referencedTable.classLowerCamel %>Dao = <%= c.referencedTable.className %>Dao(con, lang)<%
    }
}

for (var i in table.NtoNcolumns) { 
    var c = table.NtoNcolumns[i]; 
    if (antiRepeat.indexOf(c.otherTable.className) < 0) {
        antiRepeat.push(c.otherTable.className);
%>
        val <%= c.NtoNtable.classLowerCamel %>Dao = <%= c.NtoNtable.className %>Dao(con, lang)
        val <%= c.otherTable.classLowerCamel %>Dao = <%= c.otherTable.className %>Dao(con, lang)<%
    }
}
%>
        val resp = <%= table.className %>Resp()

        if (<% 
for (var k in table.primaryColumns) {
                %><%- k > 0 ? ' && ' : '' %><%= table.primaryColumns[k].propertyName %> != null && <%= table.primaryColumns[k].propertyName %> > 0<%
} 
            %>) {
            val <%= table.classLowerCamel %> = <%= table.classLowerCamel %>Dao.getOne(<% 
for (var k in table.primaryColumns) {
                %><%= k > 0 ? ', ' : '' %><%= table.primaryColumns[k].propertyName %><%
} 
            %>)<%
if (table.NtoNcolumns && table.NtoNcolumns.length) { %>
            if (<%= table.classLowerCamel %> != null) {<% 
    for (var i in table.NtoNcolumns) { 
        var c = table.NtoNcolumns[i]; 
%>
                <%= table.classLowerCamel %>.<%= c.NtoNtable.classLowerCamel %> = <%= c.NtoNtable.classLowerCamel %>Dao.list<%= c.otherTable.className %>Of<%= table.className %>(<% 
        for (var k in table.primaryColumns) {
                    %><%= k > 0 ? ', ' : '' %><%= table.primaryColumns[k].propertyName %><%
        } 
%>)<%
    } %>
            }
<% } %>
            resp.<%= table.classLowerCamel %> = <%= table.classLowerCamel %>
        }<% 
antiRepeat = [];
for (var j in table.columns) { 
    var cx = table.columns[j]; 
    if (cx.referencedTable && antiRepeat.indexOf(cx.referencedTable.className) < 0) {
        antiRepeat.push(cx.referencedTable.className);
%>
        resp.all<%= cx.referencedTable.className %> = <%= cx.referencedTable.classLowerCamel %>Dao.list()
<%
    }
}

antiRepeat = [];
for (var j in table.NtoNcolumns) { 
    var cx = table.NtoNcolumns[j]; 
    if (antiRepeat.indexOf(c.otherTable.className) < 0) {
        antiRepeat.push(cx.otherTable.className);
%>
        resp.all<%= cx.otherTable.className %> = <%= cx.otherTable.classLowerCamel %>Dao.list()
<%
    }
}
%>

        return resp
    }

    fun persist(<%= table.classLowerCamel %>: <%= table.className %>, token: String?): Long? {
        //TODO: review generated method
        loginS.allowAccess(token)

        val dao = <%= table.className %>Dao(con, lang)
<%
for (var i in table.columns) { 
    var c = table.columns[i];
    if (c.column_key === "UNI") {
%>
        if (dao.exist<%= c.propertyNameUpper %>(<%= table.classLowerCamel %>.<%= c.propertyName %><% 
    for (var i in table.primaryColumns) { 
        %>, <%= table.classLowerCamel %>.<%= table.primaryColumns[i].propertyName %><% 
    } %>)) {
            throw RespException(lang.alreadyExist("<%= c.propertyNatural %>"))
        }
<% 
    }
}

if (table.primaryColumns.length < 2 && !table.primaryColumns[0].referencedTable) { 
%>
        val id<%= table.className %>: Long
        if (<%= table.classLowerCamel %>.<%= table.primaryColumns[0].propertyName %> > 0) {
            <%= table.classLowerCamel %>.validate(true, lang)
            id<%= table.className %> = <%= table.classLowerCamel %>.<%= table.primaryColumns[0].propertyName %>
            
            dao.update<%= table.className %>(<%= table.classLowerCamel %>)
        } else {
            <%= table.classLowerCamel %>.validate(false, lang)
            id<%= table.className %> = dao.insert(<%= table.classLowerCamel %>)
            <%= table.classLowerCamel %>.<%= table.primaryColumns[0].propertyName %> = id<%= table.className %>
        }
<% 
} else { 
%>
        val id<%= table.className %> = <%= table.classLowerCamel %>.<%= table.primaryColumns[0].propertyName %>;
        val exist = dao.exist<%= table.className %>(<% 
for (var i in table.primaryColumns) { 
            %><%= i > 0 ? ', ' : '' %><%= table.classLowerCamel %>.<%= table.primaryColumns[i].propertyName %><% 
            } %>);
        if (exist) {
            <%= table.classLowerCamel %>.validate(true, lang)
            dao.update<%= table.className %>(<%= table.classLowerCamel %>)
        } else {
            <%= table.classLowerCamel %>.validate(false, lang)
            dao.insert(<%= table.classLowerCamel %>)
        }
<% 
} 
for (var i in table.NtoNcolumns) { var col = table.NtoNcolumns[i]; 
%>
        val <%= col.NtoNtable.classLowerCamel %>Dao = <%= col.NtoNtable.className %>Dao(con, lang)
    
        <%= col.NtoNtable.classLowerCamel %>Dao.removeAllFrom<%= table.className %>(id<%= table.className %>)
        
        <%= table.classLowerCamel %>.<%= col.NtoNtable.classLowerCamel %>?.let { list ->
            for (<%= col.otherTable.classLowerCamel %> in list) {<% 
                if (col.NtoNtable.columns[0].referencedTable.className === table.className) { %>
                <%= col.NtoNtable.classLowerCamel %>Dao.insert(id<%= table.className %>, <%= col.otherTable.classLowerCamel %>.<%= col.otherTable.primaryColumns[0].propertyName %>)<% 
                } else { %>
                <%= col.NtoNtable.classLowerCamel %>Dao.insert(<%= col.otherTable.classLowerCamel %>.<%= col.otherTable.primaryColumns[0].propertyName %>, id<%= table.className %>)<% 
                } %>
            }
        }
<% 
} 
%>
        return id<%= table.className %>
    }
<% if (table.deactivableColumn) { %>
    fun remove(<% 
    for (var k in table.primaryColumns) { %>
        <%= table.primaryColumns[k].propertyName %>: Long?,<%
    } 
%>
        token: String?) {
        //TODO: review generated method
        loginS.allowAccess(token)
        val <%= table.classLowerCamel %>Dao = <%= table.className %>Dao(con, lang)

        if (<%= table.primaryColumns[k].propertyName %> == null) {
            throw RespException(lang.cannotBeNull("id"))
        }

            
        <%= table.classLowerCamel %>Dao.softDelete(<% 
    for (var k in table.primaryColumns) {
        %><%= k > 0 ? ', ' : '' %><%= table.primaryColumns[k].propertyName %><%
    } 
                %>)
    }
<% } %>
}
