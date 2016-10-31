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
import br.com.martinlabs.commons.OpResponse;
import br.com.martinlabs.commons.OpResponsePaginado;
import br.com.martinlabs.commons.TransacProcess;
import br.com.martinlabs.commons.exceptions.RespException;
import com.google.common.base.Strings;
import java.util.List;
import br.com.martinlabs.commons.LanguageHolder;
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

    public OpResponse<List<<%= table.className %>>> list(<% if (props.loginsys) { %>
        String token, <% } %>
        String search,
        Integer start,
        Integer length,
        Integer orderColumn,
        String orderDir) throws RespException {
        return open(con -> {<% 
        if (props.loginsys) { %>
            loginS.allowAccess(con, token);
        <% } %>
            <%= table.className %>Dao dao = new <%= table.className %>Dao(con);

            List<<%= table.className %>> list<%= table.className %> = dao.list(search, start, length, orderColumn, orderDir);

            OpResponsePaginado resp = new OpResponsePaginado<>(list<%= table.className %>);

            resp.setQuantidadeTotal(dao.count());
            if (!Strings.isNullOrEmpty(search)) {
                resp.setQuantidadeFiltrada(dao.count(search));
            } else {
                resp.setQuantidadeFiltrada(resp.getQuantidadeTotal());
            }

            return resp;
        });
    }

    public OpResponse<<%= table.className %>Resp> get(long id<% if (props.loginsys) { %>, String token<% } %>) throws RespException {
        return open(con -> {<% 
    if (props.loginsys) { 
    %>
            loginS.allowAccess(con, token);
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

            return new OpResponse<>(resp);
        });
    }

    public OpResponse<Long> persist(<%= table.className %> <%= table.classLowerCamel %><% if (props.loginsys) { %>, String token<% } %>) throws RespException {<% 
for (var i in table.columns) { 
    var c = table.columns[i]; 
    if (c.is_nullable === "NO" && (c.javaType === "String" || c.javaType === "Date")) { 
%>
        if (<%= table.classLowerCamel %>.get<%= c.propertyNameUpper %>() == null) {
            throw new RespException(<%= c.ordinal_position %>,  LanguageHolder.instance.cannotBeNull("<%= c.propertyNatural %>"));
        }<% 
    }

    if (c.javaType === "String") {
        %>
        if (<%= table.classLowerCamel %>.get<%= c.propertyNameUpper %>().length() > <%= c.character_maximum_length %>) {
            throw new RespException(<%= c.ordinal_position %>, LanguageHolder.instance.lengthCannotBeMoreThan("<%= c.propertyNatural %>", <%= c.character_maximum_length %>));
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
                id<%= table.className %> = <%= table.classLowerCamel %>.get<%= table.idColumn.propertyNameUpper %>();
                
                int affectedRows = dao.update(<%= table.classLowerCamel %>);

                if (affectedRows == 0) {
                    throw new RespException(LanguageHolder.instance.unexpectedError());
                }
            } else {
                id<%= table.className %> = dao.insert(<%= table.classLowerCamel %>);
                <%= table.classLowerCamel %>.set<%= table.idColumn.propertyNameUpper %>(id<%= table.className %>);

                if (id<%= table.className %> == 0) {
                    throw new RespException(LanguageHolder.instance.unexpectedError());
                }
            }

        <% for (var i in table.NtoNcolumns) { var col = table.NtoNcolumns[i]; %>
            <%= col.NtoNtable.className %>Dao <%= col.NtoNtable.classLowerCamel %>Dao = new <%= col.NtoNtable.className %>Dao(con);
        
            <%= col.NtoNtable.classLowerCamel %>Dao.removeAllFrom<%= table.className %>(id<%= table.className %>);
            
            if (<%= table.classLowerCamel %>.get<%= col.NtoNtable.className %>() != null) {
                for (<%= col.otherTable.className %> <%= col.otherTable.classLowerCamel %> : <%= table.classLowerCamel %>.get<%= col.NtoNtable.className %>()) {
                    int affectedRows = <%= col.NtoNtable.classLowerCamel %>Dao.insert(<%= col.otherTable.classLowerCamel %>.get<%= col.otherTable.idColumn.propertyNameUpper %>(), id<%= table.className %>);
                    
                    if (affectedRows == 0) {
                        throw new RespException(LanguageHolder.instance.unexpectedError());
                    }
                }
            }
        <% } %>

            return new OpResponse<>(id<%= table.className %>);
        });
    }

}
