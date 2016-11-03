(function() {
    'use strict';

    angular
        .module('app.core')
        .run(appRun);

    /* @ngInject */
    function appRun(routerHelper) {
        var otherwise = '/404';
        routerHelper.configureStates(getStates(), otherwise);
    }

    function getStates() {

        return [
            {
                state: '404',
                config: {
                    url: '/404',
                    views: {
                        'headerModule': {
                            templateUrl: 'app/template/header.html',
                            controller: 'HeaderController',
                            controllerAs: 'vm'
                        },
                        'menuModule': {
                            templateUrl: 'app/template/menu.html'
                        },
                        'mainModule': {
                            templateUrl: 'app/modules/erros/views/404.html',
                        },
                        'footerModule': {
                            templateUrl: 'app/template/footer.html'
                        }
                    },
                    title: '404'
                }
            }
        ];
    }
})();