module.exports = {

	install: function(main) {

		if (main.props.runNpm) {
            process.chdir(main.customDestinationPath("src/main/webapp/"));

            main.npmInstall([
                "autoprefixer",
                "babel-core",
                "babel-eslint",
                "babel-loader",
                "babel-plugin-transform-runtime",
                "babel-preset-env",
                "babel-preset-stage-2",
                "babel-register",
                "chalk",
                "connect-history-api-fallback",
                "copy-webpack-plugin",
                "css-loader",
                "eslint",
                "eslint-config-standard",
                "eslint-friendly-formatter",
                "eslint-loader",
                "eslint-plugin-html",
                "eslint-plugin-promise",
                "eslint-plugin-standard",
                "eventsource-polyfill",
                "express",
                "extract-text-webpack-plugin",
                "file-loader",
                "friendly-errors-webpack-plugin",
                "html-webpack-plugin",
                "http-proxy-middleware",
                "node-sass",
                "offline-plugin",
                "opn",
                "optimize-css-assets-webpack-plugin",
                "ora",
                "rimraf",
                "sass-loader",
                "semver",
                "shelljs",
                "url-loader",
                "vue-loader",
                "vue-style-loader",
                "vue-template-compiler",
                "webpack",
                "webpack-bundle-analyzer",
                "webpack-dev-middleware",
                "webpack-hot-middleware",
                "webpack-merge"
            ], 
            { saveDev: true },
            function () {
                
                main.npmInstall([
                    "js-sha256",
                    "linelay",
                    "lodash",
                    "moment",
                    "normalize-scss",
                    "simple-line-icons",
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