(function(){
	'use strict';

	angular
		.module('app.login')
		.controller('LoginController', LoginController);

	function LoginController($rootScope, AuthenticateService){
		const vm = this;
		vm.logged = false;

		AuthenticateService.ClearCredentials().success( (response) => { sessionStorage.removeItem('user'); });

		vm.authenticate = () => {
			vm.logged = true;
			AuthenticateService.Login(vm.auth).then( (user) => {
				vm.logged = false;
				if (user.success == false){
					console.log('Email ou senha inválidos, tente novamente.');
				}else{
					if (typeof(Storage) !== 'undefined') {
						delete user.auth;
					    sessionStorage.setItem('user', JSON.stringify(user));
					    location.href = './dashboard';
					} else {
					    console.log('Sorry! No Web Storage support.');
					}
				}
			});
		};
	}

})();
