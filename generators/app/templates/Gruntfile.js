module.exports = function(grunt) {

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        browserify: grunt.file.readJSON('browserify.json'),
        uglify: grunt.file.readJSON('uglify.json'),
        sass: grunt.file.readJSON('sass.json'),
        cssmin: grunt.file.readJSON('cssmin.json'),
    });

    grunt.loadNpmTasks('grunt-browserify');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-sass');
    grunt.loadNpmTasks('grunt-contrib-cssmin');

    grunt.registerTask('default', ['browserify', 'sass']);
    grunt.registerTask('production', ['browserify', 'sass', 'uglify', 'cssmin']);

};