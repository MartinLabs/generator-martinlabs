var yosay = require('yosay');
var chalk = require('chalk');

module.exports = {

	initial: function(main) {
		var done = main.async();

        main.log(yosay(
            'Welcome to ' + chalk.bgBlack.white(' Martinlabs ') + ' CRUD generator ;)'
            ));

        var prompts = [{
            type: 'input',
            name: 'modulename',
            message: 'Input the Module Name',
            default: main.props.modulename || "crud"
        },{
            type: 'input',
            name: 'user',
            message: 'Input the Mysql User',
            default: main.props.user
        },{
            type: 'password',
            name: 'password',
            message: 'Input the Mysql Password',
            default: main.props.password
        },{
            type: 'input',
            name: 'database',
            message: 'Input the Database Name',
            default: main.props.database
        },{
            type: 'input',
            name: 'tables',
            message: 'Input the Tables Names separated by comma (or "all tables") ',
            default: main.props.tables ? main.props.tables : "all tables"
        },{
            type: 'confirm',
            name: 'runNpm',
            message: 'Do you want to Install the NPM Dependencies?',
            default: main.props.runNpm === true
        },{
            type: 'confirm',
            name: 'loginsys',
            message: 'Do you want to include a Login System?',
            default: main.props.loginsys === true
        }];

        main.prompt(prompts, function (props) {
            main.props.modulename = props.modulename.replace(/[^a-z0-9]/gi,'').toLowerCase();
            main.props.user = props.user;
            main.props.password = props.password;
            main.props.database = props.database;
            main.props.tables = props.tables;
            main.props.runNpm = props.runNpm
            main.props.loginsys = props.loginsys;

            done();
        });
	},

	forLogin: function(main) {
		var done = main.async();

        var prompts = [{
            type: 'input',
            name: 'logintablename',
            message: 'Input the Login Table Name',
            default: main.props.logintablename
        },{
            type: 'input',
            name: 'loginaccountcolumn',
            message: 'Input the Login Account Column Name',
            default: main.props.loginaccountcolumn
        },{
            type: 'input',
            name: 'loginpasswordcolumn',
            message: 'Input the Login Password Column Name',
            default: main.props.loginpasswordcolumn
        }];

        main.prompt(prompts, function (props) {
            main.props.logintablename = props.logintablename;
            main.props.loginaccountcolumn = props.loginaccountcolumn;
            main.props.loginpasswordcolumn = props.loginpasswordcolumn;

            done();
        });
	},

	columnNamePatters: function(main) {
		var done = main.async();

        var prompts = [{
            type: 'confirm',
            name: 'configureColumnNamePattern',
            message: "Do you want to configure column names pattern? It's " + (main.props.columnNamePatterns ? "Already configured" : "Not configured"),
            default: main.props.columnNamePatterns == null
        }];

        main.prompt(prompts, function (props) {
            if (props.configureColumnNamePattern) {

                if (!main.props.columnNamePatterns) {
                    main.props.columnNamePatterns = {};
                }

                prompts = [{
                    type: 'input',
                    name: 'emailCNP',
                    message: 'Email: a string that represents an e-mail. Enter a Regex to Match, case insensitive',
                    default: main.props.columnNamePatterns.email || "\\w*email\\w*"
                },{
                    type: 'input',
                    name: 'passwordCNP',
                    message: 'Password: a string that represents a password. Enter a Regex to Match, case insensitive',
                    default: main.props.columnNamePatterns.password || "\\w*(password|senha)\\w*"
                },{
                    type: 'input',
                    name: 'imageUrlCNP',
                    message: 'Image URL: a string that represents an image URL. Enter a Regex to Match, case insensitive',
                    default: main.props.columnNamePatterns.imageUrl || "\\w*url\\w*(image|photo|foto)\\w*|\\w*(image|photo|foto)\\w*url\\w*"
                },{
                    type: 'input',
                    name: 'urlCNP',
                    message: 'URL: a string that represents an URL, will be tested after Image URL. Enter a Regex to Match, case insensitive',
                    default: main.props.columnNamePatterns.url || "\\w*url\\w*"
                },{
                    type: 'input',
                    name: 'activeCNP',
                    message: 'Active: a boolean that indicates if the row can be used, mimics a delete if it is false. Enter a Regex to Match, case insensitive',
                    default: main.props.columnNamePatterns.active || "(active|ativo)"
                }];

                main.prompt(prompts, function (props) {
                    main.props.columnNamePatterns.email = props.emailCNP;
                    main.props.columnNamePatterns.password = props.passwordCNP;
                    main.props.columnNamePatterns.imageUrl = props.imageUrlCNP;
                    main.props.columnNamePatterns.url = props.urlCNP;
                    main.props.columnNamePatterns.active = props.activeCNP;

                    done();
                });

            } else {
                done();
            }
        });
	},

    pomMissingInfo: function(main) {
        if (!main.props.package || !main.props.projectName) {
            var done = main.async();

            var prompts = [{
                type: 'input',
                name: 'projectName',
                message: 'Input the Project Name'
            },{
                type: 'input',
                name: 'package',
                message: 'Input the Package'
            }];

            main.prompt(prompts, function (props) {
                main.props.package = props.package;
                main.props.projectName = props.projectName;

                done();
            });
        }
    }

};