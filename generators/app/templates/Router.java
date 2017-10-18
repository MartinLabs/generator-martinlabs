package <%= modulePackage %>;

import br.com.martinlabs.commons.PagedResp;
import <%= package %>.RouterWrapper;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.DELETE;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.HeaderParam;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;

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
 * Routes of <%= modulenameUpper %> module
 * @author martinlabs CRUD generator
 */
@Path("/<%= modulenameUpper %>")
@Api(tags = {"<%= modulenameUpper %>"})
@Produces(MediaType.APPLICATION_JSON)
public class Router extends RouterWrapper {

    @POST
    @Path("/Login")
    @ApiOperation(value = "Makes user authentication")
    public LoginResp login(
        @HeaderParam("Accept-Language") @ApiParam(required = true, allowableValues = "en, pt") 
            String lang, 
        @HeaderParam("X-Client-Version") @ApiParam(required = true, example = "w1.1.0") 
            String clientVersion, 

        @ApiParam(required = true)
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
    @ApiOperation(value = "Gets <%= table.className %> of informed id")
    public <%= table.className %>Resp get<%= table.className %>(<% 
if (table.primaryColumns.length == 1) {
%>
        @PathParam("id") @ApiParam(required = true)
            Long id,<%
} else {
    for (var k in table.primaryColumns) {
%>
        @PathParam("<%= table.primaryColumns[k].propertyName %>") @ApiParam(required = true)
            Long <%= table.primaryColumns[k].propertyName %>,<%
    }
} 
%>

        @HeaderParam("Accept-Language") @ApiParam(required = true, allowableValues = "en, pt") 
            String lang, 
        @HeaderParam("X-Client-Version") @ApiParam(required = true, example = "w1.1.0") 
            String clientVersion, 
        @HeaderParam("Authorization") @ApiParam(required = true, example = "Bearer mytokenhere") 
            String authorization) {
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
                %>extractToken(authorization));
        });
    }

    @GET
    @Path("/<%= table.className %>")
    @ApiOperation(value = "List <%= table.className %> informations")
    public PagedResp<<%= table.className %>> list<%= table.className %>(
        @HeaderParam("Accept-Language") @ApiParam(required = true, allowableValues = "en, pt") 
            String lang, 
        @HeaderParam("X-Client-Version") @ApiParam(required = true, example = "w1.1.0") 
            String clientVersion, 
        @HeaderParam("Authorization") @ApiParam(required = true, example = "Bearer mytokenhere") 
            String authorization,

        @QueryParam("query") @ApiParam(value = "Query of search")
            String query,
        @QueryParam("page") @ApiParam(value = "Page index, null to not paginate")
            Integer page,
        @QueryParam("limit") @ApiParam(value = "Page size, null to not paginate")
            Integer limit,
        @QueryParam("orderBy") @ApiParam(value = "Identifier for sorting, usually a property name", example = "<%= table.columns[0].propertyName %>")
            String orderRequest,
        @QueryParam("ascending") @ApiParam(value = "True for ascending order", defaultValue = "false")
            Boolean asc) {
        //TODO: review generated method
        return pipe.handle(con -> {
            return new <%= table.className %>Process(con, langs.get(lang), clientVersion)
                .list(extractToken(authorization), query, page, limit, orderRequest, asc != null && asc);
        });
    }

    @POST
    @Path("/<%= table.className %>")
    @ApiOperation(value = "Persist a new or existing <%= table.className %>", notes = "1 - Informed <%= table.className %> have an ID editing the existing <%= table.className %>; 2 - Informed <%= table.className %> don't have an ID creating a new <%= table.className %>")
    public Long persist<%= table.className %>(
        @HeaderParam("Accept-Language") @ApiParam(required = true, allowableValues = "en, pt") 
            String lang, 
        @HeaderParam("X-Client-Version") @ApiParam(required = true, example = "w1.1.0") 
            String clientVersion, 
        @HeaderParam("Authorization") @ApiParam(required = true, example = "Bearer mytokenhere") 
            String authorization,

        @ApiParam(required = true)
            <%= table.className %> <%= table.classLowerCamel %>) {
        //TODO: review generated method
        return pipe.handle(con -> {
            return new <%= table.className %>Process(con, langs.get(lang), clientVersion)
                .persist(<%= table.classLowerCamel %>, extractToken(authorization));
        });
    }
<%
        if (table.deactivableColumn) {
%>
    @DELETE
    @Path("/<%= table.className %>/{id}")
    @ApiOperation(value = "Deletes the <%= table.className %> of informed id")
    public Object remove<%= table.className %>(<% 
            if (table.primaryColumns.length == 1) {
%>
        @PathParam("id") @ApiParam(required = true)
            Long id,<%
            } else {
            for (var k in table.primaryColumns) {
%>
        @PathParam("<%= table.primaryColumns[k].propertyName %>") @ApiParam(required = true)
            Long <%= table.primaryColumns[k].propertyName %>,<%
    }
} 
%>

        @HeaderParam("Accept-Language") @ApiParam(required = true, allowableValues = "en, pt") 
            String lang, 
        @HeaderParam("X-Client-Version") @ApiParam(required = true, example = "w1.1.0") 
            String clientVersion, 
        @HeaderParam("Authorization") @ApiParam(required = true, example = "Bearer mytokenhere") 
            String authorization) {
        //TODO: review generated method
        return pipe.handle(con -> {
            new <%= table.className %>Process(con, langs.get(lang), clientVersion)
                .remove(id, extractToken(authorization));
            return null;
        });
    }
<%
        }
	}
}
%>
}
