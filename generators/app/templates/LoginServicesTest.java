package <%= processPackage %>;

import br.com.martinlabs.commons.DaoUnitTestWrapper;
import br.com.martinlabs.commons.SecurityUtils;
import br.com.martinlabs.commons.exceptions.RespException;
import java.sql.Connection;
import java.sql.SQLException;
import javax.naming.NamingException;
import org.junit.Before;
import org.junit.Test;
import static org.junit.Assert.*;

/**
 *
 * @author martinlabs CRUD generator
 */
public class LoginServicesTest extends DaoUnitTestWrapper {
    
    private LoginServices subject;
    private String token;
    
    public LoginServicesTest() throws NamingException, SQLException {
        super("<%= datasource %>", "<%= database %>");
        Connection con = getConnection();
        subject = new LoginServices(con);
        token = subject.loginToToken("user@gmail.com", SecurityUtils.sha1("abcabc"));
    }

    @Test(expected = RespException.class)
    public void testLoginFail() {
        String result = subject.login(null, null);
    }

    @Test
    public void testLogin() {
        String result = subject.login("user@gmail.com", SecurityUtils.sha1("abcabc"));
        assertEquals(token, 
                result);
    }

    @Test(expected = RespException.class)
    public void testAllowAccessFail() {
        subject.allowAccess("Hey");
    }

    @Test
    public void testAllowAccess() {
        subject.allowAccess(token);
    }
    
    @Test
    public void testCheckLoginFail() {
        boolean result = subject.checkLogin(null, null);
        assertFalse(result);
    }
    
    @Test
    public void testCheckLogin() {
        boolean result = subject.checkLogin("user@gmail.com", SecurityUtils.sha1("abcabc"));
        assertTrue(result);
    }

    @Test
    public void testCheckLoginWithTokenFail() {
        boolean result = subject.checkLogin("Hey");
        assertFalse(result);
    }

    @Test
    public void testCheckLoginWithTokenNull() {
        boolean result = subject.checkLogin(null);
        assertFalse(result);
    }

    @Test
    public void testCheckLoginWithTokenBadEncrypt() {
        boolean result = subject.checkLogin("false1gVip%2F%2BZO6aFvq6tpp4oXeTQmLGT8IoF3OeBG9jg68bDsymZADOdbg%2Br9pwg3fdDitNU1lbc4uRD7uiDiKYKSLQ%2BxBFzfRygZFPF4E6RnlDmTZ6fqOkq6v4acjS");
        assertFalse(result);
    }

    @Test
    public void testCheckLoginWithTokenNotACoolJson() {
        String tokenOtherObject = SecurityUtils.encrypt("Hey", LoginServices.CRIPTOGRAPHY_HASH);
        
        tokenOtherObject = SecurityUtils.encode(tokenOtherObject, "UTF-8");
        
        boolean result = subject.checkLogin(tokenOtherObject);
        assertFalse(result);
    }


    @Test
    public void testCheckLoginWithToken() {
        boolean result = subject.checkLogin(token);
        assertTrue(result);
    }
    
    @Test
    public void testLoginToToken() {
        String result = subject.loginToToken("user@gmail.com", SecurityUtils.sha1("abcabc"));
        assertEquals(token, 
                result);
    }
    
    @Test
    public void testLoginHolder() {
        LoginServices.LoginHolder lh = new LoginServices.LoginHolder("a", "1");
        assertEquals("a", lh.getAccount());
        assertEquals("1", lh.getPassword());
    }
    
}
