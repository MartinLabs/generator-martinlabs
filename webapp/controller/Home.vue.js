"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});


var generator = require("../../generators/app/generatorForWebapp.js");

exports.default = {
	name: "Home",
	data: function data() {
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
		generate: function generate() {
			generator(this.params, function (err) {
				alert("foi :)");
			});
		}
	}
};
if (module.exports.__esModule) module.exports = module.exports.default
;(typeof module.exports === "function"? module.exports.options: module.exports).template = "\n\n<form @submit=\"generate\">\n\n\t<div class=\"form-group required\">\n        <label for=\"input-path\" class=\"control-label\">\n            Path\n        </label>\n        <input id=\"input-path\" type=\"text\" v-model=\"params.path\" class=\"form-control\" required=\"\">\n    </div>\n\n\t<div class=\"form-group required\">\n        <label for=\"input-modulename\" class=\"control-label\">\n            Modulename\n        </label>\n        <input id=\"input-modulename\" type=\"text\" v-model=\"params.modulename\" class=\"form-control\" required=\"\">\n    </div>\n\n\t<div class=\"form-group required\">\n        <label for=\"input-user\" class=\"control-label\">\n            User\n        </label>\n        <input id=\"input-user\" type=\"text\" v-model=\"params.user\" class=\"form-control\" required=\"\">\n    </div>\n\n\t<div class=\"form-group required\">\n        <label for=\"input-password\" class=\"control-label\">\n            Password\n        </label>\n        <input id=\"input-password\" type=\"text\" v-model=\"params.password\" class=\"form-control\" required=\"\">\n    </div>\n\n\t<div class=\"form-group required\">\n        <label for=\"input-database\" class=\"control-label\">\n            Database\n        </label>\n        <input id=\"input-database\" type=\"text\" v-model=\"params.database\" class=\"form-control\" required=\"\">\n    </div>\n\n\t<div class=\"form-group required\">\n        <label for=\"input-tables\" class=\"control-label\">\n            Tables\n        </label>\n        <input id=\"input-tables\" type=\"text\" v-model=\"params.tables\" class=\"form-control\" required=\"\">\n    </div>\n\n    <!-- <div class=\"form-group\">\n        <div class=\"checkbox\">\n            <label>\n                <input type=\"checkbox\"\n                v-model=\"path.runNpm\"/>\n                Run NPM\n            </label>\n        </div>\n    </div> -->\n\n\t<div class=\"form-group required\">\n        <label for=\"input-logintablename\" class=\"control-label\">\n            Login Table Name\n        </label>\n        <input id=\"input-logintablename\" type=\"text\" v-model=\"params.logintablename\" class=\"form-control\" required=\"\">\n    </div>\n\n\t<div class=\"form-group required\">\n        <label for=\"input-loginaccountcolumn\" class=\"control-label\">\n            login Account Column\n        </label>\n        <input id=\"input-loginaccountcolumn\" type=\"text\" v-model=\"params.loginaccountcolumn\" class=\"form-control\" required=\"\">\n    </div>\n\n\t<div class=\"form-group required\">\n        <label for=\"input-loginpasswordcolumn\" class=\"control-label\">\n            login Password Column\n        </label>\n        <input id=\"input-loginpasswordcolumn\" type=\"text\" v-model=\"params.loginpasswordcolumn\" class=\"form-control\" required=\"\">\n    </div>\n\n\t<div class=\"form-group required\">\n        <label for=\"input-package\" class=\"control-label\">\n            Package\n        </label>\n        <input id=\"input-package\" type=\"text\" v-model=\"params.package\" class=\"form-control\" required=\"\">\n    </div>\n\n\t<div class=\"form-group required\">\n        <label for=\"input-projectName\" class=\"control-label\">\n            Project Name\n        </label>\n        <input id=\"input-projectName\" type=\"text\" v-model=\"params.projectName\" class=\"form-control\" required=\"\">\n    </div>\n\n    <div class=\"form-group\">\n        <button type=\"submit\" class=\"btn btn-primary\">Gerar</button>\n    </div>\n\n</form>\n\n"
if (module.hot) {(function () {  module.hot.accept()
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), true)
  if (!hotAPI.compatible) return
  if (!module.hot.data) {
    hotAPI.createRecord("_v-f13e3244", module.exports)
  } else {
    hotAPI.update("_v-f13e3244", module.exports, (typeof module.exports === "function" ? module.exports.options : module.exports).template)
  }
})()}