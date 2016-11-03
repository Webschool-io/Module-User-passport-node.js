(function(){
	'use strict';

	angular
		.module('app.login')
		.run(appRun);

	function appRun(routerHelper){
		routerHelper.configureStates(getStates());
	}

	function getStates(){
        return [
            {
                state: 'login',
                config: {
                    url: '/',
                    views: {
                        'headerModule': {
                            templateUrl: 'app/template/header.html',
                            controller: 'HeaderController',
                            controllerAs: 'vm'
                        },
                        'menuModule@login': {
                            templateUrl: 'app/template/menu-login.html'
                        },
                        'menuModule': {
                            templateUrl: 'app/template/menu.html'
                        },
                        'mainModule': {
                            templateUrl: 'app/modules/login/views/index.html',
                            controller: 'LoginController',
                            controllerAs: 'vm'
                        },
                        'footerModule': {
                            templateUrl: 'app/template/footer.html'
                        }
                    },
                    title: 'Login'
                    // , resolve: {
                    //     loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
                    //         return $ocLazyLoad.load([
                    //                                     'app/assets/css/charts-graphs.css'
                    //                                   , 'app/assets/css/barIndicator.css'
                    //                                 ]);
                    //     }]
                    // }
                }
            }
        ];
	}

})();