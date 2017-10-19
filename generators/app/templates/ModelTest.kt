package <%= props.modelPackage %>

import br.com.martinlabs.commons.EnglishLanguage
import br.com.martinlabs.commons.exceptions.RespException
import java.util.ArrayList
import java.util.Date
import org.junit.Test
import org.junit.Assert.*

/**
 * Tests <%= table.className %>
 * @author martinlabs CRUD generator
 */
class <%= table.className %>Test {

<%

for (var i in table.columns) { 
    var c = table.columns[i]; 
    if (c.is_nullable === "NO" && (c.column_key != "PRI" || (c.column_key == "PRI" && c.referencedTable)) && (c.javaType === "String" || c.javaType === "Date" || c.referencedTable) && c.smartType != "createTime" && c.smartType != "updateTime") { 
%>
    @Test(expected = RespException::class)
    fun testValidateNo<%= c.propertyNameUpper %>() {
        val <%= table.classLowerCamel %> = <%= table.className %>() <%
        for (var j in table.columns) { 
            var cx = table.columns[j]; 
            if (cx.is_nullable === "NO" && cx.propertyName != c.propertyName && (cx.column_key != "PRI" || cx.referencedTable)) { 
                if (cx.javaType === "long") {
%>
        <%= table.classLowerCamel %>.<%= cx.propertyName %> = 1<% 
                } else if (cx.javaType === "double") {
%>
        <%= table.classLowerCamel %>.<%= cx.propertyName %> = 1.0<% 
                } else if (cx.javaType === "String") {
                    if (cx.smartType === "email") {
%>
        <%= table.classLowerCamel %>.<%= cx.propertyName %> = "any@email.com"<% 
                    } else {
%>
        <%= table.classLowerCamel %>.<%= cx.propertyName %> = "X"<% 
                    }
                } else if (cx.javaType === "Date") {
%>
        <%= table.classLowerCamel %>.<%= cx.propertyName %> = Date()<% 
                }
            } 
        } 
%>
        
        <%= table.classLowerCamel %>.validate(false, EnglishLanguage())
    } 
<%

    }

    if (c.javaType === "String" && c.column_key != "PRI") {
%>
    @Test(expected = RespException::class)
    fun testValidate<%= c.propertyNameUpper %>Length<%= Math.min(65500, c.character_maximum_length) + 1 %>() {
        val <%= table.classLowerCamel %> = <%= table.className %>() <%
        for (var j in table.columns) { 
            var cx = table.columns[j]; 
            if (cx.propertyName == c.propertyName) {
%>
        <%= table.classLowerCamel %>.<%= cx.propertyName %> = "He<%= Array(Math.min(65500, cx.character_maximum_length)).join('y') %>"<% 
            } else if (cx.is_nullable === "NO" && (cx.column_key != "PRI" || cx.referencedTable)) { 
                if (cx.javaType === "long") {
%>
        <%= table.classLowerCamel %>.<%= cx.propertyName %> = 1<% 
                } else if (cx.javaType === "double") {
%>
        <%= table.classLowerCamel %>.<%= cx.propertyName %> = 1.0<% 
                } else if (cx.javaType === "String") {
                    if (cx.smartType === "email") {
%>
        <%= table.classLowerCamel %>.<%= cx.propertyName %> = "any@email.com"<% 
                    } else {
%>
        <%= table.classLowerCamel %>.<%= cx.propertyName %> = "X"<% 
                    }
                } else if (cx.javaType === "Date") {
%>
        <%= table.classLowerCamel %>.<%= cx.propertyName %> = Date()<% 
                }
            } 
        } 
%>
        
        <%= table.classLowerCamel %>.validate(false, EnglishLanguage())
    } <%
        if (c.smartType === "email") { %>
    @Test(expected = RespException::class)
    fun testValidate<%= c.propertyNameUpper %>AsInvalidEmail() {
        val <%= table.classLowerCamel %> = <%= table.className %>() <%
        for (var j in table.columns) { 
            var cx = table.columns[j]; 
            if (cx.propertyName == c.propertyName) {
%>
        <%= table.classLowerCamel %>.<%= cx.propertyName %> = "notAnEmail"<% 
            } else if (cx.is_nullable === "NO" && (cx.column_key != "PRI" || cx.referencedTable)) { 
                if (cx.javaType === "long") {
%>
        <%= table.classLowerCamel %>.<%= cx.propertyName %> = 1<% 
                } else if (cx.javaType === "double") {
%>
        <%= table.classLowerCamel %>.<%= cx.propertyName %> = 1.0<% 
                } else if (cx.javaType === "String") {
                    if (cx.smartType === "email") {
%>
        <%= table.classLowerCamel %>.<%= cx.propertyName %> = "any@email.com"<% 
                    } else {
%>
        <%= table.classLowerCamel %>.<%= cx.propertyName %> = "X"<% 
                    }
                } else if (cx.javaType === "Date") {
%>
        <%= table.classLowerCamel %>.<%= cx.propertyName %> = Date()<% 
                }
            } 
        } 
%>
        
        <%= table.classLowerCamel %>.validate(false, EnglishLanguage())
    } <%
        }
    }

    if (c.referencedTable && c.is_nullable === "YES") { 
%>
    @Test
    fun testSet<%= c.propertyNameUpper %>Null() {
        val <%= table.classLowerCamel %> = <%= table.className %>()
        <%= table.classLowerCamel %>.<%= c.notIdPropertyName %> = <%= c.referencedTable.className %>()
        <%= table.classLowerCamel %>.<%= c.propertyName %> = null
        assertNull(<%= table.classLowerCamel %>.<%= c.notIdPropertyName %>)
        <%= table.classLowerCamel %>.<%= c.propertyName %> = <%= c.javaType === "Long" ? "1L" : c.javaType === "Double" ? "1D" : "" %>
        assertNotNull(<%= table.classLowerCamel %>.<%= c.notIdPropertyName %>)
    }
<%
    }
} 
%>

    @Test
    fun testValidateSuccess() {
        val <%= table.classLowerCamel %> = <%= table.className %>() <%
        for (var j in table.columns) { 
            var cx = table.columns[j]; 
            if (cx.is_nullable === "NO" && (cx.column_key != "PRI" || cx.referencedTable)) { 
                if (cx.javaType === "long") {
%>
        <%= table.classLowerCamel %>.<%= cx.propertyName %> = 1<% 
                } else if (cx.javaType === "double") {
%>
        <%= table.classLowerCamel %>.<%= cx.propertyName %> = 1.0<% 
                } else if (cx.javaType === "String") {
                    if (cx.smartType === "email") {
%>
        <%= table.classLowerCamel %>.<%= cx.propertyName %> = "any@email.com"<% 
                    } else {
%>
        <%= table.classLowerCamel %>.<%= cx.propertyName %> = "X"<% 
                    }
                } else if (cx.javaType === "Date") {
%>
        <%= table.classLowerCamel %>.<%= cx.propertyName %> = Date()<% 
                }
            } 
        } 
%>
        
        <%= table.classLowerCamel %>.validate(false, EnglishLanguage())
    }

    @Test
    fun testCloneConstructor() {
        val <%= table.classLowerCamel %> = <%= table.className %>() <%
        for (var j in table.columns) { 
            var cx = table.columns[j]; 
            if (cx.referencedTable) { 
%>
        <%= table.classLowerCamel %>.<%= cx.notIdPropertyName %> = <%= cx.referencedTable.className %>()<%
			}
            if (cx.is_nullable === "NO" && (cx.column_key != "PRI" || cx.referencedTable)) { 
                if (cx.javaType === "long") {
%>
        <%= table.classLowerCamel %>.<%= cx.propertyName %> = 1<% 
                } else if (cx.javaType === "double") {
%>
        <%= table.classLowerCamel %>.<%= cx.propertyName %> = 1.0<% 
                } else if (cx.javaType === "String") {
                    if (cx.smartType === "email") {
%>
        <%= table.classLowerCamel %>.<%= cx.propertyName %> = "any@email.com"<% 
                    } else {
%>
        <%= table.classLowerCamel %>.<%= cx.propertyName %> = "X"<% 
                    }
                } else if (cx.javaType === "Date") {
%>
        <%= table.classLowerCamel %>.<%= cx.propertyName %> = Date()<% 
                }
            } 
        } 
        
        for (var i in table.NtoNcolumns) { 
            var col = table.NtoNcolumns[i]; 
%>
        <%= table.classLowerCamel %>.<%= col.NtoNtable.classLowerCamel %> = ArrayList()
        val <%= col.otherTable.classLowerCamel %> = <%= col.otherTable.className %>()
        <%= col.otherTable.classLowerCamel %>.<%= col.otherTable.primaryColumns[0].propertyName %> = 1
        <%= table.classLowerCamel %>.<%= col.NtoNtable.classLowerCamel %>!!.add(<%= col.otherTable.classLowerCamel %>)<%
        }
%>
        
        val clone = <%= table.className %>(<%= table.classLowerCamel %>)<%
for (var j in table.columns) { 
    var cx = table.columns[j]; 
%>
        assertEquals(<%= table.classLowerCamel %>.<%= cx.propertyName %>, clone.<%= cx.propertyName %><% 
    if (cx.javaType === "double") { 
%>, 0.0<% 
    } 
%>)<% 
    if (cx.referencedTable) { 
%>
        assertEquals(<%= table.classLowerCamel %>.<%= cx.notIdPropertyName %>, clone.<%= cx.notIdPropertyName %>)<%
	} 
}
        for (var i in table.NtoNcolumns) { 
            var col = table.NtoNcolumns[i]; 
%>
        assertEquals(<%= table.classLowerCamel %>.<%= col.NtoNtable.classLowerCamel %>, clone.<%= col.NtoNtable.classLowerCamel %>)<%
        }
%>
    }
    
}
