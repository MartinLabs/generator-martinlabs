package <%= props.processPackage %>;


import <%= props.daoPackage %>.LoginServiceDao;
import br.com.martinlabs.commons.OpResponse;
import br.com.martinlabs.commons.SecurityUtils;
import br.com.martinlabs.commons.exceptions.RespException;
import br.com.martinlabs.commons.TransacProcess;
import br.com.martinlabs.commons.exceptions.TokenInvalidoException;
import com.google.gson.Gson;
import java.io.UnsupportedEncodingException;
import java.net.URLDecoder;
import java.net.URLEncoder;
import java.sql.Connection;

/**
 *
 * @author martinlabs CRUD generator
 */
public class LoginServices extends TransacProcess {

    private static final String criptographyHash = "<%= Math.random().toString(36).substring(7) %>";

    public LoginServices() {
        super("<%= props.datasource %>");
    }
    
    public OpResponse<String> login(String account, String password) throws RespException {
        return open(con -> {
            if (checkLogin(con, account, password)) {
                String token = loginToToken(account, password);
                return new OpResponse(token);
            } else {
                return new OpResponse(false, LanguageFactory.getInstance().invalidLogin());
            }
        });
    }
    
    public void allowAccess(Connection con, String token) throws RespException{
        if (!checkLogin(con, token)) {
            throw new RespException(LanguageFactory.getInstance().pleaseLogin());
        }
    }
    
    public boolean checkLogin(Connection con, String account, String password) throws RespException {
        LoginServiceDao dao = new LoginServiceDao(con);
        return dao.exist(account, password);
    }
    
    public boolean checkLogin(Connection con, String token) throws RespException{
            LoginHolder login = tokenToLogin(token);
            return checkLogin(con, login.Account, login.Password);
        
    }
    
    private String loginToToken(String account, String password) {
        String token = new Gson().toJson(new LoginHolder(account, password));
        token = SecurityUtils.encrypt(token, criptographyHash);
        
        try {
            token = URLEncoder.encode(token, "UTF-8");
        } catch (UnsupportedEncodingException ex) {
            ex.printStackTrace();
        }
        
        return token;
    }

    private LoginHolder tokenToLogin(String token) throws TokenInvalidoException {
        
        if (token == null) {
            throw new TokenInvalidoException();
        }

        try {
            token = URLDecoder.decode(token, "UTF-8");
        } catch (UnsupportedEncodingException ex) {
            ex.printStackTrace();
        }
        
        token = SecurityUtils.decrypt(token, criptographyHash);
        
        if (token == null) {
            throw new TokenInvalidoException();
        }
        
        LoginHolder objToken = new Gson().fromJson(token, LoginHolder.class);
        if (objToken == null) {
            throw new TokenInvalidoException();
        }
        
        return objToken;
    }

    public class LoginHolder {
        String Account;
        String Password;

        public LoginHolder(String Account, String Password) {
            this.Account = Account;
            this.Password = Password;
        }
    }
}