package <%= props.daoPackage %>;

import br.com.martinlabs.commons.DaoWrapper;
import java.sql.Connection;

/**
 *
 * @author ricardoakiokobayashi
 */
public class LoginServiceDao extends DaoWrapper{
    
    public LoginServiceDao(Connection con) {
        super(con);
    }
    
    public boolean exist(String account, String password) {
        return exist(""
                + "SELECT <%= table.idColumn.column_name %> "
                + "FROM <%= table.name %> "
                + "WHERE <%= table.accountColumn.column_name %> = ? "
                + "AND <%= table.passwordColumn.column_name %> = ? ", 
                account, password);
    }
    
    public Long getID(String account, String password) {
        return selectFirstLong(""
                + "SELECT <%= table.idColumn.column_name %> "
                + "FROM <%= table.name %> "
                + "WHERE <%= table.accountColumn.column_name %> = ? "
                + "AND <%= table.passwordColumn.column_name %> = ? ", 
                account, password);
    }
}
