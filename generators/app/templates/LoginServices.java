package <%= props.processPackage %>;


import <%= props.daoPackage %>.LoginServiceDao;
import br.com.martinlabs.commons.SecurityUtils;
import br.com.martinlabs.commons.exceptions.RespException;
import com.google.gson.Gson;
import java.sql.Connection;
import br.com.martinlabs.commons.LanguageHolder;
import <%= props.package %>.ErrorCode;
import <%= props.responsePackage %>.LoginResp;


/**
 * <%= table.className %> Login Services
 * @author martinlabs CRUD generator
 */
public class LoginServices {

    protected static final String CRIPTOGRAPHY_HASH = "<%= Math.random().toString(36).substring(7) %>";
    private Connection con;
    private LanguageHolder lang;
    private String clientVersion;


    public LoginServices(Connection con, LanguageHolder lang, String clientVersion) {
        this.con = con;
        this.lang = lang;
        this.clientVersion = clientVersion;
    }
    
    public LoginResp login(String account, String password) {
        String token = loginToToken(account, password);
        long id = getId(account, password);
        
        allowAccess(token);
        
        return new LoginResp(token, id);
    }
    
    protected LoginHolderWithId allowAccess(String token) {
        LoginHolder login = tokenToLogin(token);
        
        if (login == null) {
            throw new RespException(ErrorCode.INVALID_LOGIN, lang.pleaseLogin());
        }
        
        long id = getId(login.account, login.password);
        
        if (id == 0) {
            throw new RespException(ErrorCode.INVALID_LOGIN, lang.pleaseLogin());
        }
        
        return new LoginHolderWithId(login, id);
    }
    
    protected long getId(String account, String password) {
        LoginServiceDao dao = new LoginServiceDao(con, lang);
        
        return dao.getIdOf<%= table.className %>(account, password);
    }
    
    protected String loginToToken(String account, String password) {
        String token = new Gson().toJson(new LoginHolder(account, password));
        token = SecurityUtils.encrypt(token, CRIPTOGRAPHY_HASH);
        
        token = SecurityUtils.encode(token, "UTF-8");
        
        return token;
    }

    protected LoginHolder tokenToLogin(String token) {
        
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

        protected LoginHolder(String account, String password) {
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
    
    public static class LoginHolderWithId {
        private LoginHolder loginHolder;
        private long id;

        protected LoginHolderWithId(LoginHolder loginHolder, long id) {
            this.loginHolder = loginHolder;
            this.id = id;
        }

        public LoginHolder getLoginHolder() {
            return loginHolder;
        }

        public long getId() {
            return id;
        }
    }
}