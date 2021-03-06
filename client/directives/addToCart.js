angular.module('cartModule').
    directive('addToCart', ['CartFactory', function(CartFactory){
        return {
            restrict: 'E',
            replace: true,
            scope:{
                addToCart: '=',
                capsule: '='
            },
            templateUrl: 'pages/templates/addToCart.html',
			link: function(scope, element, attrs){
				var element = element;
					scope.addItemToCart = function(event){
						CartFactory.addCartItem(scope.capsule);
						scope.$root.cartAmount = CartFactory.getCartAmount();
						$(event.target).next(".successMsg").fadeIn("slow", function(){
							$(event.target).next(".successMsg").fadeOut("slow");
						});
					};
			}
		}
	}]);