package <%= props.wsPackage %>;

import <%= props.processPackage %>.<%= table.className %>Process;
import br.com.martinlabs.commons.exceptions.RespException;
import br.com.martinlabs.commons.ServletWrapper;
import javax.servlet.annotation.WebServlet;

/**
 *
 * @author gil
 */
@WebServlet("/<%= props.modulenameUpper %>/List<%= table.className %>")
public class List<%= table.className %>Servlet extends ServletWrapper {

    @Override
    protected Object process(ServletContent content) throws RespException {
    	return new <%= table.className %>Process().list(<% if (props.loginsys) { %>
    		content.getParamString("token"),<% } %>
    		content.getParamString("search"),
            content.getParamInteger("start"),
            content.getParamInteger("length"),
            content.getParamInteger("orderColumn"),
            content.getParamString("orderDir"));
    }
    
}