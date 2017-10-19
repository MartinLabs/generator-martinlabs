package <%= props.modelPackage %>

import br.com.martinlabs.commons.LanguageHolder
import br.com.martinlabs.commons.ResultSetWrapper
import br.com.martinlabs.commons.Validator
import br.com.martinlabs.commons.exceptions.RespException
import com.google.common.base.Strings
import io.swagger.annotations.ApiModel
import io.swagger.annotations.ApiModelProperty
import java.sql.SQLException
import java.util.Date

<% if (table.comment) { %>
@ApiModel(description="<%= table.comment %>")<%
}
%>
class <%= table.className %> {
<% 
for (var i in table.columns) { 
    var c = table.columns[i]; 
    if (c.is_nullable === "NO" && c.column_comment) {
%>
    @ApiModelProperty(required = true, value = "<%= c.column_comment %>")<%
    } else if (c.is_nullable === "NO") {
%>
    @ApiModelProperty(required = true)<%
    } else if (c.column_comment) {
%>
    @ApiModelProperty(value = "<%= c.column_comment %>")<%
    }

    if (!c.referencedTable) {
%>
    var <%= c.propertyName %>: <%= c.kotlinType %> = <%= c.is_nullable === "YES" || c.javaType === "String" || c.javaType === "Date" ? 'null' : c.javaType === "boolean" ? 'false' : c.javaType === "double" ? "0.0" : "0" %>
<% 
    } else { 
%>
    var <%= c.notIdPropertyName %>: <%= c.referencedTable.className %>? = null
<% 
    } 
} 
%>

<% 
for (var i in table.NtoNcolumns) { 
    var cn = table.NtoNcolumns[i]; 
%>
    var <%= cn.NtoNtable.classLowerCamel %>: MutableList<<%= cn.otherTable.className %>>? = null
<% 
} 
%><% 
for (var j in table.columns) { 
    var cx = table.columns[j]; 
    if (cx.referencedTable) {
        if (cx.is_nullable === "YES") { 
%>
    var <%= cx.propertyName %>: <%= cx.kotlinType %>
        get() = if (<%= cx.notIdPropertyName %> == null || <%= cx.notIdPropertyName %>?.<%= cx.referencedTable.primaryColumns[0].propertyName %> == 0L) null else <%= cx.notIdPropertyName %>?.<%= cx.referencedTable.primaryColumns[0].propertyName %>
        set(<%= cx.propertyName %>) {
            if (<%= cx.propertyName %> == null) {
                <%= cx.notIdPropertyName %> = null
                return
            }

            if (<%= cx.notIdPropertyName %> == null) {
                <%= cx.notIdPropertyName %> = <%= cx.referencedTable.className %>()
            }
            
            <%= cx.notIdPropertyName %>?.<%= cx.referencedTable.primaryColumns[0].propertyName %> = <%= cx.propertyName %>
        }
<% 
        } else { 
%>
    var <%= cx.propertyName %>: <%= cx.kotlinType %>
        get() = <%= cx.notIdPropertyName %>?.<%= cx.referencedTable.primaryColumns[0].propertyName %> ?: 0
        set(<%= cx.propertyName %>) {
            if (<%= cx.notIdPropertyName %> == null) {
                <%= cx.notIdPropertyName %> = <%= cx.referencedTable.className %>()
            }
            
            <%= cx.notIdPropertyName %>?.<%= cx.referencedTable.primaryColumns[0].propertyName %> = <%= cx.propertyName %>
        }
<% 
        } 
    } 
} 
%>
    constructor() {}

    constructor(other: <%= table.className %>) {
<% 
for (var i in table.columns) { 
    var c = table.columns[i]; 
    if (!c.referencedTable) {
%>
        this.<%= c.propertyName %> = other.<%= c.propertyName %><% 
    } else { 
%>
        this.<%= c.notIdPropertyName %> = other.<%= c.notIdPropertyName %><% 
    } 
} 

for (var i in table.NtoNcolumns) { 
    var cn = table.NtoNcolumns[i]; 
%>
        this.<%= cn.NtoNtable.classLowerCamel %> = other.<%= cn.NtoNtable.classLowerCamel %><% 
} 
%>
    }

    fun validate(updating: Boolean, lang: LanguageHolder) {<% 
for (var i in table.columns) { 
    var c = table.columns[i]; 
    if (c.is_nullable === "NO") { 
        if (c.smartType == "password") {
%>
        if (!updating) {
            if (<%= c.propertyName %>.isNullOrEmpty()) {
                throw RespException(<%= c.ordinal_position %>, lang.cannotBeNull("<%= c.propertyNatural %>"))
            }
        }<% 
        } else if (c.javaType === "String") {
%>
        if (<%= c.propertyName %>.isNullOrEmpty()) {
            throw RespException(<%= c.ordinal_position %>, lang.cannotBeNull("<%= c.propertyNatural %>"))
        }<% 
        } else if (c.javaType === "Date" && c.smartType != "createTime" && c.smartType != "updateTime") {
%>
        if (<%= c.propertyName %> == null) {
            throw RespException(<%= c.ordinal_position %>, lang.cannotBeNull("<%= c.propertyNatural %>"))
        }<% 
        }
    }

    if (c.javaType === "String") {

        if (c.is_nullable === "NO" && c.smartType != "password") {
%>
        if (<%= c.propertyName %>?.length ?: 0 > <%= Math.min(65500, c.character_maximum_length) %>) {
            throw RespException(<%= c.ordinal_position %>, lang.lengthCannotBeMoreThan("<%= c.propertyNatural %>", <%= Math.min(65500, c.character_maximum_length) %>))
        }<%
        } else {
%>
        if (<%= c.propertyName %>?.length ?: 0 > <%= Math.min(65500, c.character_maximum_length) %>) {
            throw RespException(<%= c.ordinal_position %>, lang.lengthCannotBeMoreThan("<%= c.propertyNatural %>", <%= Math.min(65500, c.character_maximum_length) %>))
        }<%
        }

        if (c.smartType === "email") {
            if (c.is_nullable === "NO") {
%>
        if (!Validator.isEmail(<%= c.propertyName %>)) {
            throw RespException(<%= c.ordinal_position %>, lang.isNotAValidEmail("<%= c.propertyNatural %>"))
        }<%
            } else {
%>
        if (<%= c.propertyName %> != null && !Validator.isEmail(<%= c.propertyName %>)) {
            throw RespException(<%= c.ordinal_position %>, lang.isNotAValidEmail("<%= c.propertyNatural %>"))
        }<%
            }
        } else if (c.smartType === "cpf") {
            if (c.is_nullable === "NO") {
%>
        if (!Validator.isCPF(<%= c.propertyName %>)) {
            throw RespException(<%= c.ordinal_position %>, lang.isNotAValidCPF("<%= c.propertyNatural %>"))
        }<%
            } else {
%>
        if (<%= c.propertyName %> != null && !Validator.isCPF(<%= c.propertyName %>)) {
            throw RespException(<%= c.ordinal_position %>, lang.isNotAValidCPF("<%= c.propertyNatural %>"))
        }<%
            }
        } else if (c.smartType === "cnpj") {
            if (c.is_nullable === "NO") {
%>
        if (!Validator.isCNPJ(<%= c.propertyName %>)) {
            throw RespException(<%= c.ordinal_position %>, lang.isNotAValidCNPJ("<%= c.propertyNatural %>"))
        }<%
            } else {
%>
        if (<%= c.propertyName %> != null && !Validator.isCNPJ(<%= c.propertyName%>)) {
            throw RespException(<%= c.ordinal_position %>, lang.isNotAValidCNPJ("<%= c.propertyNatural %>"))
        }<%
            }
        }
    }

    if (c.referencedTable && c.is_nullable === "NO") {
%>
        if (<%= c.propertyName %> == 0L) {
            throw RespException(<%= c.ordinal_position %>, lang.cannotBeNull("<%= c.propertyNatural %>"))
        }<% 
    }
} 
%>    
    }

    companion object {

        @Throws(SQLException::class)
        @JvmOverloads
        fun buildAll(rs: ResultSetWrapper, alias: String = "<%= table.name %>"): <%= table.className %> {
            val <%= table.classLowerCamel %> = <%= table.className %>()
<% 
for (var i in table.columns) { 
    var c = table.columns[i]; 
    if (c.smartType != "password") {
%>
            <%= table.classLowerCamel %>.<%= c.propertyName %> = rs.<%= c.resultSetGetter %>(alias, "<%= c.column_name %>")<% 
    }
} 
%>
            return <%= table.classLowerCamel %>
        }
    }
}
