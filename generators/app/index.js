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
var lorem = require("./lorem");
var moment = require("moment");

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
            message: 'Input the Module Name',
            default: this.props.modulename || "crud"
        },{
            type: 'input',
            name: 'user',
            message: 'Input the Mysql User',
            default: this.props.user
        },{
            type: 'password',
            name: 'password',
            message: 'Input the Mysql Password',
            default: this.props.password
        },{
            type: 'input',
            name: 'database',
            message: 'Input the Database Name',
            default: this.props.database
        },{
            type: 'input',
            name: 'tables',
            message: 'Input the Tables Names separated by comma (or "all tables") ',
            default: this.props.tables ? this.props.tables : "all tables"
        },{
            type: 'confirm',
            name: 'runNpm',
            message: 'Do you want to Install the NPM Dependencies?',
            default: this.props.runNpm === true
        },{
            type: 'confirm',
            name: 'loginsys',
            message: 'Do you want to include a Login System?',
            default: this.props.loginsys === true
        }];

        this.prompt(prompts, function (props) {
            this.props.modulename = props.modulename.replace(/[^a-z0-9]/gi,'').toLowerCase();
            this.props.user = props.user;
            this.props.password = props.password;
            this.props.database = props.database;
            this.props.tables = props.tables;
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
                message: 'Input the Login Table Name',
                default: this.props.logintablename
            },{
                type: 'input',
                name: 'loginaccountcolumn',
                message: 'Input the Login Account Column Name',
                default: this.props.loginaccountcolumn
            },{
                type: 'input',
                name: 'loginpasswordcolumn',
                message: 'Input the Login Password Column Name',
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

    promptColumnNamePatters: function () {
        var done = this.async();

        var prompts = [{
            type: 'confirm',
            name: 'configureColumnNamePattern',
            message: "Do you want to configure column names pattern? It's " + (this.props.columnNamePatterns ? "Already configured" : "Not configured"),
            default: this.props.columnNamePatterns == null
        }];

        this.prompt(prompts, function (props) {
            if (props.configureColumnNamePattern) {

                if (!this.props.columnNamePatterns) {
                    this.props.columnNamePatterns = {};
                }

                prompts = [{
                    type: 'input',
                    name: 'emailCNP',
                    message: 'Email: a string that represents an e-mail. Enter a Regex to Match, case insensitive',
                    default: this.props.columnNamePatterns.email || "\\w*email\\w*"
                },{
                    type: 'input',
                    name: 'passwordCNP',
                    message: 'Password: a string that represents a password. Enter a Regex to Match, case insensitive',
                    default: this.props.columnNamePatterns.password || "\\w*(password|senha)\\w*"
                },{
                    type: 'input',
                    name: 'imageUrlCNP',
                    message: 'Image URL: a string that represents an image URL. Enter a Regex to Match, case insensitive',
                    default: this.props.columnNamePatterns.imageUrl || "\\w*url\\w*(image|photo|foto)\\w*|\\w*(image|photo|foto)\\w*url\\w*"
                },{
                    type: 'input',
                    name: 'urlCNP',
                    message: 'URL: a string that represents an URL, will be tested after Image URL. Enter a Regex to Match, case insensitive',
                    default: this.props.columnNamePatterns.url || "\\w*url\\w*"
                },{
                    type: 'input',
                    name: 'activeCNP',
                    message: 'Active: a boolean that indicates if the row can be used, mimics a delete if it is false. Enter a Regex to Match, case insensitive',
                    default: this.props.columnNamePatterns.active || "\\w*(active|ativo)\\w*"
                }];

                this.prompt(prompts, function (props) {
                    this.props.columnNamePatterns.email = props.emailCNP;
                    this.props.columnNamePatterns.password = props.passwordCNP;
                    this.props.columnNamePatterns.imageUrl = props.imageUrlCNP;
                    this.props.columnNamePatterns.url = props.urlCNP;
                    this.props.columnNamePatterns.active = props.activeCNP;

                    done();
                }.bind(this));

            } else {
                done();
            }
        }.bind(this));
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
                if (result) {
                    self.props.pom = result;
                    self.props.package = result.project.groupId[0];
                    self.props.projectName = result.project.artifactId[0];
                }

                done();
            });
        });

    },

    promptPomMissingInfo: function() {
        if (!this.props.package || !this.props.projectName) {
            var done = this.async();

            var prompts = [{
                type: 'input',
                name: 'projectName',
                message: 'Input the Project Name'
            },{
                type: 'input',
                name: 'package',
                message: 'Input the Package'
            }];

            this.prompt(prompts, function (props) {
                this.props.package = props.package;
                this.props.projectName = props.projectName;

                done();
            }.bind(this));
        }
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
        this.props.javaFolder = "src/main/java/"+this.props.package.replace(/\./g, '\/');
        this.props.testFolder = "src/test/java/"+this.props.package.replace(/\./g, '\/');
        this.props.daoPackage = this.props.package + ".dao";
        this.props.daoFolder = this.props.javaFolder + "/dao";
        this.props.modelPackage = this.props.package + ".model";
        this.props.modelFolder = this.props.javaFolder + "/model";
        this.props.modulePackage = this.props.package + "." + this.props.modulename;
        this.props.moduleFolder = this.props.javaFolder + "/" + this.props.modulename;
        this.props.moduleTestFolder = this.props.testFolder + "/" + this.props.modulename;
        this.props.processPackage = this.props.modulePackage + ".process";
        this.props.processFolder = this.props.moduleFolder + "/process";
        this.props.processTestFolder = this.props.moduleTestFolder + "/process";
        this.props.responsePackage = this.props.modulePackage + ".response";
        this.props.responseFolder = this.props.moduleFolder + "/response";
        this.props.wsPackage = this.props.modulePackage + ".ws";
        this.props.wsFolder = this.props.moduleFolder + "/ws";
        this.props.modulenameUpper = this._capitalizeFirstLetter(this.props.modulename);
        this.props.datasource = "jdbc/" + this.props.database + "DS";

        if (this.props.tables !== "all tables") {
            this.props.crudTables = this.props.tables.replace(/ /g, "").split(",");
        } else {
            this.props.crudTables = [];
        }

        this.props.tables = [];
    },

    generatePom: function() {

        if (!this.props.pom) {
            this.props.pom = {
                project: {
                    "$": {
                        xmlns: "http://maven.apache.org/POM/4.0.0",
                        "xmlns:xsi": "http://www.w3.org/2001/XMLSchema-instance",
                        "xsi:schemaLocation": "http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd"
                    },
                    modelVersion: ["4.0.0"],
                    groupId: [this.props.package],
                    artifactId: [this.props.projectName],
                    version: ["1.0.0"],
                    packaging: ["war"],
                    name: [this.props.projectName],
                    properties: [{
                        "endorsed.dir": ["${project.build.directory}/endorsed"],
                        "project.build.sourceEncoding": ["UTF-8"]
                    }]
                }
            };
        }

        if (!this.props.pom.project.dependencies) {
            this.props.pom.project.dependencies = [{}];
        }

        if (!this.props.pom.project.dependencies[0].dependency) {
            this.props.pom.project.dependencies[0].dependency = [];
        }

        var dependenciesToAdd = [{
            groupId: ["br.com.martinlabs"],
            artifactId: ["martinlabs-commons"],
            version: ["3.4"],
            type: ["jar"]
        }, {
            groupId: ["org.glassfish.jersey.containers"],
            artifactId: ["jersey-container-servlet"],
            version: ["2.15"]
        }, {
            groupId: ["org.zalando.phrs"],
            artifactId: ["jersey-media-json-gson"],
            version: ["0.1"]
        }, {
            groupId: ["javax"],
            artifactId: ["javaee-web-api"],
            version: ["7.0"],
            scope: ["provided"]
        }];
        
        for (var i in dependenciesToAdd) {
            var dta = dependenciesToAdd[i];
            var exist = false;
            for (var j in this.props.pom.project.dependencies[0].dependency) {
                var d = this.props.pom.project.dependencies[0].dependency[j];

                if (dta.groupId[0] === d.groupId[0] && dta.artifactId[0] === d.artifactId[0]) {
                    exist = true;
                }
            }

            if (!exist) {
                this.props.pom.project.dependencies[0].dependency.push(dta);
            }
        }

        if (!this.props.pom.project.build) {
            this.props.pom.project.build = [{}];
        }

        if (!this.props.pom.project.build[0].plugins) {
            this.props.pom.project.build[0].plugins = [{}];
        }

        if (!this.props.pom.project.build[0].plugins[0].plugin) {
            this.props.pom.project.build[0].plugins[0].plugin = [];
        }

        var pluginsToAdd = [{
            groupId: ["org.apache.maven.plugins"],
            artifactId: ["maven-compiler-plugin"],
            version: ["3.1"],
            configuration: [{
                source: ["1.8"],
                target: ["1.8"],
                compilerArguments: [{
                    endorseddirs: ["${endorsed.dir}"]
                }]
            }]
        }, {
            groupId: ["org.apache.maven.plugins"],
            artifactId: ["maven-war-plugin"],
            version: ["2.3"],
            configuration: [{
                failOnMissingWebXml: ["false"]
            }]
        }, {
            groupId: ["org.apache.maven.plugins"],
            artifactId: ["maven-dependency-plugin"],
            version: ["2.6"],
            executions: [{
                execution: [{
                    phase: ["validate"],
                    goals: [{
                        goal: ["copy"]
                    }],
                    configuration: [{
                        outputDirectory: ["${endorsed.dir}"],
                        silent: ["true"],
                        artifactItems: [{
                            artifactItem: [{
                                groupId: ["javax"],
                                artifactId: ["javaee-endorsed-api"],
                                version: ["7.0"],
                                type: ["jar"]
                            }]
                        }]
                    }]
                }]
            }]
        }, {
            groupId: ["org.jacoco"],
            artifactId: ["jacoco-maven-plugin"],
            version: ["0.7.1.201405082137"],
            executions: [{
                execution: [
                    {
                        goals: [{ goal: ["prepare-agent"] }]
                    },
                    {
                          id: ["report"],
                          phase: ["prepare-package"],
                          goals: [{ goal: ["report"] }]
                    },
                    {
                        id: ["check"],
                        goals: [{ goal: ["check"] }],
                        configuration: [{
                            rules: [{
                                rule: [{
                                    "$": { implementation: "org.jacoco.maven.RuleConfiguration" },
                                    element: ["BUNDLE"],
                                    limits: [{
                                        limit: [{
                                            "$": { implementation: "org.jacoco.report.check.Limit" },
                                            counter: ["INSTRUCTION"],
                                            value: ["COVEREDRATIO"],
                                            minimum: ["0.96"]
                                        }]
                                    }]
                                }]
                            }],
                            excludes: [{
                                exclude: [
                                    "**/Router.*",
                                    "**/ErrorCode.*",
                                    "**/GsonContextResolver.*",
                                    "**/ServletListener.*",
                                    "**/model/*.*"
                                ]
                            }]
                        }]
                    }
                ]
            }]
        }];

        for (var i in pluginsToAdd) {
            var bta = pluginsToAdd[i];
            var exist = false;
            for (var j in this.props.pom.project.build[0].plugins[0].plugin) {
                var b = this.props.pom.project.build[0].plugins[0].plugin[j];

                if (b.groupId && b.artifactId && bta.groupId[0] === b.groupId[0] && bta.artifactId[0] === b.artifactId[0]) {
                    exist = true;

                    if (bta.configuration && bta.configuration.length && bta.configuration[0].source) {
                        b.configuration[0].source = bta.configuration[0].source;
                        b.configuration[0].target = bta.configuration[0].target;
                    }
                }
            }

            if (!exist) {
                this.props.pom.project.build[0].plugins[0].plugin.push(bta);
            }
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
                    "path": "/" + this.props.projectName
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
                        "transform": ["babelify", "vueify"]
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
                "src": [this.props.modulename + ".scss"],
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

    connectToDatabase: function(){
        this.connection = mysql.createConnection({
            user: this.props.user,
            password: this.props.password,
            database: "information_schema"
        });

        this.connection.connect();
    },

    readTables: function() {

        var self = this;
        var done = this.async();

        this.connection.query(
            "SELECT "
            + "table_name, table_comment "
            + "FROM tables "
            + "WHERE table_schema = ? ",
            [this.props.database],
        function(err, results, fields) {
            if (err) {
                console.log("*** Could not read specified database ***");
                throw err;
            }

            self.props.tables = [];

            var alltables = false;
            if (self.props.crudTables.length == 0) {
                alltables = true;
            }

            for (var i in results) {
                if (alltables) {
                    self.props.crudTables.push(results[i].table_name);
                }

                self.props.tables.push({
                    name: results[i].table_name,
                    comment: results[i].table_comment,
                    inCrud: alltables || self.props.crudTables.indexOf(results[i].table_name) > -1
                });
            }

            done();
        });
    },

    readColumns: function() {
        var self = this;
        var done = this.async();

        this.props.referencedTables = new Set();
        this.props.NtoNreferencedTables = {};

        var recursive = function(index) {
            var table = self.props.tables[index];

            self.connection.query(
                "SELECT "
                + "c.column_name, is_nullable, data_type, character_maximum_length, "
                + "column_key, c.ordinal_position, c.column_comment, extra, referenced_table_name "
                + "FROM columns c "
                + "LEFT JOIN key_column_usage k ON c.table_schema = k.table_schema "
                + "AND c.table_name = k.table_name AND c.column_name = k.column_name "
                + "AND referenced_table_name IS NOT NULL "
                + "WHERE c.table_schema = ? "
                + "AND c.table_name = ? ",
                [self.props.database, table.name],
            function(err, results, fields) {
                if (err) {
                    console.log("*** Could not read "+ table.name +" table ***");
                    throw err;
                }

                table.columns = results;

                //adding referencedtables (tables that are referenced in foreign keys)
                //and N-to-N tables

                var refs = [];
                var connectedToCrud = false;
                for (var i in table.columns) {
                    var c = table.columns[i];
                    if (c.referenced_table_name) {
                        if (self.props.crudTables.indexOf(c.referenced_table_name) > -1) {
                            connectedToCrud = true;
                        }

                        refs.push({
                            col: c,
                            ref: c.referenced_table_name
                        });

                        if (table.inCrud) {
                            self.props.referencedTables.add(c.referenced_table_name);
                        }
                    }
                }

                if (table.columns.length == 2 && refs.length == 2 && connectedToCrud) {
                    //is N to N when only have 2 fields and both are foreign keys
                    //and one of them is connected to CRUD
                    table.isNtoNtable = true;

                    //add in a map of [referenced table name ; N to N table, column, and other table name]
                    var r = refs[0];
                    if (!self.props.NtoNreferencedTables[r.ref]) {
                        self.props.NtoNreferencedTables[r.ref] = [];
                    }

                    self.props.NtoNreferencedTables[r.ref].push({
                        column: r.col,
                        NtoNtable: table,
                        otherTableName: refs[1].ref
                    });

                    var r = refs[1];
                    if (!self.props.NtoNreferencedTables[r.ref]) {
                        self.props.NtoNreferencedTables[r.ref] = [];
                    }

                    self.props.NtoNreferencedTables[r.ref].push({
                        column: r.col,
                        NtoNtable: table,
                        otherTableName: refs[0].ref
                    });
                    
                }

                //search in the next table
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
        for (var i in this.props.tables) {
            var table = this.props.tables[i];

            table.className = this._upperCamelCase(table.name);
            table.classUpper = table.className.toUpperCase();
            table.classLowerCamel = this._lowerCamelCase(table.name);
            table.classNatural = this._naturalCase(table.className);

            //marks that this table should have List WS even if it's not choosen to be CRUD
            table.isReferenced = this.props.referencedTables.has(table.name);

            var isLoginTable = false;
            if (table.name === this.props.logintablename) {
                this.logintable = table;
                isLoginTable = true;
            }

            var primaryIndex = 0;
            for (var k = table.columns.length - 1; k >= 0; k--) {
                var col = table.columns[k];

                //primary key
                if (col.column_key === "PRI") {
                    table.idColumn = col;
                    col.primaryIndex = primaryIndex;
                    primaryIndex++;
                }

                col.javaType = this._generateJavaType(col);
                col.resultSetGetter = this._generateResultSetGetter(col);
                col.propertyName = this._lowerCamelCase(col.column_name);
                col.propertyNameUpper = this._capitalizeFirstLetter(col.propertyName);
                col.propertyNatural = this._naturalCase(col.propertyName);
                col.notIdPropertyName = this._notIdPkFk(col.propertyName);
                col.notIdPropertyNatural = this._naturalCase(col.notIdPropertyName);
                col.notIdPropertyNameUpper = this._capitalizeFirstLetter(col.notIdPropertyName);
                col.smartType = this._generateSmartType(col);

                //putting column information on logintable
                if (isLoginTable) {
                    if (col.column_name === this.props.loginaccountcolumn) {
                        this.logintable.accountColumn = col;
                    } else if (col.column_name === this.props.loginpasswordcolumn) {
                        this.logintable.passwordColumn = col;
                    }
                }

                //if the column is a foreign key we will save the referenced table inside the column
                if (col.referenced_table_name) {

                    for (var j in this.props.tables) {
                        var rt = this.props.tables[j];
                        if (col.referenced_table_name === rt.name) {
                            col.referencedTable = rt;
                        }
                    }
                }
            }

            //if the table is referenced in a N to N table
            //we will put the 'virtual' columns with the N to N table information
            //and the other side of N to N table information
            if (this.props.NtoNreferencedTables[table.name]) {
                table.NtoNcolumns = this.props.NtoNreferencedTables[table.name];

                for (var m in table.NtoNcolumns) {
                    var nc = table.NtoNcolumns[m];

                    for (var n in this.props.tables) {
                        var nt = this.props.tables[n];
                        if (nt.name === nc.otherTableName) {
                            nt.isReferenced = true;
                            nc.otherTable = nt;
                        }
                    }
                }
            }
        }
    },

    writeJavaClasses: function () {
        this.fs.copyTpl(
            this.templatePath('ServerListener.java'),
            this.destinationPath(this.props.javaFolder+"/ServerListener.java"),
            this.props);

        this.fs.copyTpl(
            this.templatePath('ErrorCode.java'),
            this.destinationPath(this.props.javaFolder+"/ErrorCode.java"),
            this.props);

        this.fs.copyTpl(
            this.templatePath('GsonContextResolver.java'),
            this.destinationPath(this.props.javaFolder+"/GsonContextResolver.java"), 
            this.props);

        this.fs.copyTpl(
            this.templatePath('Router.java'),
            this.destinationPath(this.props.moduleFolder+"/Router.java"), 
            this.props);

        for (var i in this.props.tables) {
            var table = this.props.tables[i];

            var params = {
                props: this.props,
                table: table
            };

            if (table.isNtoNtable) {

                this.fs.copyTpl(
                    this.templatePath('DaoNtoN.java'),
                    this.destinationPath(this.props.daoFolder+"/"+table.className+"Dao.java"),
                    params);

            } else { 

                this.fs.copyTpl(
                    this.templatePath('Model.java'),
                    this.destinationPath(this.props.modelFolder+"/"+table.className+".java"),
                    params);

                this.fs.copyTpl(
                    this.templatePath('Dao.java'),
                    this.destinationPath(this.props.daoFolder+"/"+table.className+"Dao.java"),
                    params);

                if (table.inCrud) {

                    this.fs.copyTpl(
                        this.templatePath('Process.java'),
                        this.destinationPath(this.props.processFolder+"/"+table.className+"Process.java"),
                        params);

                    this.fs.copyTpl(
                        this.templatePath('ProcessTest.java'),
                        this.destinationPath(this.props.processTestFolder+"/"+table.className+"ProcessTest.java"),
                        params);

                    this.fs.copyTpl(
                        this.templatePath('Response.java'),
                        this.destinationPath(this.props.responseFolder+"/"+table.className+"Resp.java"),
                        params);

                }
            }
        }        

        if (this.props.loginsys) {

            var paramsLogin = {
                props: this.props,
                table: this.logintable
            };

            this.fs.copyTpl(
                this.templatePath('LoginServiceDao.java'),
                this.destinationPath(this.props.daoFolder+"/LoginServiceDao.java"),
                paramsLogin);

            this.fs.copyTpl(
                this.templatePath('LoginServices.java'),
                this.destinationPath(this.props.processFolder+"/LoginServices.java"),
                paramsLogin);

            this.fs.copyTpl(
                this.templatePath('LoginServicesTest.java'),
                this.destinationPath(this.props.processTestFolder+"/LoginServicesTest.java"),
                this.props);
        }
    },

    writeJsClasses: function() {
        this.fs.copy(
            this.templatePath('index.js'),
            this.destinationPath("src/main/webapp/src/" + this.props.modulename + "/js/index.js"));

        this.fs.copy(
            this.templatePath('AppBus.js'),
            this.destinationPath("src/main/webapp/src/" + this.props.modulename + "/js/service/AppBus.js"));

        this.fs.copy(
            this.templatePath('AppTranslator.js'),
            this.destinationPath("src/main/webapp/src/" + this.props.modulename + "/js/service/AppTranslator.js"));

        this.fs.copy(
            this.templatePath('App.vue'),
            this.destinationPath("src/main/webapp/src/" + this.props.modulename + "/js/controller/App.vue"));

        this.fs.copy(
            this.templatePath('Home.vue'),
            this.destinationPath("src/main/webapp/src/" + this.props.modulename + "/js/controller/Home.vue"));

        this.fs.copy(
            this.templatePath('pagination.vue'),
            this.destinationPath("src/main/webapp/src/" + this.props.modulename + "/js/adaptable/pagination.vue"));

        this.fs.copy(
            this.templatePath('th.vue'),
            this.destinationPath("src/main/webapp/src/" + this.props.modulename + "/js/adaptable/th.vue"));

        this.fs.copy(
            this.templatePath('searchfield.vue'),
            this.destinationPath("src/main/webapp/src/" + this.props.modulename + "/js/adaptable/searchfield.vue"));

        this.fs.copy(
            this.templatePath('Store.js'),
            this.destinationPath("src/main/webapp/src/" + this.props.modulename + "/js/adaptable/Store.js"));

        this.fs.copyTpl(
            this.templatePath('AppResource.js'),
            this.destinationPath("src/main/webapp/src/" + this.props.modulename + "/js/service/AppResource.js"),
            this.props);

        this.fs.copyTpl(
            this.templatePath('AppRouter.js'),
            this.destinationPath("src/main/webapp/src/" + this.props.modulename + "/js/service/AppRouter.js"),
            this.props);

        this.fs.copyTpl(
            this.templatePath('Default.vue'),
            this.destinationPath("src/main/webapp/src/" + this.props.modulename + "/js/controller/Default.vue"),
            this.props);

        this.fs.copy(
            this.templatePath('Gruntfile.js'),
            this.destinationPath("src/main/webapp/Gruntfile.js"));

        for (var i in this.props.tables) {
            var table = this.props.tables[i];

            if (table.inCrud && !table.isNtoNtable) {
                var params = {
                    props: this.props,
                    table: table
                };

                this.fs.copyTpl(
                    this.templatePath('List.vue'),
                    this.destinationPath("src/main/webapp/src/" + this.props.modulename + "/js/controller/List"+table.className+".vue"),
                    params);

                this.fs.copyTpl(
                    this.templatePath('Persist.vue'),
                    this.destinationPath("src/main/webapp/src/" + this.props.modulename + "/js/controller/Persist"+table.className+".vue"),
                    params);
            }
        }

        if (this.props.loginsys) {
            this.fs.copyTpl(
                this.templatePath('Login.vue'),
                this.destinationPath("src/main/webapp/src/" + this.props.modulename + "/js/controller/Login.vue"),
                this.props);
        }
    },

    writeScssFiles: function() {
        this.fs.copy(
            this.templatePath('template.scss'),
            this.destinationPath("src/main/webapp/src/" + this.props.modulename + "/scss/template.scss"));

        this.fs.copy(
            this.templatePath('crud.scss'),
            this.destinationPath("src/main/webapp/src/" + this.props.modulename + "/scss/" + this.props.modulename + ".scss"));
    },

    writeHtmlFiles: function() {
        this.fs.copyTpl(
            this.templatePath('index.html'),
            this.destinationPath("src/main/webapp/" + this.props.modulename + "/index.html"),
            this.props);
    },

    writeGruntConfig: function() {
        var self = this;
        var done = this.async();
        jsonfile.spaces = 4;

        try {
            fs.mkdirSync(this.destinationRoot() + "/src");
        } catch (e) {}
        try {
            fs.mkdirSync(this.destinationRoot() + "/src/main");
        } catch (e) {}
        try {
            fs.mkdirSync(this.destinationRoot() + "/src/main/webapp");
        } catch (e) {}

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

        this.fs.copy(
            this.templatePath('.babelrc'),
            this.destinationPath("src/main/webapp/.babelrc"));

        this.directory("fonts", "src/main/webapp/" + this.props.modulename + "/fonts");

        this.fs.copyTpl(
            this.templatePath('LangEn.js'),
            this.destinationPath("src/main/webapp/src/" + this.props.modulename + "/js/const/LangEn.js"),
            this.props);

        this.fs.copyTpl(
            this.templatePath('LangPt.js'),
            this.destinationPath("src/main/webapp/src/" + this.props.modulename + "/js/const/LangPt.js"),
            this.props);

        this.props.generateDataForColumn = this._generateDataForColumn;

        this.fs.copyTpl(
            this.templatePath('data.sql'),
            this.destinationPath("src/test/resources/database/data.sql"),
            this.props);

        this.fs.copyTpl(
            this.templatePath('web.xml'),
            this.destinationPath("src/main/webapp/WEB-INF/web.xml"),
            this.props);


        var pomAsXml = new xml2js.Builder().buildObject(this.props.pom);
        fs.writeFileSync(this.destinationRoot() + "/pom.xml", pomAsXml, "utf8");


        var metaInfCtxAsXml = new xml2js.Builder().buildObject(this.props.metaInfCtx);

        try {
            fs.mkdirSync(this.destinationRoot() + "/src");
        } catch (e) {}
        try {
            fs.mkdirSync(this.destinationRoot() + "/src/main");
        } catch (e) {}
        try {
            fs.mkdirSync(this.destinationRoot() + "/src/main/webapp");
        } catch (e) {}
        try {
            fs.mkdirSync(this.destinationRoot() + "/src/main/webapp/META-INF");
        } catch (e) {}
        
        fs.writeFileSync(this.destinationRoot() + "/src/main/webapp/META-INF/context.xml", metaInfCtxAsXml, "utf8");
    },

    installDependencies: function() {
        var self = this;

        if (this.props.runNpm) {
            process.chdir("src/main/webapp/");

            this.npmInstall([
                "babel-core", 
                "babel-helper-vue-jsx-merge-props", 
                "babel-plugin-syntax-jsx", 
                "babel-plugin-transform-vue-jsx", 
                "babel-preset-es2015", 
                "babelify", 
                "browserify", 
                "browserify-hmr", 
                "grunt@0.4.5", 
                "grunt-browserify", 
                "grunt-contrib-sass", 
                "grunt-contrib-uglify", 
                "node-sass", 
                "uglify", 
                "vueify", 
            ], 
            { saveDev: true },
            function () {
                
                self.npmInstall([
                    "bootstrap-sass",
                    "js-sha1",
                    "lodash",
                    "moment",
                    "simplestorage.js",
                    "v-mask",
                    "vue",
                    "vue-awesome",
                    "vue-chartjs",
                    "vue-i18n",
                    "vue-moment",
                    "vue-resource",
                    "vue-router",
                    "vue-strap"
                ], 
                { save: true },
                function() {
                    process.chdir("../../../");
                });
            });
        }
    },

    //everthing after npm install needs to be at `end`
    end: function() {
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

    _generateDataForColumn: function(column, index) {

        if (column.primaryIndex == 1) { 
            //if it is the second primary it will be counted regulary to avoid duplicate entry
            return index + 1;
        }

        if (column.column_key === "PRI") {
            return index + 1;
        }

        if (column.referencedTable) {
            if (index == 0) {
                return 1; //the first one is connected with the other first one's
            } else {
                return Math.floor(Math.random() * 50) + 1;
            }
        }

        if (column.smartType === "email") {
            if (index == 0) {
                return "\"user@gmail.com\""; //the first one will be user@gmail.com
            } else {
                return "\"" + lorem(1) + "@gmail.com\"";
            }
        }

        if (column.smartType === "password") {
            return "SHA1(SHA1(\"abcabc\"))";
        }

        if (column.smartType === "imageUrl") {
            return "\"https://unsplash.it/600?image=" + Math.floor(Math.random() * 1000) + "\"";
        }

        if (column.smartType === "url") {
            return "\"" + lorem.url() + "\"";
        }

        if (["char", "varchar", "text"].indexOf(column.data_type) > -1) {
            return "\"" + lorem(Math.min(2000, column.character_maximum_length), index === 0) + "\"";
        }

        else if (["float", "double", "real", "double precision", "numeric", "decimal"].indexOf(column.data_type) > -1) {
            return (Math.random() * 300).toFixed(3);
        }

        else if (["int", "integer", "smallint", "mediumint", "bigint"].indexOf(column.data_type) > -1) {
            return Math.floor(Math.random() * 300);
        }

        else if ("tinyint" === column.data_type) {
            if (index == 0) {
                return 1; //the first one has everything true
            } else {
                return Math.round(Math.random() * 1);
            }
        }

        else if (["date", "time", "datetime", "timestamp"].indexOf(column.data_type) > -1) {
            var minDate = new Date(2012, 0, 1); 
            var maxDate = new Date();
            var date = new Date(minDate.getTime() + Math.random() * (maxDate.getTime() - minDate.getTime()))
            return "\"" + moment(date).format("YYYY-MM-DD HH:mm:ss.000") + "\"";
        }

        throw new Error("Unkown type " + column.data_type + " for " + column.column_name);
    },

    _generateSmartType: function(column) {

        if (column.data_type === "tinyint" && this._regexTestExactInsensitive(this.props.columnNamePatterns.active, column.column_name)) {
            return "active";
        }

        else if (column.javaType === "String" && this._regexTestExactInsensitive(this.props.columnNamePatterns.email, column.column_name)) {
            return "email";
        }

        else if (column.javaType === "String" && this._regexTestExactInsensitive(this.props.columnNamePatterns.password, column.column_name)) {
            return "password";
        }

        else if (column.javaType === "String" && this._regexTestExactInsensitive(this.props.columnNamePatterns.imageUrl, column.column_name)) {
            return "imageUrl";
        }

        else if (column.javaType === "String" && this._regexTestExactInsensitive(this.props.columnNamePatterns.url, column.column_name)) {
            return "url";
        }

        return null;

    },

    _regexTestExactInsensitive: function(r, str) {
        var match = str.match(new RegExp(r, "i"));
        return match != null && str == match[0];
    },

    _camelCase: function(string) {
        return string.replace(/_([a-z])/g, function (g) { 
            return g[1].toUpperCase();
        });
    },

    _naturalCase: function(string) {
        return this._capitalizeFirstLetter(string.replace(/\.?([A-Z]+)/g, " $1").replace(/^\s/, ""));
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
    },

    _notIdPkFk: function(string) {
        var newStr = string + "";
        if (newStr.charAt(0) === "i" && newStr.charAt(1) === "d") {
            newStr = newStr.slice(2);
        }

        if ((newStr.charAt(newStr.length -2) === "P" || newStr.charAt(newStr.length -2) === "F") && newStr.charAt(newStr.length -1) === "k") {
            newStr = newStr.slice(0, -2);
        }

        return this._normalizeFirstLetter(newStr);
    }
});
