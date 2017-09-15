var jsonfile = require('jsonfile');
var generatorPackage = require('../../../package.json');

module.exports = {

	readFromFile: function(main) {
        var done = main.async();

		jsonfile.readFile(main.customDestinationPath("src/main/webapp/package.json"), function(err, obj) {
		    main.props.npmPackage = obj;

		    jsonfile.readFile(main.customDestinationPath("src/main/webapp/config/entries.json"), function(err, obj) {
		        main.props.webpackEntries = obj;

                done();
		    });
		});
	},

	fillMissingContent: function(main) {
		//package
        if (!main.props.npmPackage) {
            main.props.npmPackage = {
                name: main.props.modulename,
                version: "1.0.0",
                private: true,
                description: main.props.modulename + " - made with generator-martinlabs " + generatorPackage.version,
                scripts: {
                	dev: "node build/dev-server.js",
            	    start: "node build/dev-server.js",
                  build: "node build/build.js",
                  beta: "BETA=true npm run build",
                  lint: "eslint --ext .js,.vue src"
                },
                engines: {
                    node: ">= 4.0.0",
                    npm: ">= 3.0.0"
                },
                browserslist: [
                    "> 1%",
                    "last 2 versions",
                    "not ie <= 8"
                ]

            };
        }

        //webpack path
        if (!main.props.webpackEntries) {
            main.props.webpackEntries = {};
        }

        main.props.webpackEntries[main.props.modulename] = `./src/${main.props.modulename}/main.js`;
	},

    writeToFile: function(main) {
        var done = main.async();
        jsonfile.spaces = 4;

        try {
            fs.mkdirSync(main.customDestinationPath("src"));
        } catch (e) {}
        try {
            fs.mkdirSync(main.customDestinationPath("src/main"));
        } catch (e) {}
        try {
            fs.mkdirSync(main.customDestinationPath("src/main/webapp"));
        } catch (e) {}
        try {
            fs.mkdirSync(main.customDestinationPath("src/main/webapp/config"));
        } catch (e) {}

        jsonfile.writeFile(main.customDestinationPath("src/main/webapp/package.json"), main.props.npmPackage, function(err) {

            console.info(main.props.webpackEntries);

            jsonfile.writeFile(main.customDestinationPath("src/main/webapp/config/entries.json"), main.props.webpackEntries, function(err) {
                done();
            });
        });
    }

};


