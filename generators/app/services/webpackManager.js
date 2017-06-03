var jsonfile = require('jsonfile');

module.exports = {

	readFromFile: function(main) {
        var done = main.async();

		jsonfile.readFile(main.customDestinationPath("src/main/webapp/package.json"), function(err, obj) {
		    main.props.npmPackage = obj;

		    jsonfile.readFile(main.customDestinationPath("src/main/webapp/webpack.path.json"), function(err, obj) {
		        main.props.webpackPath = obj;

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
                description: main.props.modulename,
                scripts: {
                	dev: "webpack",
                	production: "NODE_ENV=production webpack",
                	watch: "npm run dev -- --watch"
                }
            };
        }

        //webpack path
        if (!main.props.webpackPath) {
            main.props.webpackPath = {};
        }

        main.props.webpackPath[main.props.modulename] = [
        	`./src/${main.props.modulename}/js/index.js`,
    	    `./src/${main.props.modulename}/scss/${main.props.modulename}.scss`
        ];
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

        jsonfile.writeFile(main.customDestinationPath("src/main/webapp/package.json"), main.props.npmPackage, function(err) {

            jsonfile.writeFile(main.customDestinationPath("src/main/webapp/webpack.path.json"), main.props.webpackPath, function(err) {
                done();
            });
        });
    }

};


