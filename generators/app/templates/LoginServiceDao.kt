package <%= props.daoPackage %>

import br.com.martinlabs.commons.DaoWrapper
import br.com.martinlabs.commons.LanguageHolder
import java.sql.Connection

/**
 * Responsible for database login operations
 * @author martinlabs CRUD generator
 */
class LoginServiceDao(con: Connection, lang: LanguageHolder) : DaoWrapper(con, lang) {

    fun getIdOfUser(account: String?, password: String?): Long {
        return nullToZero(selectFirstLong("""
                SELECT idUserPk 
                FROM user 
                WHERE email = ? 
                AND senha = sha2(?, 256) 
                """,
                account, password))
    }
}
