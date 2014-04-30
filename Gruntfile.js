module.exports = function(grunt) {

  //Load NPM tasks
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-browserify');

  // Project Configuration
  grunt.initConfig({
    watch: {
      scripts: {
        files: ['*.js', '**/*.js', '*.html', '!**/node_modules/**', '!lib/**js', '!js/bundle.js'],
        tasks: ['browserify'],
      },
    },
    browserify: {
      p2pvideo: {
        src: ['./p2pvideo.js'],
        dest: 'js/bundle.js',
        alias: ['./p2pvideo.js:p2pvideo'],
        browserifyOptions: {
          standalone: 'p2pvideo'
        }
      }
    }
  });

  grunt.registerTask('default', ['browserify', 'watch']);

};
