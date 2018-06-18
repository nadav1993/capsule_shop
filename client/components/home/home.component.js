(function() {
    'use strict';

    angular
        .module('capsuleShop')
        .component('home', {
            controller: HomeController,
            controllerAs: 'ctrl',
            templateUrl: 'components/home/home.component.html',
            bindings: {
                capsules: '<'
            }
        });

    HomeController.$inject = ['socketService', 'ViewFactory'];

    function HomeController(socketService, ViewFactory) {
        var self = this;
        self.recommend;
        socketService.emit('home', 'controller');
        /*socketService.on('data', function(data) {
            console.log(data);
        });*/

        self.$onInit = function() {
            self.capsules = initData(self.capsules.data)
            self.addToCart = false;
            self.showPrice = false;
            ViewFactory.recommedation().then((data, err) => {
                self.recommend = data.data;
            }).catch(()=> {

            });

            initCanvasTitle();            
        }

        function initData(data) {
			if (!data) {
				return data;
			}
			var results = [];
			for (var i = 0; i < data.length; i++) {
				results = results.concat(data[i].capsules);
			}

			return results;
        }
        
        function initCanvasTitle() {
            var c = document.getElementById("myCanvas");
            var ctx = c.getContext("2d");
            ctx.font = "35px Arial";
            ctx.strokeText("Welcome", 10, 50);   
        }
    }
})();