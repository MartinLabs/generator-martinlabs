package <%= props.wsPackage %>;

import <%= props.modelPackage %>.<%= table.className %>;
import <%= props.processPackage %>.<%= table.className %>Process;
import br.com.martinlabs.commons.exceptions.RespException;
import br.com.martinlabs.commons.ServletWrapper;
import javax.servlet.annotation.WebServlet;
import java.util.List;

/**
 *
 * @author gil
 */
@WebServlet("/<%= props.modulenameUpper %>/Persist<%= table.className %>")
public class Persist<%= table.className %>Servlet extends ServletWrapper {

    @Override
    protected Object process(ServletContent content) throws RespException {
    	RequestBody reqBody = content.getBody(RequestBody.class);
    	return new <%= table.className %>Process().persist(reqBody.<%= table.classLowerCamel %><% if (props.loginsys) { %>, reqBody.token<% } %>);
    }
    
    private class RequestBody {
        <% if (props.loginsys) { %> public String token; <% } %>
        public <%= table.className %> <%= table.classLowerCamel %>;
    }
    
}