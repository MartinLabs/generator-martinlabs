'use strict';
var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var yosay = require('yosay');
var mysql = require('mysql');
var parseXml = require('xml2js').parseString;
var fs = require('fs');
var mkdirp = require('mkdirp');
var astQuery = require("ast-query");

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
            default: this.props.runNpm !== false
        },{
            type: 'confirm',
            name: 'loginsys',
            message: 'Do you want to include a login system?',
            default: this.props.loginsys !== false
        }];

        this.prompt(prompts, function (props) {
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
            parseXml(data, function (err, result) {
                self.props.package = result.project.groupId[0];
                done();
            });
        });

    },

    readExistingUrlConstants: function() {
        var self = this;
        var done = this.async();
        this.props.urlConstants = {};
        fs.readFile(this.destinationRoot() + '/src/main/webapp/src/crud/js/const/url.js', "utf-8", function(err, data) {
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

    generateProjectProps: function() {
        this.props.javaFolder = "src/main/java/"+this.props.package.replace(/\./g, '\/')+"/crud";
        this.props.daoPackage = this.props.package + ".crud.dao";
        this.props.daoFolder = this.props.javaFolder + "/dao";
        this.props.processPackage = this.props.package + ".crud.process";
        this.props.processFolder = this.props.javaFolder + "/process";
        this.props.modelPackage = this.props.package + ".crud.model";
        this.props.modelFolder = this.props.javaFolder + "/model";
        this.props.wsPackage = this.props.package + ".crud.ws";
        this.props.wsFolder = this.props.javaFolder + "/ws";

        if (this.props.tables !== "all tables") {
            this.props.tables = [{ name: this.props.tables }];
        } else {
            this.props.tables = [];
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

            this.props.urlConstants["LIST_"+table.classUpper] = "../Crud/List" + table.className;
            this.props.urlConstants["GET_"+table.classUpper] = "../Crud/Get" + table.className;
            this.props.urlConstants["PERSIST_"+table.classUpper] = "../Crud/Persist" + table.className;
            
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
            this.templatePath('StringsEn.java'),
            this.destinationPath(this.props.processFolder+"/StringsEn.java"),
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
            this.destinationPath("src/main/webapp/src/crud/js/const/url.js"),
            this.props);

        this.fs.copyTpl(
            this.templatePath('index.js'),
            this.destinationPath("src/main/webapp/src/crud/js/index.js"),
            this.props);

        this.fs.copyTpl(
            this.templatePath('defaultInterface.js'),
            this.destinationPath("src/main/webapp/src/crud/js/service/defaultInterface.js"),
            this.props);

        this.fs.copy(
            this.templatePath('translate.js'),
            this.destinationPath("src/main/webapp/src/crud/js/service/translate.js"));

        this.fs.copyTpl(
            this.templatePath('home.js'),
            this.destinationPath("src/main/webapp/src/crud/js/controller/home.js"),
            this.props);

        for (var i in this.props.tables) {
            var table = this.props.tables[i];
            
            var params = {
                props: this.props,
                table: table
            };

            this.fs.copyTpl(
                this.templatePath('list.js'),
                this.destinationPath("src/main/webapp/src/crud/js/controller/list"+table.className+".js"),
                params);

            this.fs.copyTpl(
                this.templatePath('persist.js'),
                this.destinationPath("src/main/webapp/src/crud/js/controller/persist"+table.className+".js"),
                params);
        }

        if (this.props.loginsys) {
            this.fs.copy(
                this.templatePath('index_login.js'),
                this.destinationPath("src/main/webapp/src/crud/js/controller/index.js"));

            this.fs.copy(
                this.templatePath('login.js'),
                this.destinationPath("src/main/webapp/src/crud/js/service/login.js"));
        }
    },

    writeScssFiles: function() {
        this.fs.copy(
            this.templatePath('datatables.scss'),
            this.destinationPath("src/main/webapp/src/crud/scss/datatables.scss"));

        this.fs.copy(
            this.templatePath('crud.scss'),
            this.destinationPath("src/main/webapp/src/crud/scss/crud.scss"));
    },

    writeHtmlFiles: function() {
        this.fs.copy(
            this.templatePath('default.html'),
            this.destinationPath("src/main/webapp/src/crud/tmpl/default.html"));

        this.fs.copy(
            this.templatePath('home.html'),
            this.destinationPath("src/main/webapp/crud/home.html"));

        for (var i in this.props.tables) {
            var table = this.props.tables[i];
            this.fs.copyTpl(
                this.templatePath('list.html'),
                this.destinationPath("src/main/webapp/crud/list"+table.className+".html"),
                table);

            this.fs.copyTpl(
                this.templatePath('persist.html'),
                this.destinationPath("src/main/webapp/crud/persist"+table.className+".html"),
                table);
        }

        if (this.props.loginsys) {
            this.fs.copy(
                this.templatePath('index_login.html'),
                this.destinationPath("src/main/webapp/crud/index.html"));
        }
    },

    writeOtherFiles: function() {
        this.directory("fonts", "src/main/webapp/crud/fonts");

        this.fs.copyTpl(
            this.templatePath('strings-en.json'),
            this.destinationPath("src/main/webapp/crud/json/strings-en.json"),
            this.props);
    },

    installDependencies: function() {
        if (this.props.runNpm) {
            process.chdir("src/main/webapp/");
            this.npmInstall([
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
            ], { save: true });
        }
    },

    end: function() {
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

    // _createFolder: function(folder, errMsg) {
    //     var done = this.async();

    //     mkdirp(folder, function(err) { 
    //         if (err) {
    //             console.log(errMsg);
    //             throw err;
    //         }

    //         done();
    //     });
    // }
});
