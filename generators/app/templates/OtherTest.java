package <%= package %>;

import br.com.martinlabs.commons.EnglishLanguage;
import br.com.martinlabs.commons.LanguageHolder;
import com.google.gson.Gson;
import org.junit.Test;
import static org.junit.Assert.*;

/**
 *
 * @author martinlabs CRUD generator
 */
public class OtherTest {

    @Test
    public void testErrorCodeInstance() {
        ErrorCode ec = new ErrorCode();
    }
    
    @Test
    public void testGsonContextResolver() {
        GsonContextResolver gcr = new GsonContextResolver();
        Gson context = gcr.getContext(null);
        assertNotNull(context);
    }
    
}
