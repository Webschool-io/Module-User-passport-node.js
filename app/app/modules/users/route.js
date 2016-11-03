(function(){
	'use strict';

	angular
		.module('app.users')
		.run(appRun);

	function appRun(routerHelper){
		routerHelper.configureStates(getStates());
	}

	function getStates(){
        return [
            {
                state: 'users/add',
                config: {
                    url: '/users/add',
                    views: {
                        'headerModule': {
                            templateUrl: 'app/template/header.html',
                            controller: 'HeaderController',
                            controllerAs: 'vm'
                        },
                        'menuModule@users/add': {
                            templateUrl: 'app/template/menu-login.html'
                        },
                        'mainModule': {
                            templateUrl: 'app/modules/users/views/add.html',
                            controller: 'UsersController',
                            controllerAs: 'vm'
                        },
                        'footerModule': {
                            templateUrl: 'app/template/footer.html'
                        }
                    },
                    title: 'Add user'
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