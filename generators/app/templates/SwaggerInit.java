package <%= package %>;

import io.swagger.jaxrs.config.SwaggerContextService;
import io.swagger.models.Info;
import io.swagger.models.Swagger;
import javax.servlet.ServletConfig;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;

/**
 *
 * @author martinlabs CRUD generator
 */
public class SwaggerInit extends HttpServlet {
  @Override
  public void init(ServletConfig config) throws ServletException {
    Info info = new Info()
      .title("<%= projectName %>")
      .description("Welcome to <%= projectName %> API documentation.");

    Swagger swagger = new Swagger().info(info);
    
    new SwaggerContextService().withServletConfig(config).updateSwagger(swagger);
  }
}
