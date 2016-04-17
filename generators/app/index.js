'use strict';
var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var yosay = require('yosay');
var mysql = require('mysql');
var xml2js = require('xml2js');
var fs = require('fs');
var mkdirp = require('mkdirp');
var astQuery = require("ast-query");
var jsonfile = require('jsonfile');

module.exports = yeoman.generators.Base.extend({

    readConfig: function() {
        this.props = this.config.get("props") || {};
    },

    promptMain: function () {
        var done = this.async();

        this.log(yosay(
            'Welcome to ' + chalk.bgBlack.white(' Martinlabs ') + ' CRUD generator ;)'
            ));

        var prompts = [{
            type: 'input',
            name: 'modulename',
            message: 'What is the name of this module?',
            default: this.props.modulename || "crud"
        },{
            type: 'input',
            name: 'user',
            message: 'Tell me your Mysql User',
            default: this.props.user
        },{
            type: 'password',
            name: 'password',
            message: 'Tell me your Mysql Password',
            default: this.props.password
        },{
            type: 'input',
            name: 'database',
            message: 'What is the database name?',
            default: this.props.database
        },{
            type: 'input',
            name: 'tables',
            message: 'What is the table name?',
            default: "all tables"
        },{
            type: 'input',
            name: 'datasource',
            message: 'What is the datasource name?',
            default: this.props.datasource
        },{
            type: 'confirm',
            name: 'runNpm',
            message: 'Install Dependencies?',
            default: this.props.runNpm === true
        },{
            type: 'confirm',
            name: 'loginsys',
            message: 'Do you want to include a login system?',
            default: this.props.loginsys === true
        }];

        this.prompt(prompts, function (props) {
            this.props.modulename = props.modulename.replace(/[^a-z0-9]/gi,'').toLowerCase();
            this.props.user = props.user;
            this.props.password = props.password;
            this.props.database = props.database;
            this.props.datasource = props.datasource;
            this.props.runNpm = props.runNpm
            this.props.loginsys = props.loginsys;

            done();
        }.bind(this));
    },

    promptLoginSys: function() {
        if (this.props.loginsys) {
            var done = this.async();

            var prompts = [{
                type: 'input',
                name: 'logintablename',
                message: 'What is the login table name?',
                default: this.props.logintablename
            },{
                type: 'input',
                name: 'loginaccountcolumn',
                message: 'What is the account column name?',
                default: this.props.loginaccountcolumn
            },{
                type: 'input',
                name: 'loginpasswordcolumn',
                message: 'What is the password column name?',
                default: this.props.loginpasswordcolumn
            }];

            this.prompt(prompts, function (props) {
                this.props.logintablename = props.logintablename;
                this.props.loginaccountcolumn = props.loginaccountcolumn;
                this.props.loginpasswordcolumn = props.loginpasswordcolumn;

                done();
            }.bind(this));
        }
    },

    saveConfig: function() {
        this.config.set("props", this.props);
        this.config.save();
    },

    readPom: function() {
        var self = this;
        var done = this.async();

        fs.readFile(this.destinationRoot() + '/pom.xml', function(err, data) {
            xml2js.parseString(data, function (err, result) {
                self.props.package = result.project.groupId[0];
                done();
            });
        });

    },

    readMetaInfCtx: function() {
        var self = this;
        var done = this.async();

        fs.readFile(this.destinationRoot() + '/src/main/webapp/META-INF/context.xml', function(err, data) {
            xml2js.parseString(data, function (err, result) {
                self.props.metaInfCtx = result;
                done();
            });
        });

    },

    readExistingUrlConstants: function() {
        var self = this;
        var done = this.async();
        this.props.urlConstants = {};
        fs.readFile(this.destinationRoot() + '/src/main/webapp/src/' + this.props.modulename + '/js/const/url.js', "utf-8", function(err, data) {
            if (data != null) {
                var crappyJson = data.split("=")[1];
                crappyJson = crappyJson.replace(/(['"])?([a-zA-Z0-9_]+)(['"])?:/g, '"$2": ');

                if (crappyJson.slice(-1) === ";") {
                    crappyJson = crappyJson.slice(0, -1);
                }

                self.props.urlConstants = JSON.parse(crappyJson);
            }
            
            done();
        });
    },

    readGruntConfig: function() {
        var self = this;
        var done = this.async();


        jsonfile.readFile("src/main/webapp/package.json", function(err, obj) {
            self.props.npmPackage = obj;

            jsonfile.readFile("src/main/webapp/browserify.json", function(err, obj) {
                self.props.browserify = obj;

                jsonfile.readFile("src/main/webapp/sass.json", function(err, obj) {
                    self.props.sass = obj;

                    jsonfile.readFile("src/main/webapp/uglify.json", function(err, obj) {
                        self.props.uglify = obj;

                        jsonfile.readFile("src/main/webapp/cssmin.json", function(err, obj) {
                            self.props.cssmin = obj;
                            done();
                        });
                    });
                });
            });
        });
    },

    generateProjectProps: function() {
        this.props.javaFolder = "src/main/java/"+this.props.package.replace(/\./g, '\/')+"/" + this.props.modulename;
        this.props.daoPackage = this.props.package + "." + this.props.modulename + ".dao";
        this.props.daoFolder = this.props.javaFolder + "/dao";
        this.props.processPackage = this.props.package + "." + this.props.modulename + ".process";
        this.props.processFolder = this.props.javaFolder + "/process";
        this.props.modelPackage = this.props.package + "." + this.props.modulename + ".model";
        this.props.modelFolder = this.props.javaFolder + "/model";
        this.props.wsPackage = this.props.package + "." + this.props.modulename + ".ws";
        this.props.wsFolder = this.props.javaFolder + "/ws";
        this.props.modulenameUpper = this._capitalizeFirstLetter(this.props.modulename);

        if (this.props.tables !== "all tables") {
            this.props.tables = [{ name: this.props.tables }];
        } else {
            this.props.tables = [];
        }
    },

    generateMetaInfCtx: function() {

        if (!this.props.metaInfCtx) {
            this.props.metaInfCtx = {};
        }

        if (!this.props.metaInfCtx.Context) {
            this.props.metaInfCtx.Context = {
                "$": {
                    "antiJARLocking": "true",
                    "path": "/" + this.props.modulenameUpper
                }
            };
        }

        if (!this.props.metaInfCtx.Context.Resource) {
            this.props.metaInfCtx.Context.Resource = [];
        }

        var existDs = false;

        if (this.props.metaInfCtx.Context.Resource.length) {
            for (var i in this.props.metaInfCtx.Context.Resource) {
                var r = this.props.metaInfCtx.Context.Resource[i];

                if (r.$ && r.$.name === this.props.datasource) {
                    existDs = true;
                }
            }
        }
        
        if (!existDs) {
            this.props.metaInfCtx.Context.Resource.push({
                "$": {
                    "name": this.props.datasource,
                    "url": "jdbc:mysql://localhost:3306/" + this.props.database,
                    "username": this.props.user,
                    "password": this.props.password,
                    "auth": "Container",
                    "driverClassName": "com.mysql.jdbc.Driver",
                    "factory": "org.apache.commons.dbcp.BasicDataSourceFactory",
                    "initialSize": "1",
                    "maxActive": "3",
                    "maxIdle": "1",
                    "maxWait": "20000",
                    "minEvictableIdleTimeMillis": "3000",
                    "minIdle": "1",
                    "removeAbandonedTimeout": "5",
                    "timeBetweenEvictionRunsMillis": "30000",
                    "type": "javax.sql.DataSource"
                }
            });
        }
    },

    generateGruntConfig: function() {

        //package
        if (!this.props.npmPackage) {
            this.props.npmPackage = {
                "name": this.props.modulename,
                "version": "1.0.0",
                "private": true,
                "description": this.props.modulename
            };
        }

        //browserify
        if (!this.props.browserify) {
            this.props.browserify = {
                "dist": {
                    "files": {},
                    "options": {
                        "browserifyOptions": {
                            "debug": true
                        },
                        "transform": ["jstify"]
                    }

                }
            };
        }

        this.props.browserify.dist.files[this.props.modulename + "/" + this.props.modulename + ".js"] = 
            "src/" + this.props.modulename + "/js/index.js";

        //sass
        if (!this.props.sass) {
            this.props.sass = {
                "dist": {
                    "files": []
                }
            };
        }

        var existSassModulePath = false;
        var sassFiles = this.props.sass.dist.files;
        var sassPath = "src/" + this.props.modulename + "/scss";
        for (var i in sassFiles) {
            var f = sassFiles[i];
            if (f.cwd === sassPath) {
                existSassModulePath = true;
            }
        }

        if (!existSassModulePath) {
            sassFiles.push({
                "expand": true,
                "cwd": sassPath,
                "src": ["*.scss"],
                "dest": this.props.modulename + "/css",
                "ext": ".css"
            });
        }

        //uglify
        if (!this.props.uglify) {
            this.props.uglify = {
                "options": {
                    "mangle": false
                },
                "all": {
                    "files": {}
                }
            };
        }

        var jsFile = this.props.modulename + "/" + this.props.modulename + ".js";
        this.props.uglify.all.files[jsFile] = jsFile;

        //cssmin
        if (!this.props.cssmin) {
            this.props.cssmin = {
                "target": {
                    "files": []
                }
            };
        }

        var existCssModulePath = false;
        var cssFiles = this.props.cssmin.target.files;
        var cssPath = this.props.modulename + "/css";
        for (var i in cssFiles) {
            var f = cssFiles[i];
            if (f.cwd === cssPath) {
                existCssModulePath = true;
            }
        }

        if (!existCssModulePath) {
            cssFiles.push({
                "expand": true,
                "cwd": cssPath,
                "src": ["*.css", "!*.min.css"],
                "dest": cssPath,
                "ext": ".min.css"
            });
        }
    },

    connect: function(){
        this.connection = mysql.createConnection({
            user: this.props.user,
            password: this.props.password,
            database: "information_schema"
        });

        this.connection.connect();
    },

    readTables: function() {
        if (this.props.tables.length == 1) {
            return; //this means that only one table will be used
        }

        var self = this;
        var done = this.async();

        this.connection.query(
            "SELECT "
            + "table_name "
            + "FROM tables "
            + "WHERE table_schema = ? ",
            [this.props.database],
        function(err, results, fields) {
            if (err) {
                console.log("*** Could not read specified database ***");
                throw err;
            }

            self.props.tables = [];
            for (var i in results) {
                self.props.tables.push({
                    name: results[i].table_name
                });
            }

            done();
        });
    },

    includeLoginTable: function() {
        if (this.props.loginsys) {
            var listed = false;
            for (var i in this.props.tables) {
                if (this.props.tables[i].name === this.props.logintablename) {
                    listed = true;
                }
            }

            if (!listed) {
                this.props.tables.push({ name: this.props.logintablename });
            }
        }
    },

    readColumns: function() {
        var self = this;
        var done = this.async();

        var recursive = function(index) {
            var table = self.props.tables[index];

            self.connection.query(
                "SELECT "
                + "column_name, is_nullable, data_type, character_maximum_length, column_key, ordinal_position, extra "
                + "FROM columns "
                + "WHERE table_schema = ? "
                + "AND table_name = ? ",
                [self.props.database, table.name],
            function(err, results, fields) {
                if (err) {
                    console.log("*** Could not read "+ table.name +" table ***");
                    throw err;
                }

                table.columns = results;

                if (index + 1 < self.props.tables.length) {
                    recursive(index + 1);
                } else {
                    done();
                }
            });
        };

        recursive(0);
    },

    generateTableProps: function() {
        if (!this.props.urlConstants.listPages) {
            this.props.urlConstants.listPages = {};
        }

        if (!this.props.urlConstants.persistPages) {
            this.props.urlConstants.persistPages = {};
        }

        for (var i in this.props.tables) {
            var table = this.props.tables[i];

            table.className = this._upperCamelCase(table.name);
            table.classUpper = table.className.toUpperCase();

            this.props.urlConstants["LIST_"+table.classUpper] = "../" + this.props.modulenameUpper + "/List" + table.className;
            this.props.urlConstants["GET_"+table.classUpper] = "../" + this.props.modulenameUpper + "/Get" + table.className;
            this.props.urlConstants["PERSIST_"+table.classUpper] = "../" + this.props.modulenameUpper + "/Persist" + table.className;
            
            this.props.urlConstants.listPages[table.className] = "list"+table.className+".html";
            this.props.urlConstants.persistPages[table.className] = "persist"+table.className+".html";

            var isLoginTable = false;
            if (table.name === this.props.logintablename) {
                this.logintable = table;
                isLoginTable = true;
            }

            for (var i = table.columns.length - 1; i >= 0; i--) {
                var col = table.columns[i];

                if (col.column_key === "PRI") {
                    table.idColumn = col;
                }
                col.javaType = this._generateJavaType(col);
                col.resultSetGetter = this._generateResultSetGetter(col);
                col.propertyName = this._lowerCamelCase(col.column_name);
                col.propertyNameUpper = this._capitalizeFirstLetter(col.propertyName);

                if (col.column_name === this.props.loginaccountcolumn) {
                    this.logintable.accountColumn = col;
                } else if (col.column_name === this.props.loginpasswordcolumn) {
                    this.logintable.passwordColumn = col;
                }
            }
        }
    },

    writeJavaClasses: function () {
        this.fs.copyTpl(
            this.templatePath('LanguageFactory.java'),
            this.destinationPath(this.props.processFolder+"/LanguageFactory.java"),
            this.props);

        for (var i in this.props.tables) {
            var table = this.props.tables[i];

            var params = {
                props: this.props,
                table: table
            };

            this.fs.copyTpl(
                this.templatePath('java_model.java'),
                this.destinationPath(this.props.modelFolder+"/"+table.className+".java"),
                params);

            this.fs.copyTpl(
                this.templatePath('java_dao.java'),
                this.destinationPath(this.props.daoFolder+"/"+table.className+"Dao.java"),
                params);

            this.fs.copyTpl(
                this.templatePath('java_process.java'),
                this.destinationPath(this.props.processFolder+"/"+table.className+"Process.java"),
                params);

            this.fs.copyTpl(
                this.templatePath('ws_list.java'),
                this.destinationPath(this.props.wsFolder+"/List"+table.className+"Servlet.java"),
                params);

            this.fs.copyTpl(
                this.templatePath('ws_get.java'),
                this.destinationPath(this.props.wsFolder+"/Get"+table.className+"Servlet.java"),
                params);

            this.fs.copyTpl(
                this.templatePath('ws_persist.java'),
                this.destinationPath(this.props.wsFolder+"/Persist"+table.className+"Servlet.java"),
                params);
        }        

        if (this.props.loginsys) {

            var paramsLogin = {
                props: this.props,
                table: this.logintable
            };

            this.fs.copyTpl(
                this.templatePath('java_login_dao.java'),
                this.destinationPath(this.props.daoFolder+"/LoginServiceDao.java"),
                paramsLogin);

            this.fs.copyTpl(
                this.templatePath('java_login_service.java'),
                this.destinationPath(this.props.processFolder+"/LoginServices.java"),
                paramsLogin);

            this.fs.copyTpl(
                this.templatePath('ws_login.java'),
                this.destinationPath(this.props.wsFolder+"/LoginServlet.java"),
                paramsLogin);
        }
    },

    writeJsClasses: function() {
        this.fs.copyTpl(
            this.templatePath('url.js'),
            this.destinationPath("src/main/webapp/src/" + this.props.modulename + "/js/const/url.js"),
            this.props);

        this.fs.copyTpl(
            this.templatePath('index.js'),
            this.destinationPath("src/main/webapp/src/" + this.props.modulename + "/js/index.js"),
            this.props);

        this.fs.copyTpl(
            this.templatePath('defaultInterface.js'),
            this.destinationPath("src/main/webapp/src/" + this.props.modulename + "/js/service/defaultInterface.js"),
            this.props);

        this.fs.copy(
            this.templatePath('translate.js'),
            this.destinationPath("src/main/webapp/src/" + this.props.modulename + "/js/service/translate.js"));

        this.fs.copyTpl(
            this.templatePath('home.js'),
            this.destinationPath("src/main/webapp/src/" + this.props.modulename + "/js/controller/home.js"),
            this.props);

        this.fs.copy(
            this.templatePath('Gruntfile.js'),
            this.destinationPath("src/main/webapp/Gruntfile.js"));

        for (var i in this.props.tables) {
            var table = this.props.tables[i];
            
            var params = {
                props: this.props,
                table: table
            };

            this.fs.copyTpl(
                this.templatePath('list.js'),
                this.destinationPath("src/main/webapp/src/" + this.props.modulename + "/js/controller/list"+table.className+".js"),
                params);

            this.fs.copyTpl(
                this.templatePath('persist.js'),
                this.destinationPath("src/main/webapp/src/" + this.props.modulename + "/js/controller/persist"+table.className+".js"),
                params);
        }

        if (this.props.loginsys) {
            this.fs.copy(
                this.templatePath('index_login.js'),
                this.destinationPath("src/main/webapp/src/" + this.props.modulename + "/js/controller/index.js"));

            this.fs.copyTpl(
                this.templatePath('login.js'),
                this.destinationPath("src/main/webapp/src/" + this.props.modulename + "/js/service/login.js"),
                this.props);
        }
    },

    writeScssFiles: function() {
        this.fs.copy(
            this.templatePath('datatables.scss'),
            this.destinationPath("src/main/webapp/src/" + this.props.modulename + "/scss/datatables.scss"));

        this.fs.copy(
            this.templatePath('crud.scss'),
            this.destinationPath("src/main/webapp/src/" + this.props.modulename + "/scss/" + this.props.modulename + ".scss"));
    },

    writeHtmlFiles: function() {
        this.fs.copy(
            this.templatePath('default.html'),
            this.destinationPath("src/main/webapp/src/" + this.props.modulename + "/tmpl/default.html"));

        this.fs.copyTpl(
            this.templatePath('home.html'),
            this.destinationPath("src/main/webapp/" + this.props.modulename + "/home.html"),
            this.props);

        for (var i in this.props.tables) {
            var params = {
                props: this.props,
                table: this.props.tables[i]
            };
            
            this.fs.copyTpl(
                this.templatePath('list.html'),
                this.destinationPath("src/main/webapp/" + this.props.modulename + "/list"+params.table.className+".html"),
                params);

            this.fs.copyTpl(
                this.templatePath('persist.html'),
                this.destinationPath("src/main/webapp/" + this.props.modulename + "/persist"+params.table.className+".html"),
                params);
        }

        if (this.props.loginsys) {
            this.fs.copyTpl(
                this.templatePath('index_login.html'),
                this.destinationPath("src/main/webapp/" + this.props.modulename + "/index.html"),
                this.props);
        }
    },

    writeGruntConfig: function() {
        var self = this;
        var done = this.async();
        jsonfile.spaces = 4;

        jsonfile.writeFile("src/main/webapp/package.json", self.props.npmPackage, function(err) {

            jsonfile.writeFile("src/main/webapp/browserify.json", self.props.browserify, function(err) {

                jsonfile.writeFile("src/main/webapp/sass.json", self.props.sass, function(err) {

                    jsonfile.writeFile("src/main/webapp/uglify.json", self.props.uglify, function(err) {

                        jsonfile.writeFile("src/main/webapp/cssmin.json", self.props.cssmin, function(err) {
                            done();
                        });
                    });
                });
            });
        });
    },

    writeOtherFiles: function() {
        var self = this;

        this.directory("fonts", "src/main/webapp/" + this.props.modulename + "/fonts");

        this.fs.copyTpl(
            this.templatePath('strings-en.json'),
            this.destinationPath("src/main/webapp/" + this.props.modulename + "/json/strings-en.json"),
            this.props);

        var metaInfCtxAsXml = new xml2js.Builder().buildObject(this.props.metaInfCtx);
        var xmlPath = this.destinationRoot() + "/src/main/webapp/META-INF/context.xml";

        try {
            fs.mkdirSync(this.destinationRoot() + "/src/main/webapp/META-INF/");
        } catch (e) {}

        fs.writeFileSync(xmlPath, metaInfCtxAsXml, "utf8");
    },

    installDependencies: function() {
        var self = this;

        if (this.props.runNpm) {
            console.log("Installing Dependencies, please wait.");

            process.chdir("src/main/webapp/");

            this.npmInstall([
                "browserify",
                "grunt@0.4.5",
                "grunt-browserify",
                "grunt-contrib-sass",
                "grunt-contrib-uglify",
                "jstify",
                "uglify"
            ], 
            { saveDev: true },
            function () {
                
                self.npmInstall([
                    "bootstrap-notify", 
                    "bootstrap-sass", 
                    "bootstrap-validator", 
                    "datatables@<=1.10.9", 
                    "datatables-bootstrap", 
                    "font-awesome", 
                    "jquery", 
                    "jquery-localize", 
                    "jstify", 
                    "ml-js-commons", 
                    "moment"
                ], 
                { save: true },
                function() {
                    process.chdir("../../../");
                    self._runGruntRun();
                });
            });
        } else {
            self._runGruntRun();
        }
    },

    _runGruntRun: function() {
        process.chdir("src/main/webapp/");
        this.spawnCommand('grunt');
        process.chdir("../../../");
        process.exit();
    },

    _generateJavaType: function(column) {
        if (["char", "varchar", "text"].indexOf(column.data_type) > -1) {
            return "String";
        }

        else if (["float", "double", "real", "double precision", "numeric", "decimal"].indexOf(column.data_type) > -1) {
            return column.is_nullable === "YES" ? "Double" : "double";
        }

        else if (["int", "integer", "smallint", "mediumint", "bigint"].indexOf(column.data_type) > -1) {
            return column.is_nullable === "YES" ? "Long" : "long";
        }

        else if ("tinyint" === column.data_type) {
            return column.is_nullable === "YES" ? "Boolean" : "boolean";
        }

        else if (["date", "time", "datetime", "timestamp"].indexOf(column.data_type) > -1) {
            return "Date";
        }

        throw new Error("Unkown type " + column.data_type + " for " + column.column_name);

    },

    _generateResultSetGetter: function(column) {

        if (["char", "varchar", "text"].indexOf(column.data_type) > -1) {
            return "getString";
        }

        else if (["float", "double", "real", "double precision", "numeric", "decimal"].indexOf(column.data_type) > -1) {
            return column.is_nullable === "YES" ? "getDoubleOrNull" : "getDouble";
        }

        else if (["int", "integer", "smallint", "mediumint", "bigint"].indexOf(column.data_type) > -1) {
            return column.is_nullable === "YES" ? "getLongOrNull" : "getLong";
        }

        else if ("tinyint" === column.data_type) {
            return column.is_nullable === "YES" ? "getBooleanOrNull" : "getBoolean";
        }

        else if (["date", "time", "datetime", "timestamp"].indexOf(column.data_type) > -1) {
            return "getTimestamp";
        }

        throw new Error("Unkown type " + column.data_type + " for " + column.column_name);

    },

    _camelCase: function(string) {
        return string.replace(/_([a-z])/g, function (g) { 
            return g[1].toUpperCase();
        });
    },

    _lowerCamelCase: function(string) {
        return this._normalizeFirstLetter(this._camelCase(string));
    },

    _upperCamelCase: function(string) {
        return this._capitalizeFirstLetter(this._camelCase(string));
    },

    _capitalizeFirstLetter: function(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    },

    _normalizeFirstLetter: function(string) {
        return string.charAt(0).toLowerCase() + string.slice(1);
    }
});
