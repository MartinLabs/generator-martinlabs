package <%= responsePackage %>;

/**
 *
 * @author martinlabs CRUD generator
 */
public class LoginResp {
    
    private String token;
    private long id;

    public LoginResp(String token, long id) {
        this.token = token;
        this.id = id;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

}
