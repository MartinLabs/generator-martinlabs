package <%= package %>;

import br.com.martinlabs.commons.EnglishLanguage;
import br.com.martinlabs.commons.LanguageHolder;
import br.com.martinlabs.commons.PortugueseLanguage;
import br.com.martinlabs.commons.TransactionPipe;
import br.com.martinlabs.commons.exceptions.RespException;
import com.google.api.client.util.Strings;
import java.util.HashMap;
import java.util.logging.Level;
import java.util.logging.Logger;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import javax.ws.rs.ext.ExceptionMapper;

/**
 * Utility class holding properties and methods for all Routers
 * @author martinlabs CRUD generator
 */
public class RouterWrapper implements ExceptionMapper<Throwable> {
    
    protected TransactionPipe pipe = new TransactionPipe("<%= datasource %>");

    protected HashMap<String, LanguageHolder> langs = new HashMap<String, LanguageHolder>() {{
        put("en", new EnglishLanguage());
        put("pt", new PortugueseLanguage());
    }};
  
    @Override
    public Response toResponse(Throwable e) {
        Logger.getLogger(RouterWrapper.class.getName()).log(Level.SEVERE, e.getMessage(), e);
        
        if (e instanceof RespException) {
            RespException re = (RespException) e;
            
            String code = "";
            if (re.getCode() != null) {
                code = "\"code\": " + re.getCode() + ", ";
            }
            
            return Response.status(403)
            .entity("{"+code+" \"message\": \""+e.getMessage()+"\"}")
            .type(MediaType.APPLICATION_JSON)
            .build();
        } else {
            return Response.status(500)
                .entity("{\"message\": \"Invalid Entry\"}")
                .type(MediaType.APPLICATION_JSON)
                .build();
        }
    }
    
    protected String extractToken(String authorization) {
        if (Strings.isNullOrEmpty(authorization)) {
            return null;
        }
        
        Matcher matcher = Pattern.compile("Bearer (.*)").matcher(authorization);
        
        if (!matcher.find()) {
            return null;
        }
        
        return matcher.group(1);
    }

}
