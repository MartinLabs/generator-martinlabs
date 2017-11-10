package <%= props.processPackage %>

import <%= props.modelPackage %>.<%= table.className %><% 
var antiRepeat = [];
for (var i in table.NtoNcolumns) { 
    var cn = table.NtoNcolumns[i]; 
    if (cn != null && antiRepeat.indexOf(cn.otherTable.className) < 0) {
        antiRepeat.push(cn.otherTable.className);
%>
import <%= props.modelPackage %>.<%= cn.otherTable.className %><%
    }
}
%>
import <%= props.responsePackage %>.<%= table.className %>Resp
import com.simpli.model.EnglishLanguage
import com.simpli.model.RespException
import com.simpli.sql.Dao
import com.simpli.sql.DaoTest
import com.simpli.tools.SecurityUtils
import java.sql.Connection
import java.sql.SQLException
import javax.naming.NamingException
import java.util.ArrayList
import java.util.Date
import org.junit.Assert.*
import org.junit.Test
import org.junit.Before

/**
 * Tests <%= table.className %> business logic
 * @author martinlabs CRUD generator
 */
class <%= table.className %>ProcessTest @Throws(NamingException::class, SQLException::class)
constructor() : DaoTest("jdbc/usecaseDS", "usecase") {

    private val con: Connection
    private val loginS: LoginServices
    private val subject: <%= table.className %>Process

    init {
        con = getConnection()
        val lang = EnglishLanguage()
        val clientVersion = "w1.0.0"
        subject = <%= table.className %>Process(con, lang, clientVersion)
        loginS = LoginServices(con, lang, clientVersion)
    }

    @Test
    fun testListNoQuery() {
        val token = loginS.loginToToken("user@gmail.com", SecurityUtils.sha256("abcabc"))
        val query: String? = null
        val page = 0
        val limit = 20
        val orderRequest: String? = null
        val asc: Boolean? = null
                
        val result = subject.list(token, query, page, limit, orderRequest, asc)
        assertNotNull(result)
        assertNotNull(result.list)
        assertNotEquals(result.recordsTotal.toLong(), 0)
        assertFalse(result.list.isEmpty())
        assertNotNull(result.list[0])
    }

    @Test
    fun testListWithQuery() {
        val token = loginS.loginToToken("user@gmail.com", SecurityUtils.sha256("abcabc"))<%

var existPureStringColumn = false
for (var i in table.columns) {
    var c = table.columns[i]
    if (c.javaType === "String" && !c.smartType) {
        existPureStringColumn = true
        break
    }
}
if (existPureStringColumn) {
%>
        val query = "lorem"<% 
} else { 
%>
        val query: String? = "1"<% 
} 
%>
        val page = 0
        val limit = 20
        val orderRequest: String? = null
        val asc: Boolean? = null
                
        val result = subject.list(token, query, page, limit, orderRequest, asc)
        assertNotNull(result)
        assertNotNull(result.list)
        assertNotEquals(result.recordsTotal.toLong(), 0)
        assertFalse(result.list.isEmpty())
        assertNotNull(result.list[0])
    }

    @Test
    fun testGetOne() {
        val token = loginS.loginToToken("user@gmail.com", SecurityUtils.sha256("abcabc"))

        val result = subject.getOne(<% 
for (var k in table.primaryColumns) {
    %>1L, <%
}
            %>token)
        assertNotNull(result)
        assertNotNull(result.<%= table.classLowerCamel %>)<%
antiRepeat = []
for (var j in table.columns) { 
    var cx = table.columns[j] 
    if (cx.referencedTable && antiRepeat.indexOf(cx.referencedTable.className) < 0) {
        antiRepeat.push(cx.referencedTable.className)
%>
        assertFalse(result.all<%= cx.referencedTable.className %>!!.isEmpty())
        assertNotNull(result.all<%= cx.referencedTable.className %>!![0])<%
    }
}

antiRepeat = []
for (var j in table.NtoNcolumns) { 
    var cx = table.NtoNcolumns[j] 
    if (antiRepeat.indexOf(cx.otherTable.className) < 0) {
        antiRepeat.push(cx.otherTable.className)
%>
        assertFalse(result.all<%= cx.otherTable.className %>!!.isEmpty())
        assertNotNull(result.all<%= cx.otherTable.className %>!![0])
<%
    }
}
%>
    }
<%
for (var i in table.columns) { 
    var c = table.columns[i]

    if (c.column_key === "UNI") {
%>
    @Test(expected = RespException::class)
    fun testPersistWithRepeated<%= c.propertyNameUpper %>() {
        val token = loginS.loginToToken("user@gmail.com", SecurityUtils.sha256("abcabc"))
        val <%= table.classLowerCamel %> = <%= table.className %>() <%
        for (var j in table.columns) { 
            var cx = table.columns[j] 
            if (cx.is_nullable === "NO" && (cx.column_key != "PRI" || cx.referencedTable) && cx.column_name != c.column_name) { 
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

        if (c.javaType === "long") {
%>
        <%= table.classLowerCamel %>.<%= c.propertyName %> = 1<% 
                } else if (c.javaType === "double") {
%>
        <%= table.classLowerCamel %>.<%= c.propertyName %> = 1.0<%
        } else if (c.javaType === "String") {
            if (c.smartType === "email") {
%>
        <%= table.classLowerCamel %>.<%= c.propertyName %> = "lorem@email.com"<% 
            } else {
%>
        <%= table.classLowerCamel %>.<%= c.propertyName %> = "lorem"<% 
            }
        }

%>
        
        subject.persist(<%= table.classLowerCamel %>, token)
    }
<%
    }
}
%>
    @Test
    fun testPersist() {
        val token = loginS.loginToToken("user@gmail.com", SecurityUtils.sha256("abcabc"))
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
        
        val result = subject.persist(<%= table.classLowerCamel %>, token)
        assertNotNull(result)
        assertTrue(result ?: 0 > 0)
    }
<% 

for (var i in table.NtoNcolumns) { 
    var col = table.NtoNcolumns[i]; 
%>
    @Test
    fun testPersistWith<%= col.NtoNtable.className %>() {
        val token = loginS.loginToToken("user@gmail.com", SecurityUtils.sha256("abcabc"))
        val <%= table.classLowerCamel %> = <%= table.className %>() <%
    for (var j in table.columns) { 
        var cx = table.columns[j] 
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
        <%= table.classLowerCamel %>.<%= col.NtoNtable.classLowerCamel %> = ArrayList()
        val <%= col.otherTable.classLowerCamel %> = <%= col.otherTable.className %>()
        <%= col.otherTable.classLowerCamel %>.<%= col.otherTable.primaryColumns[0].propertyName %> = 1
        <%= table.classLowerCamel %>.<%= col.NtoNtable.classLowerCamel %>!!.add(<%= col.otherTable.classLowerCamel %>)
        
        val result = subject.persist(<%= table.classLowerCamel %>, token)
        assertNotNull(result)
        assertTrue(result ?: 0 > 0)
    }
<% 
} 

if (!table.primaryColumns[0].referencedTable) { 
%>
    @Test
    fun testPersistUpdating() {
        val token = loginS.loginToToken("user@gmail.com", SecurityUtils.sha256("abcabc"))
        val <%= table.classLowerCamel %> = <%= table.className %>() 
        <%= table.classLowerCamel %>.<%= table.primaryColumns[0].propertyName %> = 1<%
    for (var j in table.columns) { 
        var cx = table.columns[j]; 
        if (cx.is_nullable === "NO" && cx.column_key != "PRI") { 
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
        
        val result = subject.persist(<%= table.classLowerCamel %>, token)
        assertNotNull(result)
        assertTrue(result ?: 0 > 0)
    }
<% 
} else { 
%>
    @Test
    fun testPersistInserting() {
        val token = loginS.loginToToken("user@gmail.com", SecurityUtils.sha256("abcabc"))
        val <%= table.classLowerCamel %> = <%= table.className %>()
<% 
    for (var i in table.primaryColumns) {
        var primaryCol = table.primaryColumns[i]
%>
        val <%= primaryCol.propertyName %> = Dao.updateForTest(con, """
            INSERT INTO <%= primaryCol.referencedTable.name %> ( <% 
        var colocarVirgula = false;
        for (var i in primaryCol.referencedTable.columns) { 
            var c = primaryCol.referencedTable.columns[i]; 
            if (c.extra !== "auto_increment" && c.is_nullable === "NO") { 
%>
            <%= colocarVirgula ? ',' : '' %><%= c.column_name %><% 
                colocarVirgula = true;
            }
        } 
        if (!colocarVirgula) {
            for (var i in primaryCol.referencedTable.columns) { 
                var c = primaryCol.referencedTable.columns[i]; 
                if (c.extra !== "auto_increment") { 
%>
            <%= c.column_name %><% 
                    break;
                }
            } 
        }
        colocarVirgula = false;
%>
            ) VALUES (
            <% 
        for (var i in primaryCol.referencedTable.columns) { 
            var c = primaryCol.referencedTable.columns[i]; 
            if (c.extra !== 'auto_increment' && c.is_nullable === 'NO') {
                %><%= colocarVirgula ? ',' : '' %>?<% 
                colocarVirgula = true;
            }
        }
        if (!colocarVirgula) {
            %>?<%
        }

         %>
            )
            """,<% 
        colocarVirgula = false;
        for (var i in primaryCol.referencedTable.columns) { 
            var c = primaryCol.referencedTable.columns[i]; 
            if (c.extra !== "auto_increment" && c.is_nullable === "NO") { %><%= colocarVirgula ? ',' : '' %><% 
                if (["double", "long", "boolean"].indexOf(c.javaType) > -1) { 
%>
            1<% 
                } else if (c.javaType === "String") { 
%>
            "X"<% 
                } else if (c.javaType === "Date") { 
%>
            Date()<% 
                }
                colocarVirgula = true;
            }
        } 
        if (!colocarVirgula) {
            for (var i in primaryCol.referencedTable.columns) { 
                var c = primaryCol.referencedTable.columns[i]; 
                if (c.extra !== "auto_increment") {
                    if (["double", "long", "boolean"].indexOf(c.javaType) > -1) { 
%>
            1<% 
                    } else if (c.javaType === "String") { 
%>
            "X"<% 
                    } else if (c.javaType === "Date") { 
%>
            Date()<% 
                    }
                    break;
                }
            }
        }

        %>).key
         
        <%= table.classLowerCamel %>.<%= primaryCol.propertyName %> = <%= primaryCol.propertyName %>
<%
    }

    for (var j in table.columns) { 
        var cx = table.columns[j]; 
        if (cx.is_nullable === "NO" && cx.column_key != "PRI") { 
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
        
        val result = subject.persist(<%= table.classLowerCamel %>, token)
        assertNotNull(result)
        assertTrue(result ?: 0 > 0)
    }
<% 
} 
if (table.deactivableColumn) {
%>
    @Test
    fun testRemove() {
        val token = loginS.loginToToken("user@gmail.com", SecurityUtils.sha256("abcabc"))
        
        subject.remove(<% 
    for (var k in table.primaryColumns) {
        %>1L, <%
    }
            %>token)
    }
<% 
}
%>
}
