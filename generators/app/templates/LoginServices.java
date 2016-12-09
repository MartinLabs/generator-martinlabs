package <%= props.processPackage %>;


import <%= props.daoPackage %>.LoginServiceDao;
import br.com.martinlabs.commons.SecurityUtils;
import br.com.martinlabs.commons.exceptions.RespException;
import com.google.gson.Gson;
import java.sql.Connection;
import br.com.martinlabs.commons.LanguageHolder;
import <%= props.package %>.ErrorCode;


/**
 *
 * @author martinlabs CRUD generator
 */
public class LoginServices {

    protected static final String CRIPTOGRAPHY_HASH = "<%= Math.random().toString(36).substring(7) %>";
    private Connection con;

    public LoginServices(Connection con) {
        this.con = con;
    }
    
    public String login(String account, String password) {
        if (!checkLogin(account, password)) {
            throw new RespException(ErrorCode.INVALID_LOGIN, LanguageHolder.instance.invalidLogin());
        }

        String token = loginToToken(account, password);
        return token;
    }
    
    public void allowAccess(String token) {
        if (!checkLogin(token)) {
            throw new RespException(ErrorCode.INVALID_LOGIN, LanguageHolder.instance.pleaseLogin());
        }
    }
    
    public boolean checkLogin(String account, String password) {
        LoginServiceDao dao = new LoginServiceDao(con);
        return dao.existAccount(account, password);
    }
    
    public boolean checkLogin(String token) {
        LoginHolder login = tokenToLogin(token);
        return login != null && checkLogin(login.account, login.password);
    }
    
    protected String loginToToken(String account, String password) {
        String token = new Gson().toJson(new LoginHolder(account, password));
        token = SecurityUtils.encrypt(token, CRIPTOGRAPHY_HASH);
        
        token = SecurityUtils.encode(token, "UTF-8");
        
        return token;
    }

    private LoginHolder tokenToLogin(String token) {
        
        if (token == null) {
            return null;
        }

        token = SecurityUtils.decode(token, "UTF-8");
        
        token = SecurityUtils.decrypt(token, CRIPTOGRAPHY_HASH);
        
        if (token == null) {
            return null;
        }
        
        try {
            return new Gson().fromJson(token, LoginHolder.class);
        } catch (Exception e) {
            return null;
        }
    }

    public static class LoginHolder {
        private String account;
        private String password;

        public LoginHolder(String account, String password) {
            this.account = account;
            this.password = password;
        }

        public String getAccount() {
            return account;
        }

        public String getPassword() {
            return password;
        }

    }
}