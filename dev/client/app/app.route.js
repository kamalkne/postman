(function() {
    'use strict';

    /**
     * @name pst.config
     * @description
     * Configuration of application routes, states and i18n
     *
     */
    angular
        .module('pst')
        .config(['$stateProvider', '$urlRouterProvider', '$translateProvider', '$locationProvider',
            function($stateProvider,
                     $urlRouterProvider,
                     $translateProvider,
                     $locationProvider) {
                $translateProvider.useStaticFilesLoader({
                    prefix: 'data/i18n/locale-',
                    suffix: '.json'
                });
                $translateProvider.fallbackLanguage('en');
                $translateProvider.preferredLanguage('en');
                $translateProvider.useSanitizeValueStrategy('sanitizeParameters');

                $urlRouterProvider.otherwise('/');

                $stateProvider
                    .state('home', {
                        url: '/',
                        controller: 'HomeCtrl',
                        templateUrl: 'app/pages/home/home.tmpl.html'
                    });

                $locationProvider.html5Mode(false);
            }])
        .run(['$document', '$rootScope', function($document, $rootScope) {
            $rootScope.$on('$stateChangeSuccess', function() {
                $document[0].body.scrollTop = $document[0].documentElement.scrollTop = 0;
            });
        }]);
})();
