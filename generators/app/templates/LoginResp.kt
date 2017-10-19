package <%= props.responsePackage %>

import io.swagger.annotations.ApiModel

@ApiModel(value = "Contains a valid login information")
class LoginResp(var token: String?, var id: Long)