'use strict';
var yeoman = require('yeoman-environment');
var generators = require('yeoman-generator').generators;

var lorem = require("./services/lorem");
var pomManager = require("./services/pomManager");
var metaInfCtxManager = require("./services/metaInfCtxManager");
var webpackManager = require("./services/webpackManager");
var mysqlManager = require("./services/mysqlManager");
var npmManager = require("./services/npmManager");
var processor = require("./services/processor");
var tplManager = require("./services/templateManager");

/*
O QUE USAMOS DO YEOMAN:
- async - podemos fazer com q todos os métodos retornem uma promise e dar chain
- npmInstall - procurar na internet como executar `npm install --save <modulo>`
- fs (copy, copyTpl) - require('fs') e underscore
- templatePath - só criar um método igual customDestinationPath
- spawnCommand(npm run dev) - procurar na internet
*/

module.exports = function(params, cb) {

    var TheGenerator = generators.Base.extend({

        configureForEnv: function() {
        	this.customDestinationPath = function (morepath) {
        		return params.path + morepath;
        	};

        	this.sourceRoot('generators/app/templates');

            this.props = params;
        },

        readPom: function() {
            pomManager.readFromFile(this, false);
        },

        readMetaInfCtx: function() {
            metaInfCtxManager.readFromFile(this);
        },

        readWebpackConfig: function() {
            webpackManager.readFromFile(this);
        },

        generateProjectProps: function() {
            processor.projectProps(this);
        },

        generatePom: function() {
            pomManager.fillMissingContent(this);
        },

        generateMetaInfCtx: function() {
            metaInfCtxManager.fillMissingContent(this);
        },

        generateWebpackConfig: function() {
            webpackManager.fillMissingContent(this);
        },

        connectToDatabase: function(){
            mysqlManager.connect(this);
        },

        readTables: function() {
            mysqlManager.readTables(this);
        },

        readColumns: function() {
            mysqlManager.readColumns(this);
        },

        generateTablesProps: function() {
            processor.tablesProps(this);
        },

        writeJavaClasses: function () {
            tplManager.javaClasses(this);
        },

        writeJsClasses: function() {
            tplManager.jsClasses(this);
        },

        writeScssFiles: function() {
            tplManager.scssFiles(this);
        },

        writeHtmlFiles: function() {
            tplManager.htmlFiles(this);
        },

        writeSomeFolders: function() {
            webpackManager.writeToFile(this);
            tplManager.otherFiles(this);
            pomManager.writeToFile(this);
            metaInfCtxManager.writeToFile(this);
        },

        installDependencies: function() {
            npmManager.install(this);
        },

        //everthing after npm install needs to be at `end`
        end: function() {
            process.chdir(this.customDestinationPath("src/main/webapp/"));
            this.spawnCommand('npm run dev');
            process.chdir(this.customDestinationPath(""));
            // process.exit();
        }
    });

    var env = yeoman.createEnv();

    env.registerStub(TheGenerator, 'martinlabs-form:app');

    env.run('martinlabs-form:app', {
    	force: true //sobrescreve sempre o arquivo
    }, cb);
};