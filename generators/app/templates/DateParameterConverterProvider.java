package <%= package %>;

import java.lang.annotation.Annotation;
import java.util.Date;
import javax.ws.rs.ext.ParamConverter;
import javax.ws.rs.ext.ParamConverterProvider;
import java.lang.reflect.Type;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import javax.ws.rs.WebApplicationException;
import javax.ws.rs.ext.Provider;

/**
 *
 * @author martinlabs CRUD generator
 */
@Provider
public class DateParameterConverterProvider implements ParamConverterProvider {

    @Override
    public <T> ParamConverter<T> getConverter(Class<T> type, Type type1, Annotation[] antns) {
        if (Date.class.equals(type)) {
            @SuppressWarnings("unchecked")
            ParamConverter<T> paramConverter = (ParamConverter<T>) new DateParameterConverter();
            return paramConverter;
        }
        return null;
    }

    public class DateParameterConverter implements ParamConverter<Date> {

        public static final String format = "yyyy-MM-dd'T'HH:mm:ssX"; // set the format to whatever you need

        @Override
        public Date fromString(String string) {
            SimpleDateFormat simpleDateFormat = new SimpleDateFormat(format);
            try {
                return simpleDateFormat.parse(string);
            } catch (ParseException ex) {
                throw new WebApplicationException(ex);
            }
        }

        @Override
        public String toString(Date t) {
            return new SimpleDateFormat(format).format(t);
        }

    }

}
