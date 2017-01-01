package <%= modulePackage %>;

import br.com.martinlabs.commons.LanguageHolder;
import br.com.martinlabs.commons.OpResp;
import br.com.martinlabs.commons.OperationPipe;
import br.com.martinlabs.commons.PagedResp;
import br.com.martinlabs.commons.RequestBodyWithToken;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.MediaType;
import java.util.logging.Level;
import java.util.logging.Logger;
import javax.ws.rs.core.Response;
import javax.ws.rs.ext.ExceptionMapper;<% 

if (loginsys) { 
%>
import <%= processPackage %>.LoginServices;
import <%= processPackage %>.LoginServices.LoginHolder;<%
} 

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
@Produces(MediaType.APPLICATION_JSON)
public class Router implements ExceptionMapper<Throwable> {

    private OperationPipe pipe = new OperationPipe("<%= datasource %>");
<% if (loginsys) { %>
    @POST
    @Path("/Login")
    public OpResp<String> login(LoginHolder body) {

        return pipe.handle(con -> {
            return new LoginServices(con).login(body.getAccount(), body.getPassword());
        });
    }
<% } 

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
    public OpResp<<%= table.className %>Resp> get<%= table.className %>(<% 
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
            @QueryParam("token") String token) {

        return pipe.handle(con -> {
            return new <%= table.className %>Process(con).get(<% 
if (table.primaryColumns.length == 1) {
    %>id, <%
} else {
    for (var k in table.primaryColumns) {
        %><%= table.primaryColumns[k].propertyName %>, <%
    } 
}
                %>token);
        });
    }

    @GET
    @Path("/<%= table.className %>")
    public OpResp<PagedResp<<%= table.className %>>> list<%= table.className %>(
            @QueryParam("token") String token,
            @QueryParam("query") String query,
            @QueryParam("page") Integer page,
            @QueryParam("limit") Integer limit,
            @QueryParam("orderBy") String orderRequest,
            @QueryParam("ascending") Boolean asc) {

        return pipe.handle(con -> {
            return new <%= table.className %>Process(con).list(token, query, page, limit, orderRequest, asc != null && asc);
        });
    }

    @POST
    @Path("/<%= table.className %>")
    public OpResp<Long> persist<%= table.className %>(RequestBodyWithToken<<%= table.className %>> body) {

        return pipe.handle(con -> {
            return new <%= table.className %>Process(con).persist(body.getContent(), body.getToken());
        });
    }
<%
	}
}
%>  
    @Override
    public Response toResponse(Throwable e) {
        Logger.getLogger(Router.class.getName()).log(Level.SEVERE, e.getMessage(), e);
        
        return Response.status(200)
            .entity("{\"success\": false, \"message\": \""+LanguageHolder.instance.invalidEntry()+"\"}")
            .type(MediaType.APPLICATION_JSON)
            .build();
    }

}
