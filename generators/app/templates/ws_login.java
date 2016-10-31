package <%= props.wsPackage %>;

import <%= props.processPackage %>.LoginServices;
import br.com.martinlabs.commons.ServletContent;
import br.com.martinlabs.commons.exceptions.RespException;
import br.com.martinlabs.commons.ServletWrapper;
import javax.servlet.annotation.WebServlet;

/**
 *
 * @author gil
 */
@WebServlet("/<%= props.modulenameUpper %>/Login")
public class LoginServlet extends ServletWrapper {

    @Override
    protected Object process(ServletContent content) throws RespException {
    	LoginRequest reqBody = content.getBody(LoginRequest.class);
    	return new LoginServices().login(reqBody.Account, reqBody.Password);
    }

    private class LoginRequest {
        String Account;
        String Password;
    }
    
}