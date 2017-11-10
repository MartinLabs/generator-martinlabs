package <%= props.daoPackage %>

import com.simpli.model.LanguageHolder
import com.simpli.sql.Dao
import java.sql.Connection

/**
 * Responsible for database login operations
 * @author martinlabs CRUD generator
 */
class LoginServiceDao(con: Connection, lang: LanguageHolder) : Dao(con, lang) {

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
