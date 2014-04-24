module.exports = function(config){
  config.set({

    basePath : '../',

    files : [
      'bower_components/angular/angular.js',
      'bower_components/angular-route/angular-route.js',
      'bower_components/angular-resource/angular-resource.js',
      'bower_components/angular-ui-select2/src/select2.js',
      'bower_components/angular-mocks/angular-mocks.js',
      'app/js/app.js',
      'app/js/controllers.js',
      'app/js/directives.js',
      'app/js/filters.js',
      'app/js/services.js',
      'test/unit/**/*.js'
    ],

    autoWatch : true,

    frameworks: ['jasmine'],

    browsers : ['Chrome'],

    plugins : [
            'karma-chrome-launcher',
            'karma-firefox-launcher',
            'karma-jasmine'
            ],

    junitReporter : {
      outputFile: 'test_out/unit.xml',
      suite: 'unit'
    }

  });
};