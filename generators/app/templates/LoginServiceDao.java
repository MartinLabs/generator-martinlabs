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
    
    public long getId(String account, String password) {
        return nullToZero(selectFirstLong(""
                + "SELECT <%= table.primaryColumns[0].column_name %> "
                + "FROM <%= table.name %> "
                + "WHERE <%= table.accountColumn.column_name %> = ? "
                + "AND <%= table.passwordColumn.column_name %> = sha1(?) ", 
                account, password));
    }
}
