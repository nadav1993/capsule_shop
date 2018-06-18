angular.module('capsuleShop').
    directive('store', function(){
        return {
            restrict: 'E',
            replace: true,
			transclude: true,
            scope:{
                store: '='
            },
            templateUrl: 'pages/templates/store.html'
		}
    });