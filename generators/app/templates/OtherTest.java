package <%= package %>;

import <%= package %>.AppProvider.DateParameterConverter;
import com.google.gson.Gson;
import java.util.Date;
import org.junit.Test;
import static org.junit.Assert.*;

/**
 * Test other services
 * @author martinlabs CRUD generator
 */
public class OtherTest {

    @Test
    public void testErrorCodeInstance() {
        ErrorCode ec = new ErrorCode();
    }
    
    @Test
    public void testAppProvider() {
        AppProvider appProvider = new AppProvider();
        
        Gson context = appProvider.getContext(null);
        DateParameterConverter converter = (DateParameterConverter) appProvider.getConverter(Date.class, null, null);
        
        assertNotNull(context);
        assertNotNull(converter);
    }
    
}
