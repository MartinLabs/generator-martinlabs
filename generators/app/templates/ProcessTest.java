package <%= props.processPackage %>;

import br.com.martinlabs.commons.DaoUnitTestWrapper;
import br.com.martinlabs.commons.DaoWrapper;
import <%= props.modelPackage %>.<%= table.className %>;<% 
var antiRepeat = [];
for (var i in table.NtoNcolumns) { 
    var cn = table.NtoNcolumns[i]; 
    if (cn != null && antiRepeat.indexOf(cn.otherTable.className) < 0) {
        antiRepeat.push(cn.otherTable.className);
%>
import <%= props.modelPackage %>.<%= cn.otherTable.className %>;<%
    }
}
%>
import <%= props.responsePackage %>.<%= table.className %>Resp;
import br.com.martinlabs.commons.PagedResp;
import br.com.martinlabs.commons.SecurityUtils;
import br.com.martinlabs.commons.exceptions.RespException;
import java.sql.Connection;
import java.util.ArrayList;
import java.util.Date;
import static org.junit.Assert.*;
import org.junit.Test;
import org.junit.Before;

/**
 *
 * @author martinlabs CRUD generator
 */
public class <%= table.className %>ProcessTest extends DaoUnitTestWrapper {

    private Connection con;
    private LoginServices loginS;
    private <%= table.className %>Process subject;

    public <%= table.className %>ProcessTest() {
        super("<%= props.datasource %>", "<%= props.database %>");
    }
    
    @Before
    public void setUp() throws Exception {
        super.setUp();
        con = getConnection();
        subject = new <%= table.className %>Process(con);
        loginS = new LoginServices(con);
    }

    @Test(expected = RespException.class)
    public void testListPageNull() {
        String token = loginS.loginToToken("user@gmail.com", SecurityUtils.sha1("abcabc"));
        String query = null;
        Integer page = null;
        Integer limit = 20;
        String orderRequest = null;
        Boolean asc = null;
                
        subject.list(token, query, page, limit, orderRequest, asc);
    }

    @Test(expected = RespException.class)
    public void testListLimitNull() {
        String token = loginS.loginToToken("user@gmail.com", SecurityUtils.sha1("abcabc"));
        String query = null;
        Integer page = 0;
        Integer limit = null;
        String orderRequest = null;
        Boolean asc = null;
                
        subject.list(token, query, page, limit, orderRequest, asc);
    }

    @Test
    public void testListNoQuery() {
        String token = loginS.loginToToken("user@gmail.com", SecurityUtils.sha1("abcabc"));
        String query = null;
        Integer page = 0;
        Integer limit = 20;
        String orderRequest = null;
        Boolean asc = null;
                
        PagedResp<<%= table.className %>> result = subject.list(token, query, page, limit, orderRequest, asc);
        assertNotNull(result);
        assertNotNull(result.getList());
        assertNotEquals(result.getCount(), 0);
        assertFalse(result.getList().isEmpty());
        assertNotNull(result.getList().get(0));
    }

    @Test
    public void testListWithQuery() {
        String token = loginS.loginToToken("user@gmail.com", SecurityUtils.sha1("abcabc"));
        String query = "lorem";
        Integer page = 0;
        Integer limit = 20;
        String orderRequest = null;
        Boolean asc = null;
                
        PagedResp<<%= table.className %>> result = subject.list(token, query, page, limit, orderRequest, asc);
        assertNotNull(result);
        assertNotNull(result.getList());
        assertNotEquals(result.getCount(), 0);
        assertFalse(result.getList().isEmpty());
        assertNotNull(result.getList().get(0));
    }

    @Test
    public void testGet() {
        String token = loginS.loginToToken("user@gmail.com", SecurityUtils.sha1("abcabc"));
        long id = 1;

        <%= table.className %>Resp result = subject.get(id, token);
        assertNotNull(result);
        assertNotNull(result.get<%= table.className %>());<%
antiRepeat = [];
for (var j in table.columns) { 
    var cx = table.columns[j]; 
    if (cx.referencedTable && antiRepeat.indexOf(cx.referencedTable.className) < 0) {
        antiRepeat.push(cx.referencedTable.className);%>
        assertFalse(result.getAll<%= cx.referencedTable.className %>().isEmpty());
        assertNotNull(result.getAll<%= cx.referencedTable.className %>().get(0));<%
    }
}

antiRepeat = [];
for (var j in table.NtoNcolumns) { 
    var cx = table.NtoNcolumns[j]; 
    if (antiRepeat.indexOf(cx.otherTable.className) < 0) {
        antiRepeat.push(cx.otherTable.className);
%>
        assertFalse(result.getAll<%= cx.otherTable.className %>().isEmpty());
        assertNotNull(result.getAll<%= cx.otherTable.className %>().get(0));
<%
    }
}
%>
    }
<%

for (var i in table.columns) { 
    var c = table.columns[i]; 
    if (c.is_nullable === "NO" && (c.propertyName != table.idColumn.propertyName || (c.propertyName == table.idColumn.propertyName && c.referencedTable)) && (c.javaType === "String" || c.javaType === "Date" || c.referencedTable)) { 
%>
    @Test(expected = RespException.class)
    public void testPersistNo<%= c.propertyNameUpper %>() {
        String token = loginS.loginToToken("user@gmail.com", SecurityUtils.sha1("abcabc"));
        <%= table.className %> <%= table.classLowerCamel %> = new <%= table.className %>(); <%
        for (var j in table.columns) { 
		    var cx = table.columns[j]; 
		    if (cx.is_nullable === "NO" && cx.propertyName != c.propertyName && (cx.propertyName != table.idColumn.propertyName || cx.referencedTable)) { 
		    	if (["double", "long"].indexOf(cx.javaType) > -1) {
    	%>
        <%= table.classLowerCamel %>.set<%= cx.propertyNameUpper %>(1);<% 
        		} else if (cx.javaType === "String") {
    	%>
        <%= table.classLowerCamel %>.set<%= cx.propertyNameUpper %>("Hey");<% 
        		} else if (cx.javaType === "Date") {
    	%>
        <%= table.classLowerCamel %>.set<%= cx.propertyNameUpper %>(new Date());<% 
        		}
		    } 
		} 
		%>
        
        subject.persist(<%= table.classLowerCamel %>, token);
    } 
    <%

    }

    if (c.javaType === "String" && c.propertyName != table.idColumn.propertyName) {
        %>
    @Test(expected = RespException.class)
    public void testPersist<%= c.propertyNameUpper %>Length<%= c.character_maximum_length + 1 %>() {
        String token = loginS.loginToToken("user@gmail.com", SecurityUtils.sha1("abcabc"));
        <%= table.className %> <%= table.classLowerCamel %> = new <%= table.className %>(); <%
        for (var j in table.columns) { 
		    var cx = table.columns[j]; 
		    if (cx.propertyName == c.propertyName) {
		%>
        <%= table.classLowerCamel %>.set<%= cx.propertyNameUpper %>("He<%= new Array(cx.character_maximum_length).join('y') %>");<% 
		    } else if (cx.is_nullable === "NO" && (cx.propertyName != table.idColumn.propertyName || cx.referencedTable)) { 
		    	if (["double", "long"].indexOf(cx.javaType) > -1) {
    	%>
        <%= table.classLowerCamel %>.set<%= cx.propertyNameUpper %>(1);<% 
        		} else if (cx.javaType === "String") {
    	%>
        <%= table.classLowerCamel %>.set<%= cx.propertyNameUpper %>("Hey");<% 
        		} else if (cx.javaType === "Date") {
    	%>
        <%= table.classLowerCamel %>.set<%= cx.propertyNameUpper %>(new Date());<% 
        		}
		    } 
		} 
		%>
        
        subject.persist(<%= table.classLowerCamel %>, token);
    } <%
    }

} %>

    @Test
    public void testPersist() {
        String token = loginS.loginToToken("user@gmail.com", SecurityUtils.sha1("abcabc"));
        <%= table.className %> <%= table.classLowerCamel %> = new <%= table.className %>(); <%
        for (var j in table.columns) { 
		    var cx = table.columns[j]; 
		    if (cx.is_nullable === "NO" && (cx.propertyName != table.idColumn.propertyName || cx.referencedTable)) { 
		    	if (["double", "long"].indexOf(cx.javaType) > -1) {
    	%>
        <%= table.classLowerCamel %>.set<%= cx.propertyNameUpper %>(1);<% 
        		} else if (cx.javaType === "String") {
    	%>
        <%= table.classLowerCamel %>.set<%= cx.propertyNameUpper %>("Hey");<% 
        		} else if (cx.javaType === "Date") {
    	%>
        <%= table.classLowerCamel %>.set<%= cx.propertyNameUpper %>(new Date());<% 
        		}
		    } 
		} 
		%>
        
        Long result = subject.persist(<%= table.classLowerCamel %>, token);
        assertNotNull(result);
        assertTrue(result > 0);
    }
<% for (var i in table.NtoNcolumns) { var col = table.NtoNcolumns[i]; %>
    @Test
    public void testPersistWith<%= col.NtoNtable.className %>() {
        String token = loginS.loginToToken("user@gmail.com", SecurityUtils.sha1("abcabc"));
        <%= table.className %> <%= table.classLowerCamel %> = new <%= table.className %>(); <%
        for (var j in table.columns) { 
		    var cx = table.columns[j]; 
		    if (cx.is_nullable === "NO" && (cx.propertyName != table.idColumn.propertyName || cx.referencedTable)) { 
		    	if (["double", "long"].indexOf(cx.javaType) > -1) {
    	%>
        <%= table.classLowerCamel %>.set<%= cx.propertyNameUpper %>(1);<% 
        		} else if (cx.javaType === "String") {
    	%>
        <%= table.classLowerCamel %>.set<%= cx.propertyNameUpper %>("Hey");<% 
        		} else if (cx.javaType === "Date") {
    	%>
        <%= table.classLowerCamel %>.set<%= cx.propertyNameUpper %>(new Date());<% 
        		}
		    } 
		} 
		%>
        <%= table.classLowerCamel %>.set<%= col.NtoNtable.className %>(new ArrayList<>());
		<%= col.otherTable.className %> <%= col.otherTable.classLowerCamel %> = new <%= col.otherTable.className %>();
        <%= col.otherTable.classLowerCamel %>.set<%= col.otherTable.idColumn.propertyNameUpper %>(1);
        <%= table.classLowerCamel %>.get<%= col.NtoNtable.className %>().add(<%= col.otherTable.classLowerCamel %>);
        
        Long result = subject.persist(<%= table.classLowerCamel %>, token);
        assertNotNull(result);
        assertTrue(result > 0);
    }
<% } %>
<% if (!table.idColumn.referencedTable) { %>
    @Test
    public void testPersistUpdating() {
        String token = loginS.loginToToken("user@gmail.com", SecurityUtils.sha1("abcabc"));
        <%= table.className %> <%= table.classLowerCamel %> = new <%= table.className %>(); 
        <%= table.classLowerCamel %>.set<%= table.idColumn.propertyNameUpper %>(1);<%
        for (var j in table.columns) { 
		    var cx = table.columns[j]; 
		    if (cx.is_nullable === "NO" && cx.propertyName != table.idColumn.propertyName) { 
		    	if (["double", "long"].indexOf(cx.javaType) > -1) {
    	%>
        <%= table.classLowerCamel %>.set<%= cx.propertyNameUpper %>(1);<% 
        		} else if (cx.javaType === "String") {
    	%>
        <%= table.classLowerCamel %>.set<%= cx.propertyNameUpper %>("Hey");<% 
        		} else if (cx.javaType === "Date") {
    	%>
        <%= table.classLowerCamel %>.set<%= cx.propertyNameUpper %>(new Date());<% 
        		}
		    } 
		} 
		%>
        
        Long result = subject.persist(<%= table.classLowerCamel %>, token);
        assertNotNull(result);
        assertTrue(result > 0);
    }
<% } else { %>
    @Test
    public void testPersistInserting() {
        String token = loginS.loginToToken("user@gmail.com", SecurityUtils.sha1("abcabc"));
        
        long id = DaoWrapper.updateForTest(con, "INSERT INTO <%= table.idColumn.referencedTable.name %> ( "<% 
        var colocarVirgula = false;
        for (var i in table.idColumn.referencedTable.columns) { 
            var c = table.idColumn.referencedTable.columns[i]; 
            if (c.extra !== "auto_increment" && c.is_nullable === "NO") { %>
            + "<%= colocarVirgula ? ',' : '' %><%= c.column_name %> "<% 
                colocarVirgula = true;
            }
        } 
        colocarVirgula = false;
        %>
            + ") VALUES ( "
            + "<% for (var i in table.idColumn.referencedTable.columns) { 
                var c = table.idColumn.referencedTable.columns[i]; 
                if (c.extra !== 'auto_increment' && c.is_nullable === 'NO') {
                    %><%= colocarVirgula ? ',' : '' %>?<% 
                    colocarVirgula = true;
                }
            } %>"
            + ") ",<% 
        colocarVirgula = false;
        for (var i in table.idColumn.referencedTable.columns) { 
            var c = table.idColumn.referencedTable.columns[i]; 
            if (c.extra !== "auto_increment" && c.is_nullable === "NO") { %><%= colocarVirgula ? ',' : '' %><% 
                if (["double", "long", "boolean"].indexOf(c.javaType) > -1) { %>
            1<% 
                } else if (c.javaType === "String") { 
            %>
            "Hey"<% 
                } else if (c.javaType === "Date") { 
            %>
            new Date()<% 
                }
                colocarVirgula = true;
            }
        } %>).key;
        
        <%= table.className %> <%= table.classLowerCamel %> = new <%= table.className %>(); 
        <%= table.classLowerCamel %>.set<%= table.idColumn.propertyNameUpper %>(id);<%
        for (var j in table.columns) { 
            var cx = table.columns[j]; 
            if (cx.is_nullable === "NO" && cx.propertyName != table.idColumn.propertyName) { 
                if (["double", "long"].indexOf(cx.javaType) > -1) {
        %>
        <%= table.classLowerCamel %>.set<%= cx.propertyNameUpper %>(1);<% 
                } else if (cx.javaType === "String") {
        %>
        <%= table.classLowerCamel %>.set<%= cx.propertyNameUpper %>("Hey");<% 
                } else if (cx.javaType === "Date") {
        %>
        <%= table.classLowerCamel %>.set<%= cx.propertyNameUpper %>(new Date());<% 
                }
            } 
        } 
        %>
        
        Long result = subject.persist(<%= table.classLowerCamel %>, token);
        assertNotNull(result);
        assertTrue(result > 0);
    }
<% } %>
}
