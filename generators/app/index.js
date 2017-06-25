'use strict';
var yeoman = require('yeoman-generator');

var lorem = require("./services/lorem");
var pomManager = require("./services/pomManager");
var promptManager = require("./services/promptManager");
var metaInfCtxManager = require("./services/metaInfCtxManager");
var webpackManager = require("./services/webpackManager");
var mysqlManager = require("./services/mysqlManager");
var npmManager = require("./services/npmManager");
var processor = require("./services/processor");
var tplManager = require("./services/templateManager");

module.exports = yeoman.generators.Base.extend({

    readConfig: function() {
        this.customDestinationPath = this.destinationPath;

        this.props = this.config.get("props") || {};
    },

    initialPrompt: function () {
        promptManager.initial(this);
    },

    saveConfig: function() {
        this.config.set("props", this.props);
        this.config.save();
    },

    readPom: function() {
        pomManager.readFromFile(this);
    },

    promptPomMissingInfo: function() {
        promptManager.pomMissingInfo(this);
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
        process.chdir("src/main/webapp/");
        this.spawnCommand('npm run dev');
        process.chdir("../../../");
        process.exit();
    }
});
