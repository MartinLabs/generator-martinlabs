package <%= modulePackage %>

import com.simpli.model.PagedResp
import <%= package %>.RouterWrapper
import javax.ws.rs.GET
import javax.ws.rs.POST
import javax.ws.rs.DELETE
import javax.ws.rs.Path
import javax.ws.rs.PathParam
import javax.ws.rs.Produces
import javax.ws.rs.QueryParam
import javax.ws.rs.core.MediaType
import javax.ws.rs.HeaderParam
import io.swagger.annotations.Api
import io.swagger.annotations.ApiOperation
import io.swagger.annotations.ApiParam

import <%= processPackage %>.LoginServices
import <%= processPackage %>.LoginServices.LoginHolder
import <%= responsePackage %>.LoginResp<%

for (var i in tables) {
	var table = tables[i];
	if (!table.isNtoNtable && table.inCrud) {
%>
import <%= processPackage %>.<%= table.className %>Process
import <%= responsePackage %>.<%= table.className %>Resp
import <%= modelPackage %>.<%= table.className %><% 
	}
}
%>

/**
 * Routes of <%= modulenameUpper %> module
 * @author martinlabs CRUD generator
 */
@Path("/<%= modulenameUpper %>")
@Api(tags = arrayOf("<%= modulenameUpper %>"))
@Produces(MediaType.APPLICATION_JSON)
class Router : RouterWrapper() {

    @POST
    @Path("/Login")
    @ApiOperation(value = "Makes user authentication")
    fun login(
        @HeaderParam("Accept-Language") @ApiParam(required = true, allowableValues = "en, pt") 
            lang: String, 
        @HeaderParam("X-Client-Version") @ApiParam(required = true, example = "w1.1.0") 
            clientVersion: String, 

        @ApiParam(required = true)
            body: LoginHolder): LoginResp {
        //TODO: review generated method
        return pipe.handle { con ->
            LoginServices(con, getLang(lang), clientVersion)
                    .login(body.account, body.password)
        }
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
    fun get<%= table.className %>(<% 
if (table.primaryColumns.length == 1) {
%>
        @PathParam("id") @ApiParam(required = true)
            id: Long?,<%
} else {
    for (var k in table.primaryColumns) {
%>
        @PathParam("<%= table.primaryColumns[k].propertyName %>") @ApiParam(required = true)
            <%= table.primaryColumns[k].propertyName %>: Long,<%
    }
} 
%>

        @HeaderParam("Accept-Language") @ApiParam(required = true, allowableValues = "en, pt") 
            lang: String, 
        @HeaderParam("X-Client-Version") @ApiParam(required = true, example = "w1.1.0") 
            clientVersion: String, 
        @HeaderParam("Authorization") @ApiParam(required = true, example = "Bearer mytokenhere") 
            authorization: String): <%= table.className %>Resp {
        //TODO: review generated method
        return pipe.handle { con ->
            <%= table.className %>Process(con, getLang(lang), clientVersion).getOne(<% 
if (table.primaryColumns.length == 1) {
    %>id, <%
} else {
    for (var k in table.primaryColumns) {
        %><%= table.primaryColumns[k].propertyName %>, <%
    } 
}
                %>extractToken(authorization))
        }
    }

    @GET
    @Path("/<%= table.className %>")
    @ApiOperation(value = "List <%= table.className %> informations")
    fun list<%= table.className %>(
        @HeaderParam("Accept-Language") @ApiParam(required = true, allowableValues = "en, pt") 
            lang: String, 
        @HeaderParam("X-Client-Version") @ApiParam(required = true, example = "w1.1.0") 
            clientVersion: String, 
        @HeaderParam("Authorization") @ApiParam(required = true, example = "Bearer mytokenhere") 
            authorization: String,

        @QueryParam("query") @ApiParam(value = "Query of search")
            query: String,
        @QueryParam("page") @ApiParam(value = "Page index, null to not paginate")
            page: Int?,
        @QueryParam("limit") @ApiParam(value = "Page size, null to not paginate")
            limit: Int?,
        @QueryParam("orderBy") @ApiParam(value = "Identifier for sorting, usually a property name", example = "<%= table.columns[0].propertyName %>")
            orderRequest: String,
        @QueryParam("ascending") @ApiParam(value = "True for ascending order", defaultValue = "false")
            asc: Boolean?): PagedResp<<%= table.className %>> {
        //TODO: review generated method
        return pipe.handle { con ->
            <%= table.className %>Process(con, getLang(lang), clientVersion)
                    .list(extractToken(authorization), query, page, limit, orderRequest, asc != null && asc)
        }
    }

    @POST
    @Path("/<%= table.className %>")
    @ApiOperation(value = "Persist a new or existing <%= table.className %>", notes = "1 - Informed <%= table.className %> have an ID editing the existing <%= table.className %>; 2 - Informed <%= table.className %> don't have an ID creating a new <%= table.className %>")
    fun persist<%= table.className %>(
        @HeaderParam("Accept-Language") @ApiParam(required = true, allowableValues = "en, pt") 
            lang: String, 
        @HeaderParam("X-Client-Version") @ApiParam(required = true, example = "w1.1.0") 
            clientVersion: String, 
        @HeaderParam("Authorization") @ApiParam(required = true, example = "Bearer mytokenhere") 
            authorization: String,

        @ApiParam(required = true)
            <%= table.classLowerCamel %>: <%= table.className %>): Long? {
        //TODO: review generated method
        return pipe.handle<Long?> { con ->
            <%= table.className %>Process(con, getLang(lang), clientVersion)
                    .persist(<%= table.classLowerCamel %>, extractToken(authorization))
        }
    }
<%
        if (table.deactivableColumn) {
%>
    @DELETE
    @Path("/<%= table.className %>/{id}")
    @ApiOperation(value = "Deletes the <%= table.className %> of informed id")
    fun remove<%= table.className %>(<% 
            if (table.primaryColumns.length == 1) {
%>
        @PathParam("id") @ApiParam(required = true)
            id: Long?,<%
            } else {
            for (var k in table.primaryColumns) {
%>
        @PathParam("<%= table.primaryColumns[k].propertyName %>") @ApiParam(required = true)
            <%= table.primaryColumns[k].propertyName %>: Long?,<%
    }
} 
%>

        @HeaderParam("Accept-Language") @ApiParam(required = true, allowableValues = "en, pt") 
            lang: String, 
        @HeaderParam("X-Client-Version") @ApiParam(required = true, example = "w1.1.0") 
            clientVersion: String, 
        @HeaderParam("Authorization") @ApiParam(required = true, example = "Bearer mytokenhere") 
            authorization: String): Any? {
        //TODO: review generated method
        return pipe.handle<Any?> { con ->
            <%= table.className %>Process(con, getLang(lang), clientVersion)
                    .remove(id, extractToken(authorization))
        }
    }
<%
        }
	}
}
%>
}
