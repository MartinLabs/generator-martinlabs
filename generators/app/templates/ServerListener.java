package <%= processPackage %>;

import br.com.martinlabs.commons.LanguageHolder;
import br.com.martinlabs.commons.EnglishLanguage;
import javax.servlet.ServletContextEvent;

/**
 *
 * @author martinlabs CRUD generator
 */
public class ServerListener implements javax.servlet.ServletContextListener {

    @Override
    public void contextInitialized(ServletContextEvent sce) {
        LanguageHolder.instance = new EnglishLanguage();
    }

    @Override
    public void contextDestroyed(ServletContextEvent sce) {
    }

}