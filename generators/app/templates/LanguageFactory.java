package <%= processPackage %>;

/**
 *
 * @author martinlabs CRUD generator
 */
public abstract class LanguageFactory {

    private static LanguageFactory instance;
    private LanguageFactory() {
    }
    public static LanguageFactory getInstance() {
        if (instance == null) {
            instance = new EnglishLanguage();
        }
        
        return instance;
    }
    
    public abstract String cannotBeNull(String propertyName);
    public abstract String lengthCannotBeMoreThan(String propertyName, int size);
    public abstract String unexpectedError();
    public abstract String invalidLogin();
    public abstract String pleaseLogin();
    
    public static class EnglishLanguage extends LanguageFactory {
    
        public String cannotBeNull(String propertyName) {
            return propertyName + " cannot be null";
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
    
    public static class PortugueseLanguage extends LanguageFactory {
    
        public String cannotBeNull(String propertyName) {
            return propertyName + " não pode ser vazio";
        }

        public String lengthCannotBeMoreThan(String propertyName, int size) {
            return propertyName + " possui um limite de "+size + " caracteres";
        }

        public String unexpectedError() {
            return "Erro inexperado, tente novamente mais tarde";
        }

        public String invalidLogin() {
            return "Login inválido";
        }

        public String pleaseLogin() {
            return "Por favor, faça login";
        }
    }

}