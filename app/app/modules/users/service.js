(function(){
	'use strict';

	angular
		.module('app.users')
		.factory('UsersService', UsersService);

	function UsersService($http){
		const _URI = 'http://localhost:8080';
		return {
			add
		};

		function add(user){
			return $http.post(_URI+'/api/users', user);
		}
	}

})();