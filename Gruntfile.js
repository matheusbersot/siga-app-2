module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    uglify: {
        all: {
            options: {
                mangle: false //to prevent changes to your variable and function names.             
            },
            files: [{
                expand: true,
                src: ["dist/www/js/**/*.js", "dist/www/lib/**/*.js"]
            }]
        }      
    },

    cssmin: {
      all: {
          files: [{
              expand: true,
              src: "dist/www/css/**/*.css"
          }]
      }
    },

    htmlmin: {
        options: {
            removeComments: true,
            collapseWhitespace: true
        },
        all: {
            files: [{
                expand: true,
                src: "dist/www/*.html"
            }]
        }
    },

    imagemin: {
        all: {
            files: [{
                expand: true,
                src: [ "dist/www/img/*.{png,gif,jpg}" ]
            }]
        }
    },

    clean: ["dist/**"],

    nameReleaseDir: '(dist)',
    releaseDir: './dist',
    homeApp: "../<%=pkg.name%>",
    
    shell: {        
        mkReleaseDir: {
            command: 'cd <%=homeApp%> && mkdir <%=releaseDir%>;'
        },
        copyDevDirToReleaseDir: {
            command: 'bash ./copyAllToDistDir.sh'            
        },
        runAndroid:{
            command: 'cd <%=releaseDir%> && ionic run android;'
        } 
    }   
        
  });

  // Load the plugin that provides the "uglify" task.
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks( "grunt-contrib-cssmin");
  grunt.loadNpmTasks( "grunt-contrib-htmlmin");
  grunt.loadNpmTasks( "grunt-contrib-imagemin" );
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-shell');

  // Default task(s).
  //grunt.registerTask( "lint", [ "jshint", "jscs", "csslint", "htmllint" ]);
  grunt.registerTask( "optimize", ["uglify", "cssmin", "htmlmin", "imagemin" ]);
  grunt.registerTask( "build", [ "shell:mkReleaseDir", "shell:copyDevDirToReleaseDir", "optimize"]);
  grunt.registerTask( "build2", [ "shell:copyDevDirToReleaseDir", "optimize"]);
  grunt.registerTask( "run", [ "shell:runAndroid" ]);  
  grunt.registerTask( "all", [ "build", "run" ]);  
  grunt.registerTask('default', ['all']);

};
