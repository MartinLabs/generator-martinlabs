package <%= props.modelPackage %>;

import br.com.martinlabs.commons.exceptions.RespException;
import java.util.ArrayList;
import java.util.Date;
import org.junit.Test;
import static org.junit.Assert.*;

/**
 *
 * @author martinlabs CRUD generator
 */
public class <%= table.className %>Test {

<%

for (var i in table.columns) { 
    var c = table.columns[i]; 
    if (c.is_nullable === "NO" && (c.column_key != "PRI" || (c.column_key == "PRI" && c.referencedTable)) && (c.javaType === "String" || c.javaType === "Date" || c.referencedTable)) { 
%>
    @Test(expected = RespException.class)
    public void testValidateNo<%= c.propertyNameUpper %>() {
        <%= table.className %> <%= table.classLowerCamel %> = new <%= table.className %>(); <%
        for (var j in table.columns) { 
            var cx = table.columns[j]; 
            if (cx.is_nullable === "NO" && cx.propertyName != c.propertyName && (cx.column_key != "PRI" || cx.referencedTable)) { 
                if (["double", "long"].indexOf(cx.javaType) > -1) {
%>
        <%= table.classLowerCamel %>.set<%= cx.propertyNameUpper %>(1);<% 
                } else if (cx.javaType === "String") {
                    if (cx.smartType === "email") {
%>
        <%= table.classLowerCamel %>.set<%= cx.propertyNameUpper %>("any@email.com");<% 
                    } else {
%>
        <%= table.classLowerCamel %>.set<%= cx.propertyNameUpper %>("X");<% 
                    }
                } else if (cx.javaType === "Date") {
%>
        <%= table.classLowerCamel %>.set<%= cx.propertyNameUpper %>(new Date());<% 
                }
            } 
        } 
%>
        
        <%= table.classLowerCamel %>.validate();
    } 
<%

    }

    if (c.javaType === "String" && c.column_key != "PRI") {
%>
    @Test(expected = RespException.class)
    public void testValidate<%= c.propertyNameUpper %>Length<%= Math.min(65500, c.character_maximum_length) + 1 %>() {
        <%= table.className %> <%= table.classLowerCamel %> = new <%= table.className %>(); <%
        for (var j in table.columns) { 
            var cx = table.columns[j]; 
            if (cx.propertyName == c.propertyName) {
%>
        <%= table.classLowerCamel %>.set<%= cx.propertyNameUpper %>("He<%= new Array(Math.min(65500, cx.character_maximum_length)).join('y') %>");<% 
            } else if (cx.is_nullable === "NO" && (cx.column_key != "PRI" || cx.referencedTable)) { 
                if (["double", "long"].indexOf(cx.javaType) > -1) {
%>
        <%= table.classLowerCamel %>.set<%= cx.propertyNameUpper %>(1);<% 
                } else if (cx.javaType === "String") {
                    if (cx.smartType === "email") {
%>
        <%= table.classLowerCamel %>.set<%= cx.propertyNameUpper %>("any@email.com");<% 
                    } else {
%>
        <%= table.classLowerCamel %>.set<%= cx.propertyNameUpper %>("X");<% 
                    }
                } else if (cx.javaType === "Date") {
%>
        <%= table.classLowerCamel %>.set<%= cx.propertyNameUpper %>(new Date());<% 
                }
            } 
        } 
%>
        
        <%= table.classLowerCamel %>.validate();
    } <%
        if (c.smartType === "email") { %>
    @Test(expected = RespException.class)
    public void testValidate<%= c.propertyNameUpper %>AsInvalidEmail() {
        <%= table.className %> <%= table.classLowerCamel %> = new <%= table.className %>(); <%
        for (var j in table.columns) { 
            var cx = table.columns[j]; 
            if (cx.propertyName == c.propertyName) {
%>
        <%= table.classLowerCamel %>.set<%= cx.propertyNameUpper %>("notAnEmail");<% 
            } else if (cx.is_nullable === "NO" && (cx.column_key != "PRI" || cx.referencedTable)) { 
                if (["double", "long"].indexOf(cx.javaType) > -1) {
%>
        <%= table.classLowerCamel %>.set<%= cx.propertyNameUpper %>(1);<% 
                } else if (cx.javaType === "String") {
                    if (cx.smartType === "email") {
%>
        <%= table.classLowerCamel %>.set<%= cx.propertyNameUpper %>("any@email.com");<% 
                    } else {
%>
        <%= table.classLowerCamel %>.set<%= cx.propertyNameUpper %>("X");<% 
                    }
                } else if (cx.javaType === "Date") {
%>
        <%= table.classLowerCamel %>.set<%= cx.propertyNameUpper %>(new Date());<% 
                }
            } 
        } 
%>
        
        <%= table.classLowerCamel %>.validate();
    } <%
        }
    }

    if (c.referencedTable && c.is_nullable === "YES") { 
%>
    @Test
    public void testSet<%= c.propertyNameUpper %>Null() {
        <%= table.className %> <%= table.classLowerCamel %> = new <%= table.className %>();
        <%= table.classLowerCamel %>.set<%= c.notIdPropertyNameUpper %>(new <%= c.referencedTable.className %>());
        <%= table.classLowerCamel %>.set<%= c.propertyNameUpper %>(null);
        assertNull(<%= table.classLowerCamel %>.get<%= c.notIdPropertyNameUpper %>());
        <%= table.classLowerCamel %>.set<%= c.propertyNameUpper %>(<%= c.javaType === "Long" ? "1L" : c.javaType === "Double" ? "1D" : "" %>);
        assertNotNull(<%= table.classLowerCamel %>.get<%= c.notIdPropertyNameUpper %>());
    }
<%
    }
} 
%>

    @Test
    public void testValidateSuccess() {
        <%= table.className %> <%= table.classLowerCamel %> = new <%= table.className %>(); <%
        for (var j in table.columns) { 
            var cx = table.columns[j]; 
            if (cx.is_nullable === "NO" && (cx.column_key != "PRI" || cx.referencedTable)) { 
                if (["double", "long"].indexOf(cx.javaType) > -1) {
%>
        <%= table.classLowerCamel %>.set<%= cx.propertyNameUpper %>(1);<% 
                } else if (cx.javaType === "String") {
                    if (cx.smartType === "email") {
%>
        <%= table.classLowerCamel %>.set<%= cx.propertyNameUpper %>("any@email.com");<% 
                    } else {
%>
        <%= table.classLowerCamel %>.set<%= cx.propertyNameUpper %>("X");<% 
                    }
                } else if (cx.javaType === "Date") {
%>
        <%= table.classLowerCamel %>.set<%= cx.propertyNameUpper %>(new Date());<% 
                }
            } 
        } 
%>
        
        <%= table.classLowerCamel %>.validate();
    }

    @Test
    public void testCloneConstructor() {
        <%= table.className %> <%= table.classLowerCamel %> = new <%= table.className %>(); <%
        for (var j in table.columns) { 
            var cx = table.columns[j]; 
            if (cx.referencedTable) { 
%>
        <%= table.classLowerCamel %>.set<%= cx.notIdPropertyNameUpper %>(new <%= cx.referencedTable.className %>());<%
			}
            if (cx.is_nullable === "NO" && (cx.column_key != "PRI" || cx.referencedTable)) { 
                if (["double", "long"].indexOf(cx.javaType) > -1) {
%>
        <%= table.classLowerCamel %>.set<%= cx.propertyNameUpper %>(1);<% 
                } else if (cx.javaType === "String") {
                    if (cx.smartType === "email") {
%>
        <%= table.classLowerCamel %>.set<%= cx.propertyNameUpper %>("any@email.com");<% 
                    } else {
%>
        <%= table.classLowerCamel %>.set<%= cx.propertyNameUpper %>("X");<% 
                    }
                } else if (cx.javaType === "Date") {
%>
        <%= table.classLowerCamel %>.set<%= cx.propertyNameUpper %>(new Date());<% 
                }
            } 
        } 
        
        for (var i in table.NtoNcolumns) { 
            var col = table.NtoNcolumns[i]; 
%>
        <%= table.classLowerCamel %>.set<%= col.NtoNtable.className %>(new ArrayList<>());
        <%= col.otherTable.className %> <%= col.otherTable.classLowerCamel %> = new <%= col.otherTable.className %>();
        <%= col.otherTable.classLowerCamel %>.set<%= col.otherTable.primaryColumns[0].propertyNameUpper %>(1);
        <%= table.classLowerCamel %>.get<%= col.NtoNtable.className %>().add(<%= col.otherTable.classLowerCamel %>);<%
        }
%>
        
        <%= table.className %> clone = new <%= table.className %>(<%= table.classLowerCamel %>);<%
for (var j in table.columns) { 
    var cx = table.columns[j]; 
%>
        assertEquals(<%= table.classLowerCamel %>.get<%= cx.propertyNameUpper %>(), clone.get<%= cx.propertyNameUpper %>()<% 
    if (cx.javaType === "double") { 
%>, 0<% 
    } 
%>);<% 
    if (cx.referencedTable) { 
%>
        assertEquals(<%= table.classLowerCamel %>.get<%= cx.notIdPropertyNameUpper %>(), clone.get<%= cx.notIdPropertyNameUpper %>());<%
	} 
}
        for (var i in table.NtoNcolumns) { 
            var col = table.NtoNcolumns[i]; 
%>
        assertEquals(<%= table.classLowerCamel %>.get<%= col.NtoNtable.className %>(), clone.get<%= col.NtoNtable.className %>());<%
        }
%>
    }
    
}
