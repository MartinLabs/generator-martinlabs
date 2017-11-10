package <%= props.processPackage %>

import com.simpli.model.EnglishLanguage
import com.simpli.model.RespException
import com.simpli.sql.DaoTest
import com.simpli.tools.SecurityUtils
import <%= props.responsePackage %>.LoginResp
import java.sql.Connection
import java.sql.SQLException
import javax.naming.NamingException
import org.junit.Test
import org.junit.Assert.*

/**
 * Tests the login service
 * @author martinlabs CRUD generator
 */
class LoginServicesTest @Throws(NamingException::class, SQLException::class)
constructor() : DaoTest("<%= props.datasource %>", "<%= props.database %>") {

    private val subject: LoginServices
    private val token: String?

    init {
        val con = getConnection()
        val lang = EnglishLanguage()
        val clientVersion = "w1.0.0"
        subject = LoginServices(con, lang, clientVersion)
        token = subject.loginToToken("user@gmail.com", SecurityUtils.sha256("abcabc"))
    }

    @Test(expected = RespException::class)
    fun testLoginNull() {
        subject.login(null, null)
    }

    @Test(expected = RespException::class)
    fun testLoginFail() {
        subject.login("user@gmail.com", SecurityUtils.sha256("wrongpassword"))
    }

    @Test
    fun testLoginAdmin() {
        val result = subject.login("user@gmail.com", SecurityUtils.sha256("abcabc"))
        assertEquals(token,
                result.token)
    }

    @Test(expected = RespException::class)
    fun testAllowAccessFail() {
        subject.allowAccess("Hey")
    }

    @Test
    fun testAllowAccess() {
        subject.allowAccess(token)
    }

    @Test
    fun testGetIdFail() {
        val result = subject.getId(null, null)
        assertEquals(result, 0)
    }

    @Test
    fun testGetId() {
        val result = subject.getId("user@gmail.com", SecurityUtils.sha256("abcabc"))
        assertNotEquals(result, 0)
    }

    @Test
    fun testTokenToLoginNull() {
        val result = subject.tokenToLogin(null)
        assertNull(result)
    }

    @Test
    fun testTokenToLoginWithTokenNotACoolJson() {
        var tokenOtherObject = SecurityUtils.encrypt("Hey", LoginServices.CRIPTOGRAPHY_HASH)

        tokenOtherObject = SecurityUtils.encode(tokenOtherObject!!, "UTF-8")

        val result = subject.tokenToLogin(tokenOtherObject)
        assertNull(result)
    }

    @Test
    fun testLoginToToken() {
        val result = subject.loginToToken("user@gmail.com", SecurityUtils.sha256("abcabc"))
        assertEquals(token,
                result)
    }

    @Test
    fun testLoginHolder() {
        val lh = LoginServices.LoginHolder("a", "1")
        assertEquals("a", lh.account)
        assertEquals("1", lh.password)
    }

    @Test
    fun testLoginHolderWithId() {
        val lh = LoginServices.LoginHolderWithId(LoginServices.LoginHolder("a", "1"), 2)
        assertNotNull(lh.loginHolder)
        assertEquals(2, lh.id)
    }

}