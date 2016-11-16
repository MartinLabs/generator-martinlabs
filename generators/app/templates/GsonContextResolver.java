package <%= package %>;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import javax.ws.rs.ext.ContextResolver;
import javax.ws.rs.ext.Provider;

/**
 *
 * @author martinlabs CRUD generator
 */
@Provider
public class GsonContextResolver implements ContextResolver<Gson> {
    @Override
    public Gson getContext(final Class<?> type) {
        return new GsonBuilder().setDateFormat("yyyy-MM-dd'T'HH:mm:ssX").create();
    }
}
