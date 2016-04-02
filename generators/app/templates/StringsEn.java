package <%= processPackage %>;

/**
 *
 * @author gil
 */
public class StringsEn {

    private static StringsEn instance;
    private StringsEn() {
    }
    public static StringsEn getInstance() {
        if (instance == null) {
            instance = new StringsEn();
        }
        
        return instance;
    }
    
    public String cannotBeNull() {
        return "cannot be null";
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