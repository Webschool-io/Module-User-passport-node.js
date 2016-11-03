(function(){
	'use strict';

	angular.module('app.core')
	.factory('AuthenticateService', AuthenticateService);

	function AuthenticateService($http){

		const _URI = 'http://localhost:8080'
		    , services = {
					Login
		  			, SetCredentials
		  			, ClearCredentials
					}
				;

		return services;

		function Login(user){
			return $http.post(_URI+'/api/users/login', user)
                .then(fComplete)
                .catch(fFailed);

            function fComplete(data, status, headers, config) {
                return data.data;
            }

            function fFailed(e) {
                return {success: false};
            }
		}

		function SetCredentials(){
			return $http.get(_URI+'/api/users/currentuser');
		}

		function ClearCredentials(){
			return $http.get(_URI+'/api/users/logout');	
		}
	}
})();
