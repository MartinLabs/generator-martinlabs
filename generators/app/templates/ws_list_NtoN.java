package <%= props.wsPackage %>;

import <%= props.processPackage %>.<%= table.className %>Process;
import br.com.martinlabs.commons.exceptions.RespException;
import br.com.martinlabs.commons.ServletWrapper;
import javax.servlet.annotation.WebServlet;

/**
 *
 * @author gil
 */
@WebServlet("/<%= props.modulenameUpper %>/List<%= column.referencedTable.className %>From<%= table.className %>")
public class List<%= column.referencedTable.className %>From<%= table.className %>Servlet extends ServletWrapper {

    @Override
    protected Object process(ServletContent content) throws RespException {
    	return new <%= table.className %>Process().list<%= column.referencedTable.className %>Of<%= otherColumn.referencedTable.className %>(content.getParamLong("<%= otherColumn.propertyName %>")<% if (props.loginsys) { %>, content.getParamString("token")<% } %>);
    }
    
}