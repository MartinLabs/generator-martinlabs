var jsonfile = require('jsonfile');

module.exports = {

	readFromFile: function(main) {
        var done = main.async();

		jsonfile.readFile(main.customDestinationPath("src/main/webapp/package.json"), function(err, obj) {
		    main.props.npmPackage = obj;

		    jsonfile.readFile(main.customDestinationPath("src/main/webapp/browserify.json"), function(err, obj) {
		        main.props.browserify = obj;

		        jsonfile.readFile(main.customDestinationPath("src/main/webapp/sass.json"), function(err, obj) {
		            main.props.sass = obj;

		            jsonfile.readFile(main.customDestinationPath("src/main/webapp/uglify.json"), function(err, obj) {
		                main.props.uglify = obj;

		                jsonfile.readFile(main.customDestinationPath("src/main/webapp/cssmin.json"), function(err, obj) {
		                    main.props.cssmin = obj;
		                    done();
		                });
		            });
		        });
		    });
		});
	},

	fillMissingContent: function(main) {
		//package
        if (!main.props.npmPackage) {
            main.props.npmPackage = {
                "name": main.props.modulename,
                "version": "1.0.0",
                "private": true,
                "description": main.props.modulename
            };
        }

        //browserify
        if (!main.props.browserify) {
            main.props.browserify = {
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

        main.props.browserify.dist.files[main.props.modulename + "/" + main.props.modulename + ".js"] = 
            "src/" + main.props.modulename + "/js/index.js";

        //sass
        if (!main.props.sass) {
            main.props.sass = {
                "dist": {
                    "files": []
                }
            };
        }

        var existSassModulePath = false;
        var sassFiles = main.props.sass.dist.files;
        var sassPath = "src/" + main.props.modulename + "/scss";
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
                "src": [main.props.modulename + ".scss"],
                "dest": main.props.modulename + "/css",
                "ext": ".css"
            });
        }

        //uglify
        if (!main.props.uglify) {
            main.props.uglify = {
                "options": {
                    "mangle": false
                },
                "all": {
                    "files": {}
                }
            };
        }

        var jsFile = main.props.modulename + "/" + main.props.modulename + ".js";
        main.props.uglify.all.files[jsFile] = jsFile;

        //cssmin
        if (!main.props.cssmin) {
            main.props.cssmin = {
                "target": {
                    "files": []
                }
            };
        }

        var existCssModulePath = false;
        var cssFiles = main.props.cssmin.target.files;
        var cssPath = main.props.modulename + "/css";
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

            jsonfile.writeFile(main.customDestinationPath("src/main/webapp/browserify.json"), main.props.browserify, function(err) {

                jsonfile.writeFile(main.customDestinationPath("src/main/webapp/sass.json"), main.props.sass, function(err) {

                    jsonfile.writeFile(main.customDestinationPath("src/main/webapp/uglify.json"), main.props.uglify, function(err) {

                        jsonfile.writeFile(main.customDestinationPath("src/main/webapp/cssmin.json"), main.props.cssmin, function(err) {
                            done();
                        });
                    });
                });
            });
        });
    }

};


