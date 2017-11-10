package <%= package %>

import com.google.gson.Gson
import com.google.gson.GsonBuilder
import java.io.IOException
import java.util.Date
import javax.ws.rs.ext.ParamConverter
import javax.ws.rs.ext.ParamConverterProvider
import java.lang.reflect.Type
import java.text.ParseException
import java.text.SimpleDateFormat
import javax.ws.rs.WebApplicationException
import javax.ws.rs.container.ContainerRequestContext
import javax.ws.rs.container.ContainerResponseContext
import javax.ws.rs.container.ContainerResponseFilter
import javax.ws.rs.ext.ContextResolver
import javax.ws.rs.ext.Provider

/**
 * Provides rules for all requests
 * @author martinlabs CRUD generator
 */
@Provider
class AppProvider : ParamConverterProvider, ContextResolver<Gson>, ContainerResponseFilter {

    override fun <T> getConverter(type: Class<T>?, type1: Type?, antns: Array<Annotation>?): ParamConverter<T>? {
        return if (type is Date || Date::class.java == type) {
            DateParameterConverter() as ParamConverter<T>
        } else null
    }

    override fun getContext(type: Class<*>?): Gson {
        return GsonBuilder().setDateFormat(DATE_FORMAT).create()
    }

    @Throws(IOException::class)
    override fun filter(request: ContainerRequestContext,
                        response: ContainerResponseContext) {

        response.headers.add("Access-Control-Allow-Origin", "*")
        response.headers.add("Access-Control-Allow-Methods", "POST, GET, DELETE")
        response.headers.add("Access-Control-Allow-Headers", "Access-Control-Allow-Headers, Origin, Accept, X-Client-Version, Authorization, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers")
    }

    inner class DateParameterConverter : ParamConverter<Date> {

        override fun fromString(string: String): Date {
            val simpleDateFormat = SimpleDateFormat(DATE_FORMAT)
            try {
                return simpleDateFormat.parse(string)
            } catch (ex: ParseException) {
                throw WebApplicationException(ex)
            }

        }

        override fun toString(t: Date): String {
            return SimpleDateFormat(DATE_FORMAT).format(t)
        }

    }

    companion object {

        val DATE_FORMAT = "yyyy-MM-dd'T'HH:mm:ssX" // set the DATE_FORMAT to whatever you need
    }

}
