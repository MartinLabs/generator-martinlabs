package <%= package %>;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import java.io.IOException;
import java.lang.annotation.Annotation;
import java.util.Date;
import javax.ws.rs.ext.ParamConverter;
import javax.ws.rs.ext.ParamConverterProvider;
import java.lang.reflect.Type;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import javax.ws.rs.WebApplicationException;
import javax.ws.rs.container.ContainerRequestContext;
import javax.ws.rs.container.ContainerResponseContext;
import javax.ws.rs.container.ContainerResponseFilter;
import javax.ws.rs.ext.ContextResolver;
import javax.ws.rs.ext.Provider;

/**
 *
 * @author martinlabs CRUD generator
 */
@Provider
public class AppProvider implements ParamConverterProvider, ContextResolver<Gson>, ContainerResponseFilter {

    public static final String DATE_FORMAT = "yyyy-MM-dd'T'HH:mm:ssX"; // set the DATE_FORMAT to whatever you need
    
    @Override
    public <T> ParamConverter<T> getConverter(Class<T> type, Type type1, Annotation[] antns) {
        if (Date.class.equals(type)) {
            @SuppressWarnings("unchecked")
            ParamConverter<T> paramConverter = (ParamConverter<T>) new DateParameterConverter();
            return paramConverter;
        }
        return null;
    }
    
    @Override
    public Gson getContext(final Class<?> type) {
        return new GsonBuilder().setDateFormat(DATE_FORMAT).create();
    }
    
    @Override
    public void filter(ContainerRequestContext request,
            ContainerResponseContext response) throws IOException {
        
        response.getHeaders().add("Access-Control-Allow-Origin", "*");
        response.getHeaders().add("Access-Control-Allow-Methods", "POST, GET, DELETE");
        response.getHeaders().add("Access-Control-Allow-Headers", "Access-Control-Allow-Headers, Origin, Accept, X-Client-Version, Authorization, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers");
    }

    public class DateParameterConverter implements ParamConverter<Date> {

        @Override
        public Date fromString(String string) {
            SimpleDateFormat simpleDateFormat = new SimpleDateFormat(DATE_FORMAT);
            try {
                return simpleDateFormat.parse(string);
            } catch (ParseException ex) {
                throw new WebApplicationException(ex);
            }
        }

        @Override
        public String toString(Date t) {
            return new SimpleDateFormat(DATE_FORMAT).format(t);
        }

    }

}
