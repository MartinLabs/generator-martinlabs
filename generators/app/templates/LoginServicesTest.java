package <%= processPackage %>;

import br.com.martinlabs.commons.DaoUnitTestWrapper;
import br.com.martinlabs.commons.EnglishLanguage;
import br.com.martinlabs.commons.LanguageHolder;
import br.com.martinlabs.commons.SecurityUtils;
import br.com.martinlabs.commons.exceptions.RespException;
import <%= responsePackage %>.LoginResp;
import java.sql.Connection;
import java.sql.SQLException;
import javax.naming.NamingException;
import org.junit.Test;
import static org.junit.Assert.*;

/**
 * Tests the login service
 * @author martinlabs CRUD generator
 */
public class LoginServicesTest extends DaoUnitTestWrapper {
    
    private LoginServices subject;
    private String token;
    
    public LoginServicesTest() throws NamingException, SQLException {
        super("<%= datasource %>", "<%= database %>");
        Connection con = getConnection();
        LanguageHolder lang = new EnglishLanguage();
        String clientVersion = "w1.0.0";
        subject = new LoginServices(con, lang, clientVersion);
        token = subject.loginToToken("user@gmail.com", SecurityUtils.sha256("abcabc"));
    }

    @Test(expected = RespException.class)
    public void testLoginNull() {
        subject.login(null, null);
    }

    @Test(expected = RespException.class)
    public void testLoginFail() {
        subject.login("user@gmail.com", SecurityUtils.sha256("wrongpassword"));
    }

    @Test
    public void testLoginAdmin() {
        LoginResp result = subject.login("user@gmail.com", SecurityUtils.sha256("abcabc"));
        assertEquals(token,
                result.getToken());
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
    public void testGetIdFail() {
        long result = subject.getId(null, null);
        assertEquals(result, 0);
    }

    @Test
    public void testGetId() {
        long result = subject.getId("user@gmail.com", SecurityUtils.sha256("abcabc"));
        assertNotEquals(result, 0);
    }

    @Test
    public void testTokenToLoginNull() {
        LoginServices.LoginHolder result = subject.tokenToLogin(null);
        assertNull(result);
    }

    @Test
    public void testTokenToLoginWithTokenNotACoolJson() {
        String tokenOtherObject = SecurityUtils.encrypt("Hey", LoginServices.CRIPTOGRAPHY_HASH);

        tokenOtherObject = SecurityUtils.encode(tokenOtherObject, "UTF-8");

        LoginServices.LoginHolder result = subject.tokenToLogin(tokenOtherObject);
        assertNull(result);
    }

    @Test
    public void testLoginToToken() {
        String result = subject.loginToToken("user@gmail.com", SecurityUtils.sha256("abcabc"));
        assertEquals(token,
                result);
    }

    @Test
    public void testLoginHolder() {
        LoginServices.LoginHolder lh = new LoginServices.LoginHolder("a", "1");
        assertEquals("a", lh.getAccount());
        assertEquals("1", lh.getPassword());
    }

    @Test
    public void testLoginHolderWithId() {
        LoginServices.LoginHolderWithId lh = new LoginServices.LoginHolderWithId(new LoginServices.LoginHolder("a", "1"), 2);
        assertNotNull(lh.getLoginHolder());
        assertEquals(2, lh.getId());
    }

}