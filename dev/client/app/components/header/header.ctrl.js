(function() {
    'use strict';

    /**
     * @ngdoc directive
     * @name pst.directive:pstHeader
     * @restrict E
     *
     * @description Header component to show in all pages
     *
     * @example <pst-header></pst-header>
     */
    angular.module('pst').controller(
            'HeaderCtrl',
            [HeaderCtrl]).component('pstHeader', {
        bindings: {},
        controller: 'HeaderCtrl',
        templateUrl: 'app/components/header/header.tmpl.html'
    });

    function HeaderCtrl() {
        var vm = this;
        // Have to use $scope instead of vm as children are using zones.
        vm.zoneMenus = [];
        vm.user = {};

        vm.reportIssuecategories = [
            'Home page',
            'Search results',
            'Courses content',
            'My Assignments',
            'My Library',
            'My Favourites',
            'My Self-Enroll Assignments',
            'Others'
        ];
    }
})();
