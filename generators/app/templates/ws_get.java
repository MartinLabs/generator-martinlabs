package <%= props.wsPackage %>;

import <%= props.processPackage %>.<%= table.className %>Process;
import br.com.martinlabs.commons.exceptions.RespException;
import br.com.martinlabs.commons.ServletWrapper;
import javax.servlet.annotation.WebServlet;

/**
 *
 * @author gil
 */
@WebServlet("/Crud/Get<%= table.className %>")
public class Get<%= table.className %>Servlet extends ServletWrapper {

    @Override
    protected Object process(ServletContent content) throws RespException {
    	return new <%= table.className %>Process().get(content.getParamLong("id")<% if (props.loginsys) { %>, content.request<% } %>);
    }
    
}