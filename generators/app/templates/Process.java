package <%= props.processPackage %>;

import <%= props.modelPackage %>.<%= table.className %>;<% 
var antiRepeat = [];
for (var i in table.NtoNcolumns) { 
    var cn = table.NtoNcolumns[i]; 
    if (cn != null && antiRepeat.indexOf(cn.otherTable.className) < 0) {
        antiRepeat.push(cn.otherTable.className);
%>
import <%= props.modelPackage %>.<%= cn.otherTable.className %>;<%
    }
}
%>
import <%= props.responsePackage %>.<%= table.className %>Resp;
import <%= props.daoPackage %>.<%= table.className %>Dao;<% 
antiRepeat = [];
for (var i in table.columns) { 
    var c = table.columns[i]; 
    if (c.referencedTable && antiRepeat.indexOf(c.referencedTable.className) < 0) {
        antiRepeat.push(c.referencedTable.className);
%>
import <%= props.daoPackage %>.<%= c.referencedTable.className %>Dao;<%
    }
}
antiRepeat = [];
for (var i in table.NtoNcolumns) { 
    var c = table.NtoNcolumns[i]; 
    if (antiRepeat.indexOf(c.otherTable.className) < 0) {
        antiRepeat.push(c.otherTable.className);
%>
import <%= props.daoPackage %>.<%= c.NtoNtable.className %>Dao;
import <%= props.daoPackage %>.<%= c.otherTable.className %>Dao;<% 
    }
} 
%>
import br.com.martinlabs.commons.exceptions.RespException;
import com.google.common.base.Strings;
import java.util.List;
import br.com.martinlabs.commons.LanguageHolder;
import br.com.martinlabs.commons.PagedResp;
import java.sql.Connection;

/**
 *
 * @author martinlabs CRUD generator
 */
public class <%= table.className %>Process {

    private Connection con;<% 
if (props.loginsys) { %>
    private LoginServices loginS;
<% } %>
    public <%= table.className %>Process(Connection con) {
        this.con = con;<% 
if (props.loginsys) { %>
        loginS = new LoginServices(con);
<% } %>
    }

    public PagedResp<<%= table.className %>> list(<% if (props.loginsys) { %>
        String token, <% } %>
        String query,
        Integer page,
        Integer limit,
        String orderRequest,
        Boolean asc) {
        
        if (page == null) {
            throw new RespException(1,  LanguageHolder.instance.cannotBeNull("Page"));
        }
        
        if (limit == null) {
            throw new RespException(2,  LanguageHolder.instance.cannotBeNull("Limit"));
        }
        
    <% if (props.loginsys) { %>
        loginS.allowAccess(token);
    <% } %>
        <%= table.className %>Dao dao = new <%= table.className %>Dao(con);

        List<<%= table.className %>> list<%= table.className %> = dao.list(query, page, limit, orderRequest, asc);

        PagedResp resp = new PagedResp<>(list<%= table.className %>);

        if (!Strings.isNullOrEmpty(query)) {
            resp.setCount(dao.count(query));
        } else {
            resp.setCount(dao.count());
        }

        return resp;
    }

    public <%= table.className %>Resp get(long id<% if (props.loginsys) { %>, String token<% } %>) {
        
<% if (props.loginsys) { 
%>
        loginS.allowAccess(token);
<% 
}
 
antiRepeat = [];
antiRepeat.push(table.className);
%>
        <%= table.className %>Dao <%= table.classLowerCamel %>Dao = new <%= table.className %>Dao(con);<% 

for (var i in table.columns) { 
    var c = table.columns[i]; 
    if (c.referencedTable && antiRepeat.indexOf(c.referencedTable.className) < 0) {
        antiRepeat.push(c.referencedTable.className);
%>
        <%= c.referencedTable.className %>Dao <%= c.referencedTable.classLowerCamel %>Dao = new <%= c.referencedTable.className %>Dao(con);<%
    }
}

for (var i in table.NtoNcolumns) { 
    var c = table.NtoNcolumns[i]; 
    if (antiRepeat.indexOf(c.otherTable.className) < 0) {
        antiRepeat.push(c.otherTable.className);
%>
        <%= c.NtoNtable.className %>Dao <%= c.NtoNtable.classLowerCamel %>Dao = new <%= c.NtoNtable.className %>Dao(con);
        <%= c.otherTable.className %>Dao <%= c.otherTable.classLowerCamel %>Dao = new <%= c.otherTable.className %>Dao(con);<%
    }
}
%>
        <%= table.className %>Resp resp = new <%= table.className %>Resp();

        if (id > 0) {
            <%= table.className %> <%= table.classLowerCamel %> = <%= table.classLowerCamel %>Dao.get(id);
            resp.set<%= table.className %>(<%= table.classLowerCamel %>);<% 
        for (var i in table.NtoNcolumns) { 
            var c = table.NtoNcolumns[i]; 
        %>
            <%= table.classLowerCamel %>.set<%= c.NtoNtable.className %>(<%= c.NtoNtable.classLowerCamel %>Dao.list<%= c.otherTable.className %>Of<%= table.className %>(id));
        <% 
        } 
        %>
        }<% 

antiRepeat = [];
for (var j in table.columns) { 
    var cx = table.columns[j]; 
    if (cx.referencedTable && antiRepeat.indexOf(cx.referencedTable.className) < 0) {
        antiRepeat.push(cx.referencedTable.className);
%>
        resp.setAll<%= cx.referencedTable.className %>(<%= cx.referencedTable.classLowerCamel %>Dao.list());
<%
    }
}

antiRepeat = [];
for (var j in table.NtoNcolumns) { 
    var cx = table.NtoNcolumns[j]; 
    if (antiRepeat.indexOf(c.otherTable.className) < 0) {
        antiRepeat.push(cx.otherTable.className);
%>
        resp.setAll<%= cx.otherTable.className %>(<%= cx.otherTable.classLowerCamel %>Dao.list());
<%
    }
}
%>

        return resp;
    }

    public Long persist(<%= table.className %> <%= table.classLowerCamel %><% if (props.loginsys) { %>, String token<% } %>) {<% 
for (var i in table.columns) { 
    var c = table.columns[i]; 
    if (c.is_nullable === "NO" && (c.javaType === "String" || c.javaType === "Date")) { 
%>
        if (<%= table.classLowerCamel %>.get<%= c.propertyNameUpper %>() == null) {
            throw new RespException(<%= c.ordinal_position %>,  LanguageHolder.instance.cannotBeNull("<%= c.propertyNatural %>"));
        }<% 
    }

    if (c.javaType === "String") {
        if (c.is_nullable === "NO") {
        %>
        if (<%= table.classLowerCamel %>.get<%= c.propertyNameUpper %>().length() > <%= Math.min(65500, c.character_maximum_length) %>) {
            throw new RespException(<%= c.ordinal_position %>, LanguageHolder.instance.lengthCannotBeMoreThan("<%= c.propertyNatural %>", <%= Math.min(65500, c.character_maximum_length) %>));
        }<%
        } else {
        %>
        if (<%= table.classLowerCamel %>.get<%= c.propertyNameUpper %>() != null && <%= table.classLowerCamel %>.get<%= c.propertyNameUpper %>().length() > <%= Math.min(65500, c.character_maximum_length) %>) {
            throw new RespException(<%= c.ordinal_position %>, LanguageHolder.instance.lengthCannotBeMoreThan("<%= c.propertyNatural %>", <%= Math.min(65500, c.character_maximum_length) %>));
        }<%
        }
    }

    if (c.referencedTable && c.is_nullable === "NO") {
%>
        if (<%= table.classLowerCamel %>.get<%= c.propertyNameUpper %>() == 0) {
            throw new RespException(<%= c.ordinal_position %>,  LanguageHolder.instance.cannotBeNull("<%= c.propertyNatural %>"));
        }<% 
    }
} %>

    <% if (props.loginsys) { %>
        loginS.allowAccess(token);
    <% } %>
        <%= table.className %>Dao dao = new <%= table.className %>Dao(con);

        <% if (!table.idColumn.referencedTable) { %>
            long id<%= table.className %>;
            if (<%= table.classLowerCamel %>.get<%= table.idColumn.propertyNameUpper %>() > 0) {
                id<%= table.className %> = <%= table.classLowerCamel %>.get<%= table.idColumn.propertyNameUpper %>();
                
                dao.update(<%= table.classLowerCamel %>);
            } else {
                id<%= table.className %> = dao.insert(<%= table.classLowerCamel %>);
                <%= table.classLowerCamel %>.set<%= table.idColumn.propertyNameUpper %>(id<%= table.className %>);
            }
        <% } else { %>
            long id<%= table.className %> = <%= table.classLowerCamel %>.get<%= table.idColumn.propertyNameUpper %>();
            boolean exist = dao.exist<%= table.className %>(id<%= table.className %>);
            if (exist) {
                dao.update(<%= table.classLowerCamel %>);
            } else {
                dao.insert(<%= table.classLowerCamel %>);
            }
        <% } %>

    <% for (var i in table.NtoNcolumns) { var col = table.NtoNcolumns[i]; %>
        <%= col.NtoNtable.className %>Dao <%= col.NtoNtable.classLowerCamel %>Dao = new <%= col.NtoNtable.className %>Dao(con);
    
        <%= col.NtoNtable.classLowerCamel %>Dao.removeAllFrom<%= table.className %>(id<%= table.className %>);
        
        if (<%= table.classLowerCamel %>.get<%= col.NtoNtable.className %>() != null) {
            for (<%= col.otherTable.className %> <%= col.otherTable.classLowerCamel %> : <%= table.classLowerCamel %>.get<%= col.NtoNtable.className %>()) {<% 
                if (col.NtoNtable.columns[0].referencedTable.className === table.className) { %>
                <%= col.NtoNtable.classLowerCamel %>Dao.insert(id<%= table.className %>, <%= col.otherTable.classLowerCamel %>.get<%= col.otherTable.idColumn.propertyNameUpper %>());<% 
                } else { %>
                <%= col.NtoNtable.classLowerCamel %>Dao.insert(<%= col.otherTable.classLowerCamel %>.get<%= col.otherTable.idColumn.propertyNameUpper %>(), id<%= table.className %>);<% 
                } %>
            }
        }
    <% } %>

        return id<%= table.className %>;
    }

}
