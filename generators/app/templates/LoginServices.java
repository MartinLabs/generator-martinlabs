package <%= props.processPackage %>;


import <%= props.daoPackage %>.LoginServiceDao;
import br.com.martinlabs.commons.SecurityUtils;
import br.com.martinlabs.commons.exceptions.RespException;
import com.google.gson.Gson;
import java.io.UnsupportedEncodingException;
import java.net.URLDecoder;
import java.net.URLEncoder;
import java.sql.Connection;
import br.com.martinlabs.commons.LanguageHolder;
import br.com.martinlabs.usecase.ErrorCode;


/**
 *
 * @author martinlabs CRUD generator
 */
public class LoginServices {

    private static final String CRIPTOGRAPHY_HASH = "<%= Math.random().toString(36).substring(7) %>";
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
        return checkLogin(login.account, login.password);
    }
    
    private String loginToToken(String account, String password) {
        String token = new Gson().toJson(new LoginHolder(account, password));
        token = SecurityUtils.encrypt(token, CRIPTOGRAPHY_HASH);
        
        try {
            token = URLEncoder.encode(token, "UTF-8");
        } catch (UnsupportedEncodingException ex) {
            ex.printStackTrace();
        }
        
        return token;
    }

    private LoginHolder tokenToLogin(String token) {
        
        if (token == null) {
            throw new RespException(ErrorCode.INVALID_LOGIN, LanguageHolder.instance.pleaseLogin());
        }

        try {
            token = URLDecoder.decode(token, "UTF-8");
        } catch (UnsupportedEncodingException ex) {
            ex.printStackTrace();
        }
        
        token = SecurityUtils.decrypt(token, CRIPTOGRAPHY_HASH);
        
        if (token == null) {
            throw new RespException(ErrorCode.INVALID_LOGIN, LanguageHolder.instance.pleaseLogin());
        }
        
        LoginHolder loginHolder = new Gson().fromJson(token, LoginHolder.class);
        if (loginHolder == null) {
            throw new RespException(ErrorCode.INVALID_LOGIN, LanguageHolder.instance.pleaseLogin());
        }
        
        return loginHolder;
    }

    public class LoginHolder {
        private String account;
        private String password;

        public LoginHolder(String account, String password) {
            this.account = account;
            this.password = password;
        }

        public String getAccount() {
            return account;
        }

        public void setAccount(String Account) {
            this.account = Account;
        }

        public String getPassword() {
            return password;
        }

        public void setPassword(String Password) {
            this.password = Password;
        }

    }
}