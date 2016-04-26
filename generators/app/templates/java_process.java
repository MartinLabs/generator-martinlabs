package <%= props.processPackage %>;

import <%= props.modelPackage %>.<%= table.className %>;
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

    public OpResponse<<%= table.className %>> get(long id<% if (props.loginsys) { %>, String token<% } %>) throws RespException {
    	return open(con -> {
        <% if (props.loginsys) { %>
            loginS.allowAccess(con, token);
        <% } %>

    		<%= table.className %>Dao dao = new <%= table.className %>Dao(con);

    		return new OpResponse<>(dao.get(id));
    	});
    }

    public OpResponse<List<<%= table.className %>>> list(<% if (props.loginsys) { %>String token<% } %>) throws RespException {
    	return open(con -> {
        <% if (props.loginsys) { %>
            loginS.allowAccess(con, token);
        <% } %>
    		<%= table.className %>Dao dao = new <%= table.className %>Dao(con);

    		return new OpResponse<>(dao.list());
    	});
    }

    public OpResponse<Long> persist(<%= table.className %> obj<% if (props.loginsys) { %>, String token<% } %>) throws RespException {
    	<% 
    		for (var i in table.columns) { 
	    		var c = table.columns[i]; 
	    		if (c.is_nullable === "NO" && (c.javaType === "String" || c.javaType === "Date")) { 
		%>
        if (obj.get<%= c.propertyNameUpper %>() == null) {
        	throw new RespException(<%= c.ordinal_position %>,  LanguageFactory.getInstance().cannotBeNull("<%= c.propertyNameUpper %>"));
        }
    	<% 
                }

                if (c.javaType === "String") {
        %>

        if (obj.get<%= c.propertyNameUpper %>().length() > <%= c.character_maximum_length %>) {
            throw new RespException(<%= c.ordinal_position %>, LanguageFactory.getInstance().lengthCannotBeMoreThan("<%= c.propertyNameUpper %>", <%= c.character_maximum_length %>));
        }
        <%
                }
            } 
        %>

    	return open(con -> {
        <% if (props.loginsys) { %>
            loginS.allowAccess(con, token);
        <% } %>
    		<%= table.className %>Dao dao = new <%= table.className %>Dao(con);

    		long resp = 0;
    		if (obj.get<%= table.idColumn.propertyNameUpper %>() > 0) {
    			resp = dao.update(obj);
    		} else {
    			resp = dao.insert(obj);
    		}

            if (resp == 0) {
                throw new RespException(LanguageFactory.getInstance().unexpectedError());
            }

    		return new OpResponse<>(resp);
    	});
    }

}
