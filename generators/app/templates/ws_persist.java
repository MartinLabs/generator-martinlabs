package <%= props.wsPackage %>;

import <%= props.modelPackage %>.<%= table.className %>;
import <%= props.processPackage %>.<%= table.className %>Process;
import br.com.martinlabs.commons.exceptions.RespException;
import br.com.martinlabs.commons.ServletWrapper;
import javax.servlet.annotation.WebServlet;

/**
 *
 * @author gil
 */
@WebServlet("/<%= props.modulenameUpper %>/Persist<%= table.className %>")
public class Persist<%= table.className %>Servlet extends ServletWrapper {

    @Override
    protected Object process(ServletContent content) throws RespException {
    	return new <%= table.className %>Process().persist(content.getBody(<%= table.className %>.class)<% if (props.loginsys) { %>, content.request<% } %>);
    }
    
}