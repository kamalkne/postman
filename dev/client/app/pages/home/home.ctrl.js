(function() {
    'use strict';

    /**
     * @ngdoc controller
     * @name pst.controller:HomeCtrl
     * @description Controller for home page. Makes all service calls to
     *              populate home page and react to user inputs
     */
    angular.module('pst').controller(
        'HomeCtrl',
        ['appConstants', '$scope', HomeCtrl]);

    function HomeCtrl(appConstants, $scope) {
        $scope.friends = appConstants.friends;

        $scope.fChats = [];

        $scope.chatThis = function(a) {
            /* jshint ignore:start */
            testWebSocket();
            /* jshint ignore:end */
            if ($scope.fChats[0]) {
                for (var i = 0, j = $scope.fChats.length; i < j; i++) {
                    if ($scope.fChats[i].token === a.token) {
                        $scope.fObj = $scope.fChats[i];
                        return;
                    }
                }
            }
            $scope.fChats.push({
                token: a.token,
                chats: [],
                nm: a.nm
            });
            $scope.fObj = $scope.fChats[$scope.fChats.length - 1];
        };

        $scope.submitChat = function() {
            $scope.fObj.chats.push({
                timeStamp: new Date().getTime(),
                text: $scope.thisChat,
                boolean: 1
            });
            /* jshint ignore:start */
            doSend($scope.thisChat);
            /* jshint ignore:end */
            $scope.thisChat = '';
        };
    }
})();
