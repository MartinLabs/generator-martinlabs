package <%= props.wsPackage %>;

import <%= props.processPackage %>.<%= table.className %>Process;
import br.com.martinlabs.commons.exceptions.RespException;
import br.com.martinlabs.commons.ServletWrapper;
import javax.servlet.annotation.WebServlet;

/**
 *
 * @author gil
 */
@WebServlet("/Crud/List<%= table.className %>")
public class List<%= table.className %>Servlet extends ServletWrapper {

    @Override
    protected Object process(ServletContent content) throws RespException {
    	return new <%= table.className %>Process().list(<% if (props.loginsys) { %>content.request<% } %>);
    }
    
}