(function() {
    'use strict';

    /**
     * @ngdoc service
     * @name pst.appConfig
     * @description
     * Application wide configuration used in bootstrapping the app
     *
     */
    angular
        .module('pst')
        .constant('appConstants', appConstants);
})();
