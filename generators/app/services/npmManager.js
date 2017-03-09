module.exports = {

	install: function(main) {

		if (main.props.runNpm) {
            process.chdir(main.customDestinationPath("src/main/webapp/"));

            main.npmInstall([
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
                
                main.npmInstall([
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