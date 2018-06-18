(function() {
    'use strict';

    angular
        .module('capsuleShop')
        .directive('capsuleItem', ['Factory', function(Factory){
            return {
                restrict: 'E',
                replace: true,
                transclude:true,
                scope:{
                    capsule: '=',
                    addToCart: '=',
                    showPrice: '='
                },
                templateUrl: 'pages/templates/capsuleItem.html',
                link: function(scope, element, attrs) {
                    scope.imageUrl = scope.capsule.image ? 'public/Images/' + scope.capsule.image : 'public/Images/capsule.jpg';
                }
            }
    }]);
})();

