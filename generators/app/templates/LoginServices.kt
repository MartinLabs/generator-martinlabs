package <%= props.processPackage %>


import <%= props.daoPackage %>.LoginServiceDao
import com.google.gson.Gson
import java.sql.Connection
import <%= props.package %>.ErrorCode
import <%= props.responsePackage %>.LoginResp
import com.simpli.model.LanguageHolder
import com.simpli.model.RespException
import com.simpli.tools.SecurityUtils



/**
 * <%= table.className %> Login Services
 * @author martinlabs CRUD generator
 */
class LoginServices(private val con: Connection, private val lang: LanguageHolder, private val clientVersion: String) {

    fun login(account: String?, password: String?): LoginResp {
        val token = loginToToken(account, password)
        val id = getId(account, password)

        allowAccess(token)

        return LoginResp(token, id)
    }

    fun allowAccess(token: String?): LoginHolderWithId {
        val login = tokenToLogin(token) ?: throw RespException(ErrorCode.INVALID_LOGIN, lang.pleaseLogin())

        val id = getId(login.account, login.password)

        if (id == 0L) {
            throw RespException(ErrorCode.INVALID_LOGIN, lang.pleaseLogin())
        }

        return LoginHolderWithId(login, id)
    }

    fun getId(account: String?, password: String?): Long {
        val dao = LoginServiceDao(con, lang)

        return dao.getIdOf<%= table.className %>(account, password)
    }

    fun loginToToken(account: String?, password: String?): String? {
        var token = Gson().toJson(LoginHolder(account, password))
        token = SecurityUtils.encrypt(token, CRIPTOGRAPHY_HASH)

        token = SecurityUtils.encode(token, "UTF-8")

        return token
    }

    fun tokenToLogin(tokenP: String?): LoginHolder? {
        var token: String? = tokenP ?: return null

        token = SecurityUtils.decode(token ?: "", "UTF-8")
        token = SecurityUtils.decrypt(token ?: "", CRIPTOGRAPHY_HASH)

        if (token == null) {
            return null
        }

        try {
            return Gson().fromJson(token, LoginHolder::class.java)
        } catch (e: Exception) {
            return null
        }

    }

    class LoginHolder(val account: String?, val password: String?)

    class LoginHolderWithId(val loginHolder: LoginHolder, val id: Long)

    companion object {

        val CRIPTOGRAPHY_HASH = "<%= Math.random().toString(36).substring(7) %>"
    }
}