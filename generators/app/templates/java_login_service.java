package <%= props.processPackage %>;

import br.com.martinlabs.commons.CookieIO;
import br.com.martinlabs.commons.OpResponse;
import br.com.martinlabs.commons.exceptions.RespException;
import <%= props.daoPackage %>.LoginServiceDao;
import br.com.martinlabs.commons.TransacProcess;
import com.google.gson.Gson;
import com.google.gson.JsonSyntaxException;
import java.io.UnsupportedEncodingException;
import java.net.URLDecoder;
import java.sql.Connection;
import javax.servlet.http.HttpServletRequest;

/**
 *
 * @author martinlabs CRUD generator
 */
public class LoginServices extends TransacProcess {

    public LoginServices() {
        super("<%= props.datasource %>");
    }
    
    public OpResponse login(String account, String password) throws RespException {
        return open(con -> {
            if (checkLogin(con, account, password)) {
                return new OpResponse(true);
            } else {
                return new OpResponse(false, StringsEn.getInstance().invalidLogin());
            }
        });
    }
    
    public boolean checkLogin(Connection con, String account, String password) throws RespException {
        LoginServiceDao dao = new LoginServiceDao(con);
        return dao.exist(account, password);
    }
    
    public boolean checkLogin(Connection con, HttpServletRequest request) throws RespException{
        
            LoginServiceDao dao = new LoginServiceDao(con);
            String cookie = CookieIO.get("login<%= props.modulenameUpper %>", request);

            if (cookie == null || cookie.isEmpty()) {
                return false;
            }

            LoginHolder login;
            try {
                cookie = URLDecoder.decode(cookie, "UTF-8");
                login = new Gson().fromJson(cookie, LoginHolder.class);
            } catch (JsonSyntaxException e) {
                return false;
            } catch (UnsupportedEncodingException ex) {
                return false;
            }

            return dao.exist(login.Account, login.Password);
        
    }
    
    public void allowAccess(Connection con, HttpServletRequest request) throws RespException{
        if (!checkLogin(con, request)) {
            throw new RespException(StringsEn.getInstance().pleaseLogin());
        }
    }
    
    public long getID(Connection con, HttpServletRequest request) throws RespException{
        
            LoginServiceDao dao = new LoginServiceDao(con);
            String cookie = CookieIO.get("login<%= props.modulenameUpper %>", request);

            if (cookie == null || cookie.isEmpty()) {
                return 0L;
            }

            LoginHolder login;
            try {
                cookie = URLDecoder.decode(cookie, "UTF-8");
                login = new Gson().fromJson(cookie, LoginHolder.class);
            } catch (JsonSyntaxException e) {
                return 0L;
            } catch (UnsupportedEncodingException ex) {
                return 0L;
            }

            return dao.getID(login.Account, login.Password);
        
    }

    private class LoginHolder {
        String Account;
        String Password;
    }
}