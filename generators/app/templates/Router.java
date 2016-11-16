package <%= modulePackage %>;

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
import javax.ws.rs.core.MediaType;<% 

if (loginsys) { 
%>
import br.com.martinlabs.usecase.crud.process.LoginServices;
import br.com.martinlabs.usecase.crud.process.LoginServices.LoginHolder;<%
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
public class Router {

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
    @Path("/<%= table.className %>/{id}")
    public OpResp<<%= table.className %>Resp> get<%= table.className %>(
            @PathParam("id") Long id,
            @QueryParam("token") String token) {

        return pipe.handle(con -> {
            return new <%= table.className %>Process(con).get(id, token);
        });
    }

    @GET
    @Path("/<%= table.className %>")
    public OpResp<PagedResp<<%= table.className %>>> list<%= table.className %>(
            @QueryParam("token") String token,
            @QueryParam("search") String search,
            @QueryParam("start") Integer start,
            @QueryParam("length") Integer length,
            @QueryParam("orderColumn") Integer orderColumn,
            @QueryParam("orderDir") String orderDir) {

        return pipe.handle(con -> {
            return new <%= table.className %>Process(con).list(token, search, start, length, orderColumn, orderDir);
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
}
