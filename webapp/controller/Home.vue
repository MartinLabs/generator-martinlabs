<template>
    <default>

	    <form @submit="generate">

	    	<div class="form-group required">
                <label for="input-path" 
                    class="control-label">
                    Path
                </label>
                <input id="input-path" 
                    type="text" 
                    v-model="params.path"
                    class="form-control" required/>
            </div>

	    	<div class="form-group required">
                <label for="input-modulename" 
                    class="control-label">
                    Modulename
                </label>
                <input id="input-modulename" 
                    type="text" 
                    v-model="params.modulename"
                    class="form-control" required/>
            </div>

	    	<div class="form-group required">
                <label for="input-user" 
                    class="control-label">
                    User
                </label>
                <input id="input-user" 
                    type="text" 
                    v-model="params.user"
                    class="form-control" required/>
            </div>

	    	<div class="form-group required">
                <label for="input-password" 
                    class="control-label">
                    Password
                </label>
                <input id="input-password" 
                    type="text" 
                    v-model="params.password"
                    class="form-control" required/>
            </div>

	    	<div class="form-group required">
                <label for="input-database" 
                    class="control-label">
                    Database
                </label>
                <input id="input-database" 
                    type="text" 
                    v-model="params.database"
                    class="form-control" required/>
            </div>

	    	<div class="form-group required">
                <label for="input-tables" 
                    class="control-label">
                    Tables
                </label>
                <input id="input-tables" 
                    type="text" 
                    v-model="params.tables"
                    class="form-control" required/>
            </div>

            <!-- <div class="form-group">
                <div class="checkbox">
                    <label>
                        <input type="checkbox"
                        v-model="path.runNpm"/>
                        Run NPM
                    </label>
                </div>
            </div> -->

	    	<div class="form-group required">
                <label for="input-logintablename" 
                    class="control-label">
                    Login Table Name
                </label>
                <input id="input-logintablename" 
                    type="text" 
                    v-model="params.logintablename"
                    class="form-control" required/>
            </div>

	    	<div class="form-group required">
                <label for="input-loginaccountcolumn" 
                    class="control-label">
                    login Account Column
                </label>
                <input id="input-loginaccountcolumn" 
                    type="text" 
                    v-model="params.loginaccountcolumn"
                    class="form-control" required/>
            </div>

	    	<div class="form-group required">
                <label for="input-loginpasswordcolumn" 
                    class="control-label">
                    login Password Column
                </label>
                <input id="input-loginpasswordcolumn" 
                    type="text" 
                    v-model="params.loginpasswordcolumn"
                    class="form-control" required/>
            </div>

	    	<div class="form-group required">
                <label for="input-package" 
                    class="control-label">
                    Package
                </label>
                <input id="input-package" 
                    type="text" 
                    v-model="params.package"
                    class="form-control" required/>
            </div>

	    	<div class="form-group required">
                <label for="input-projectName" 
                    class="control-label">
                    Project Name
                </label>
                <input id="input-projectName" 
                    type="text" 
                    v-model="params.projectName"
                    class="form-control" required/>
            </div>

	    </form>
    </default>

</template>

<script>
var Default = require('./fragment/Default.vue.js');
var generator = require("../../generators/app/generatorForWebapp.js");

export default {
    name: "Home",
    components: { Default },
    data() {
    	return { 
    		params: {
				path: "/Users/gil/Workspace/GeneratorUseCase/",
				modulename: "crud",
			    user: "root",
			    password: "root",
			    database: "usecase",
			    tables: "all tables",
			    runNpm: false,
			    logintablename: "user",
			    loginaccountcolumn: "email",
			    loginpasswordcolumn: "senha",
			    package: "br.com.martinlabs.usecase",
			    projectName: "GeneratorUseCase"
			}
		};
    },
    methods: {
    	generate() {
			generator(this.params, function(err) {
				alert("foi :)");
			});
    	}
    }
}
</script>