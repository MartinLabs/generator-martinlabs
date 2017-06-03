module.exports = {

	install: function(main) {

		if (main.props.runNpm) {
            process.chdir(main.customDestinationPath("src/main/webapp/"));

            main.npmInstall([
                "babel-cli",
                "babel-core", 
                "babel-loader",
                "babel-preset-es2015", 
                "babel-preset-stage-2",
                "clean-webpack-plugin",
                "css-loader",
                "extract-text-webpack-plugin",
                "file-loader",
                "node-sass", 
                "sass-loader",
                "style-loader",
                "vue-loader@11.3.4",
                "vue-template-compiler",
                "webpack"
            ], 
            { saveDev: true },
            function () {
                
                main.npmInstall([
                    "bootstrap-sass",
                    "js-sha256",
                    "lodash",
                    "moment",
                    "simplestorage.js",
                    "v-mask@1.0.4",
                    "debounce-promise",
                    "chart.js",
                    "vue",
                    "vue-chartjs",
                    "vue-i18n",
                    "vue-moment",
                    "vue-resource",
                    "vue-router"
                ], 
                { save: true },
                function() {
                    process.chdir(main.customDestinationPath(""));
                });
            });
        }

	}

};