package <%= modulePackage %>;

import br.com.martinlabs.commons.LanguageHolder;
import br.com.martinlabs.commons.TransactionPipe;
import br.com.martinlabs.commons.PagedResp;
import br.com.martinlabs.commons.exceptions.RespException;
import br.com.martinlabs.commons.OauthHelper;
import br.com.martinlabs.commons.EnglishLanguage;
import br.com.martinlabs.commons.PortugueseLanguage;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.DELETE;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.Context;
import javax.ws.rs.ext.ExceptionMapper;
import java.util.logging.Level;
import java.util.logging.Logger;
import javax.servlet.http.HttpServletRequest;
import java.util.HashMap;
import javax.ws.rs.HeaderParam;
import io.swagger.annotations.Api;
import <%= processPackage %>.LoginServices;
import <%= processPackage %>.LoginServices.LoginHolder;
import <%= responsePackage %>.LoginResp;<%

for (var i in tables) {
	var table = tables[i];
	if (!table.isNtoNtable && table.inCrud) {
%>
import <%= processPackage %>.<%= table.className %>Process;
import <%= responsePackage %>.<%= table.className %>Resp;
import <%= modelPackage %>.<%= table.className %>;<% 
	}
}
%>

/**
 *
 * @author martinlabs CRUD generator
 */
@Path("/<%= modulenameUpper %>")
@Api(tags = {"Crud"})
@Produces(MediaType.APPLICATION_JSON)
public class Router implements ExceptionMapper<Throwable> {

    private TransactionPipe pipe = new TransactionPipe("<%= datasource %>");

    private HashMap<String, LanguageHolder> langs = new HashMap<String, LanguageHolder>() {{
        put("en", new EnglishLanguage());
        put("pt", new PortugueseLanguage());
    }};


    @POST
    @Path("/Login")
    public LoginResp login(
        @HeaderParam("Accept-Language") String lang, 
        @HeaderParam("X-Client-Version") String clientVersion, 
        
        LoginHolder body) {
        //TODO: review generated method
        return pipe.handle(con -> {
            return new LoginServices(con, langs.get(lang), clientVersion)
                .login(body.getAccount(), body.getPassword());
        });
    }
<%
for (var i in tables) {
	var table = tables[i];
	if (!table.isNtoNtable && table.inCrud) {
%>   
    @GET
    @Path("/<%= table.className %><% 
if (table.primaryColumns.length == 1) {
    %>/{id}<%
} else {
    for (var k in table.primaryColumns) {
        %>/{<%= table.primaryColumns[k].propertyName %>}<%
    } 
}
        %>")
    public <%= table.className %>Resp get<%= table.className %>(<% 
if (table.primaryColumns.length == 1) {
%>
            @PathParam("id") Long id,<%
} else {
    for (var k in table.primaryColumns) {
%>
            @PathParam("<%= table.primaryColumns[k].propertyName %>") Long <%= table.primaryColumns[k].propertyName %>,<%
    }
} 
%>

        @HeaderParam("Accept-Language") String lang, 
        @HeaderParam("X-Client-Version") String clientVersion, 
        @Context HttpServletRequest req) {
        //TODO: review generated method
        return pipe.handle(con -> {
            return new <%= table.className %>Process(con, langs.get(lang), clientVersion)
                .get(<% 
if (table.primaryColumns.length == 1) {
    %>id, <%
} else {
    for (var k in table.primaryColumns) {
        %><%= table.primaryColumns[k].propertyName %>, <%
    } 
}
                %>OauthHelper.getToken(req));
        });
    }

    @GET
    @Path("/<%= table.className %>")
    public PagedResp<<%= table.className %>> list<%= table.className %>(
            @HeaderParam("Accept-Language") String lang, 
            @HeaderParam("X-Client-Version") String clientVersion, 
            @Context HttpServletRequest req,

            @QueryParam("query") String query,
            @QueryParam("page") Integer page,
            @QueryParam("limit") Integer limit,
            @QueryParam("orderBy") String orderRequest,
            @QueryParam("ascending") Boolean asc) {
        //TODO: review generated method
        return pipe.handle(con -> {
            return new <%= table.className %>Process(con, langs.get(lang), clientVersion)
                .list(OauthHelper.getToken(req), query, page, limit, orderRequest, asc != null && asc);
        });
    }

    @POST
    @Path("/<%= table.className %>")
    public Long persist<%= table.className %>(
        @HeaderParam("Accept-Language") String lang, 
        @HeaderParam("X-Client-Version") String clientVersion, 
        @Context HttpServletRequest req,

        <%= table.className %> <%= table.classLowerCamel %>) {
        //TODO: review generated method
        return pipe.handle(con -> {
            return new <%= table.className %>Process(con, langs.get(lang), clientVersion)
                .persist(<%= table.classLowerCamel %>, OauthHelper.getToken(req));
        });
    }
<%
        if (table.deactivableColumn) {
%>
    @DELETE
    @Path("/<%= table.className %>/{id}")
    public Object remove<%= table.className %>(<% 
            if (table.primaryColumns.length == 1) {
%>
            @PathParam("id") Long id,<%
            } else {
            for (var k in table.primaryColumns) {
%>
            @PathParam("<%= table.primaryColumns[k].propertyName %>") Long <%= table.primaryColumns[k].propertyName %>,<%
    }
} 
%>

            @HeaderParam("Accept-Language") String lang, 
            @HeaderParam("X-Client-Version") String clientVersion, 
            @Context HttpServletRequest req) {
        //TODO: review generated method
        return pipe.handle(con -> {
            new <%= table.className %>Process(con, langs.get(lang), clientVersion)
                .remove(id, OauthHelper.getToken(req));
            return null;
        });
    }
<%
        }
	}
}
%>  
    @Override
    public Response toResponse(Throwable e) {
        Logger.getLogger(Router.class.getName()).log(Level.SEVERE, e.getMessage(), e);
        
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

}
