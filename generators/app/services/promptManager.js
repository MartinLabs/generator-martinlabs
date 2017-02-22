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
            main.props.modulename = props.modulename.replace(/[^a-z0-9]/gi,'').toLowerCase();
            main.props.user = props.user;
            main.props.password = props.password;
            main.props.database = props.database;
            main.props.tables = props.tables;
            main.props.runNpm = props.runNpm;
            main.props.logintablename = props.logintablename;
            main.props.loginaccountcolumn = props.loginaccountcolumn;
            main.props.loginpasswordcolumn = props.loginpasswordcolumn;

            done();
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