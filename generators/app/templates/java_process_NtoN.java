package <%= props.processPackage %>;
<% for (var i in table.columns) { var c = table.columns[i]; %>
import <%= props.modelPackage %>.<%= c.referencedTable.className %>;<% } %>
import <%= props.daoPackage %>.<%= table.className %>Dao;
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

    <% 
    var c = table.columns[0];
    var other = table.columns[1];
    %>
    public OpResponse<List<<%= c.referencedTable.className %>>> list<%= c.referencedTable.className %>Of<%= other.referencedTable.className %>(long <%= other.propertyName %><% if (props.loginsys) { %>, String token<% } %>) throws RespException {
        return open(con -> {<% 
        if (props.loginsys) { %>
            loginS.allowAccess(con, token);
        <% } %>
            <%= table.className %>Dao dao = new <%= table.className %>Dao(con);

            return new OpResponse<>(dao.list<%= c.referencedTable.className %>Of<%= other.referencedTable.className %>(<%= other.propertyName %>));
        });
    } 
    <% 
    c = table.columns[1];
    other = table.columns[0];
    %>
    public OpResponse<List<<%= c.referencedTable.className %>>> list<%= c.referencedTable.className %>Of<%= other.referencedTable.className %>(long <%= other.propertyName %><% if (props.loginsys) { %>, String token<% } %>) throws RespException {
        return open(con -> {<% 
        if (props.loginsys) { %>
            loginS.allowAccess(con, token);
        <% } %>
            <%= table.className %>Dao dao = new <%= table.className %>Dao(con);

            return new OpResponse<>(dao.list<%= c.referencedTable.className %>Of<%= other.referencedTable.className %>(<%= other.propertyName %>));
        });
    }

}
