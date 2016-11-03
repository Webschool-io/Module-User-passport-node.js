(function() {
    'use strict';

    angular
        .module('app.core')
        .directive('confPass', confPass)
        ;

    function confPass(){
        return {
            require: 'ngModel'
          , scope: {
                otherModelValue: '=confPass'
          }
          , link: function(scope, element, attributes, ngModel){
                ngModel.$validators.confPass = function(modelValue){
                    return modelValue == scope.otherModelValue;
                };
                scope.$watch('otherModelValue', function(){
                    ngModel.$validate();
                });
          }
        };
    }

    
})();