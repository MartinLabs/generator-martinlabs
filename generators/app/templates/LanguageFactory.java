package <%= processPackage %>;

/**
 *
 * @author gil
 */
public class LanguageFactory {

    private static LanguageFactory instance;
    private LanguageFactory() {
    }
    public static LanguageFactory getInstance() {
        if (instance == null) {
            instance = new LanguageFactory();
        }
        
        return instance;
    }
    
    public String cannotBeNull(String propertyName) {
        return propertyName + "cannot be null";
    }
    
    public String lengthCannotBeMoreThan(String propertyName, int size) {
        return propertyName + " length cannot be more than "+size;
    }
    
    public String unexpectedError() {
        return "Unexpected Error. Please try again later";
    }
    
    public String invalidLogin() {
        return "Invalid Login";
    }
    
    public String pleaseLogin() {
        return "Please Login";
    }

}