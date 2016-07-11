package <%= props.processPackage %>;

import <%= props.modelPackage %>.<%= table.className %>;
import <%= props.responsePackage %>.<%= table.className %>Resp;
import <%= props.daoPackage %>.<%= table.className %>Dao;<% 
var antiRepeat = [];
for (var i in table.columns) { 
    var c = table.columns[i]; 
    if (c.referencedTable && antiRepeat.indexOf(c.referencedTable.className) < 0) {
        antiRepeat.push(c.referencedTable.className);
%>
import <%= props.daoPackage %>.<%= c.referencedTable.className %>Dao;<%
    }
}
%>
<% for (var i in table.NtoNcolumns) { var c = table.NtoNcolumns[i]; %>
import <%= props.daoPackage %>.<%= c.NtoNtable.className %>Dao;<% } %>
import br.com.martinlabs.commons.OpResponse;
import br.com.martinlabs.commons.TransacProcess;
import br.com.martinlabs.commons.exceptions.RespException;
import java.util.List;
/**
 *
 * @author martinlabs CRUD generator
 */
public class <%= table.className %>Process extends TransacProcess {
<% if (props.loginsys) { %>
    LoginServices loginS = new LoginServices();
<% } %>
    public <%= table.className %>Process() {
        super("<%= props.datasource %>");
    }

    public OpResponse<List<<%= table.className %>>> list(<% if (props.loginsys) { %>String token<% } %>) throws RespException {
        return open(con -> {<% 
        if (props.loginsys) { %>
            loginS.allowAccess(con, token);
        <% } %>
            <%= table.className %>Dao dao = new <%= table.className %>Dao(con);

            return new OpResponse<>(dao.list());
        });
    }

    public OpResponse<<%= table.className %>Resp> get(long id<% if (props.loginsys) { %>, String token<% } %>) throws RespException {
        return open(con -> {<% 
        if (props.loginsys) { %>
            loginS.allowAccess(con, token);
        <% } %>
            <%= table.className %>Dao <%= table.classLowerCamel %>Dao = new <%= table.className %>Dao(con);<% 

    antiRepeat = [];
    for (var i in table.columns) { 
        var c = table.columns[i]; 
        if (c.referencedTable && antiRepeat.indexOf(c.referencedTable.className) < 0) {
            antiRepeat.push(c.referencedTable.className);
    %>
            <%= c.referencedTable.className %>Dao <%= c.referencedTable.classLowerCamel %>Dao = new <%= c.referencedTable.className %>Dao(con);<%
        }
    }
    %>
            <%= table.className %>Resp resp = new <%= table.className %>Resp();

            if (id > 0) {
                resp.set<%= table.className %>(<%= table.classLowerCamel %>Dao.get(id));
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
    %>

            return new OpResponse<>(resp);
        });
    }

    public OpResponse<Long> persist(<%= table.className %> <%= table.classLowerCamel %><% for (var i in table.NtoNcolumns) { %>, List<Long> ids<%= table.NtoNcolumns[i].otherTable.className %><% } %><% if (props.loginsys) { %>, String token<% } %>) throws RespException {<% 
for (var i in table.columns) { 
    var c = table.columns[i]; 
    if (c.is_nullable === "NO" && (c.javaType === "String" || c.javaType === "Date")) { 
%>
        if (<%= table.classLowerCamel %>.get<%= c.propertyNameUpper %>() == null) {
            throw new RespException(<%= c.ordinal_position %>,  LanguageFactory.getInstance().cannotBeNull("<%= c.propertyNameUpper %>"));
        }<% 
    }

    if (c.javaType === "String") {
        %>
        if (<%= table.classLowerCamel %>.get<%= c.propertyNameUpper %>().length() > <%= c.character_maximum_length %>) {
            throw new RespException(<%= c.ordinal_position %>, LanguageFactory.getInstance().lengthCannotBeMoreThan("<%= c.propertyNameUpper %>", <%= c.character_maximum_length %>));
        }<%
    }
} %>

        return open(con -> {<% 
        if (props.loginsys) { %>
            loginS.allowAccess(con, token);
        <% } %>
            <%= table.className %>Dao dao = new <%= table.className %>Dao(con);

            long id<%= table.className %>;
            if (<%= table.classLowerCamel %>.get<%= table.idColumn.propertyNameUpper %>() > 0) {
                id<%= table.className %> = dao.update(<%= table.classLowerCamel %>);
            } else {
                id<%= table.className %> = dao.insert(<%= table.classLowerCamel %>);
                <%= table.classLowerCamel %>.set<%= table.idColumn.propertyNameUpper %>(id<%= table.className %>);
            }

            if (id<%= table.className %> == 0) {
                throw new RespException(LanguageFactory.getInstance().unexpectedError());
            }

        <% for (var i in table.NtoNcolumns) { var col = table.NtoNcolumns[i]; %>
            <%= col.NtoNtable.className %>Dao <%= col.NtoNtable.classLowerCamel %>Dao = new <%= col.NtoNtable.className %>Dao(con);
        
            <%= col.NtoNtable.classLowerCamel %>Dao.removeAllFrom<%= table.className %>(id<%= table.className %>);
            
            if (ids<%= col.otherTable.className %> != null) {
                for (Long id<%= col.otherTable.className.charAt(0) %> : ids<%= col.otherTable.className %>) {
                    int affectedRows = <%= col.NtoNtable.classLowerCamel %>Dao.insert(id<%= col.otherTable.className.charAt(0) %>, id<%= table.className %>);
                    
                    if (affectedRows == 0) {
                        throw new RespException(LanguageFactory.getInstance().unexpectedError());
                    }
                }
            }
        <% } %>

            return new OpResponse<>(id<%= table.className %>);
        });
    }

}
