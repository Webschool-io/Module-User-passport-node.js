(function(){
	'use strict';

	angular
		.module('app.users')
		.controller('UsersController', UsersController);

	function UsersController(UsersService){
		let vm = this;

		vm.add = () => {
			if (vm.formAddUser.$valid){
				delete vm.user.repassword;
				UsersService.add(vm.user).success((data) => {
					alert('Cadastro de usuário realizado com sucesso!');
					vm.user = '';
					vm.formAddUser.$setPristine();
					return false;
				})
				.error((err) => {
					console.log('rireto no erro:', err);
					alert('Erro ao cadastrar o usuário!');
					return false;
				});
			}
		};
	}

})();