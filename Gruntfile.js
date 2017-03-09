module.exports = function(grunt) {

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        vueify: {
        	components: {
	            files: [
	                {
	                    expand: true,
	                    src: 'webapp/controller/**/*.vue',
	                    dest: '.',
	                    ext: '.vue.js'
	                }
	            ]
	        }
	    },
        sass: grunt.file.readJSON('sass.json')
    });

    grunt.loadNpmTasks('grunt-vueify');
    grunt.loadNpmTasks('grunt-contrib-sass');

    grunt.registerTask('default', ['vueify', 'sass']);
    grunt.registerTask('js', ['vueify']);

};