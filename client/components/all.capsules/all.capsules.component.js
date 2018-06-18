(function() {
    'use strict';

    angular
        .module('capsuleShop')
        .component('capsuleList', {
            templateUrl: 'components/all.capsules/all.capsules.component.html',
            controller: CapsulesController,
			controllerAs: 'ctrl',
			bindings: {
				capsules: '<',
				companies: '<'
			}
        });

    CapsulesController.$inject = ['$scope', 'Factory', 'socketService'];

    function CapsulesController($scope, Factory, socketService) {
		var self = this;
		
		self.$onInit = function() {
			self.capsules = initData(self.capsules.data)
			self.companies = self.companies.data
			self.orderbyfilter = "";
			self.addToCart = true;
			self.showPrice = true;
			self.strengths = Factory.getAllStrengths();
		
			self.companyFilter = {};
			for (var i=0; i< self.companies.length; i++){
				self.companyFilter[self.companies[i].name]=true;
			} 
			
			self.strengthFilter = {};
			for (var i=0; i< self.strengths.length; i++){
				self.strengthFilter[self.strengths[i].key]=true;
			}
		}

		socketService.on('capsuleAdded', function(data) {
			$scope.$apply(function() {
				self.capsules.push(data);
			});
		});

		self.search = () =>{
			let companies = self.companies.filter((obj) => self.companyFilter[obj.name]);
			companies = companies.map((obj) => obj.name);
			let strengths = self.strengths.filter((obj) => self.strengthFilter[obj.key]);
			strengths = strengths.map((obj) => obj.key);
			Factory.search(self.searchText, companies, strengths).then((data, err) => {
				if (data.data) {
					self.capsules = data.data;
				}
			}).catch(()=>{
			});
		};

		socketService.on('capsuleUpdated', function(data) {
			var index = self.capsules.findIndex(function(obj) {
				return obj._id === data._id;
			});

			$scope.$apply(function() {
				self.capsules[index] = data;
			});
		});

		socketService.on('companyAdded', function(data) {
			$scope.$apply(function() {
				self.companies.push(data);
				self.companyFilter[data.name] = true;
			});
		});

		socketService.on('capsuleRemoved', function(data) {
			var index = self.capsules.findIndex(function(obj) {
				return obj._id === data._id;
			});

			$scope.$apply(function() {
				self.capsules.splice(index, 1);
			});
		});

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
    }
})()