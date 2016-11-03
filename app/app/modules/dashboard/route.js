(function(){
	'use strict';

	angular
		.module('app.dashboard')
		.run(appRun);

	function appRun(routerHelper){
		routerHelper.configureStates(getStates());
	}

	function getStates(){
        return [
            {
                state: 'dashboard',
                config: {
                    url: '/dashboard',
                    views: {
                        'headerModule': {
                            templateUrl: 'app/template/header.html',
                            controller: 'HeaderController',
                            controllerAs: 'vm'
                        },
                        'menuModule@dashboard': {
                            templateUrl: 'app/template/menu.html'
                        },
                        'mainModule': {
                            templateUrl: 'app/modules/dashboard/views/index.html',
                            controller: 'DashboardController',
                            controllerAs: 'vm'
                        },
                        'footerModule': {
                            templateUrl: 'app/template/footer.html'
                        }
                    },
                    title: 'Dashboard'
                }
            }
        ];
	}

})();