(function() {
    'use strict';

    var core = angular.module('app.core');

    var config = {
        appErrorPrefix: '[YCONTROL ERRO] ', //Configure the exceptionHandler decorator
        appTitle: 'YCONTROL',
        imageBasePath: '/assets/images/'
        //unknownPersonImageSource: 'unknown_person.jpg'
    };

    core.value('config', config);

    core.config(configure);

    configure.$inject = ['$compileProvider', '$logProvider', 'routerHelperProvider'];
    /* @ngInject */
    function configure ($compileProvider, $logProvider, routerHelperProvider) {

        $compileProvider.debugInfoEnabled(false);

        // turn debugging off/on (no info or warn)
        if ($logProvider.debugEnabled) {
            $logProvider.debugEnabled(true);
        }
        configureStateHelper();

        ////////////////

        function configureStateHelper() {
            var resolveAlways = { /* @ngInject */
                ready: function(dataservice) {
                    return dataservice.ready();
                }
            };

            routerHelperProvider.configure({
                docTitle: 'YCONTROL: ',
                resolveAlways: resolveAlways
            });
        }
    }
})();
