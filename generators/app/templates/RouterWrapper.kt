package <%= package %>

import br.com.martinlabs.commons.EnglishLanguage
import br.com.martinlabs.commons.LanguageHolder
import br.com.martinlabs.commons.PortugueseLanguage
import br.com.martinlabs.commons.TransactionPipe
import br.com.martinlabs.commons.exceptions.RespException
import com.google.api.client.util.Strings
import java.util.HashMap
import java.util.logging.Level
import java.util.logging.Logger
import java.util.regex.Matcher
import java.util.regex.Pattern
import javax.ws.rs.core.MediaType
import javax.ws.rs.core.Response
import javax.ws.rs.ext.ExceptionMapper

/**
 * Utility class holding properties and methods for all Routers
 * @author martinlabs CRUD generator
 */
open class RouterWrapper : ExceptionMapper<Throwable> {

    protected var pipe = TransactionPipe("<%= datasource %>")

    protected val langs: HashMap<String, LanguageHolder> = object : HashMap<String, LanguageHolder>() {
        init {
            put("en", EnglishLanguage())
            put("pt", PortugueseLanguage())
        }
    }

    fun getLang(lang: String = "en"): LanguageHolder {
        return langs[lang] ?: EnglishLanguage()
    }

    override fun toResponse(e: Throwable): Response {
        Logger.getLogger(RouterWrapper::class.java.name).log(Level.SEVERE, e.message, e)

        if (e is RespException) {

            var code = ""
            if (e.code != null) {
                code = "\"code\": " + e.code + ", "
            }

            return Response.status(403)
                    .entity("{" + code + " \"message\": \"" + e.message + "\"}")
                    .type(MediaType.APPLICATION_JSON)
                    .build()
        } else {
            return Response.status(500)
                    .entity("{\"message\": \"Invalid Entry\"}")
                    .type(MediaType.APPLICATION_JSON)
                    .build()
        }
    }

    protected fun extractToken(authorization: String): String? {
        if (Strings.isNullOrEmpty(authorization)) {
            return null
        }

        val matcher = Pattern.compile("Bearer (.*)").matcher(authorization)

        return if (!matcher.find()) {
            null
        } else matcher.group(1)

    }

}
