(function() {
    'use strict';

    angular
        .module('managerModule')
        .component('manageCapsules', {
            controller: ManageCapsulesController,
            controllerAs: 'ctrl',
            templateUrl: 'components/manage.capsules/manage.capsules.component.html',
            bindings: {
                capsules: '<',
				companies: '<'
            }
        });

    ManageCapsulesController.$inject = ['$mdToast', '$mdDialog', 'Factory', 'CartFactory', '$timeout', 'socketService', 'ViewFactory', '$scope'];

    function ManageCapsulesController($mdToast, $mdDialog, Factory, CartFactory, $timeout, socketService, ViewFactory, $scope) {
        var self = this;
		
		self.$onInit = function() {
            self.capsules = initData(self.capsules.data);
            self.companies = self.companies.data;
            self.orderbyfilter = '';
            self.tweet = '';
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
        
        self.postTweet = () =>{
            ViewFactory.twit(self.tweet).then((data, err)=> {
                let msg = 'Something went wrong :(';
                if (!err) {
                    msg = 'Tweet posted!';
                    self.tweet = '';
                }
                $mdToast.show(
                    $mdToast.simple()
                      .textContent(msg)
                      .position('bottom right')
                      .hideDelay(3000)
                  );
            }).catch(()=>{
                $mdToast.show(
                    $mdToast.simple()
                      .textContent('Something went wrong :(')
                      .position('bottom right')
                      .hideDelay(3000)
                  );
            });
        };

		self.filterByCompany = function(capsule){
			for	(var i=0; i< self.companies.length; i++){
				if (self.companyFilter[self.companies[i].name]){
					if (capsule.company == self.companies[i].name){
						return true;
					}
				}
			}		
			return false;
		}
		
		self.filterByStrength = function(capsule){
			for	(var i=0; i< self.strengths.length; i++){
				if (self.strengthFilter[self.strengths[i].key]){
					if (capsule.strength == self.strengths[i].key){
						return true;
					}
				}
			}		
			return false;
        }
        
        socketService.on('companyAdded', function(data) {
			$scope.$apply(function() {
                self.companies.push(data);
                self.companyFilter[data.name] = true;
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

        function getCapsules() {
            Factory.getAllCapsules().then(function(result) {
                self.capsules = initData(result.data);
            });
        }
        
        self.delete = function(capsuleId) {
            Factory.delete(capsuleId).then(function() {
                self.removed = capsuleId;

                $timeout(function(){
                    CartFactory.removeItem(capsuleId);
                    getCapsules();
                }, 600);
            });
        }

        self.openDialog = function(event, capsule) {
            $mdDialog.show({
                templateUrl: 'pages/templates/addEdit.html',
                targetEvent: event,
                clickOutsideToClose: true,
                escapeToClose: true,
                locals: {
                    capsule: capsule,
                    companies: self.companies,
                    strengths: self.strengths
                },
                controllerAs: 'ctrl',
                controller: function(Factory, capsule, companies, strengths, Upload, CartFactory) {
                    var self = this;
                    var isEdit = false;
                    self.capsule = angular.copy(capsule);
                    self.companies = companies;
                    self.strengths = strengths;
                    self.capsuleImage = {};

                    self.title = 'Add ';
                    if (self.capsule) {
                        isEdit = true;
                        self.title = 'Edit ';
                        self.capsuleImage.name = self.capsule.name + '.jpg';
                    }

                    self.save = function() {
                        Upload.upload({
                            url: '/api/upload',
                            data: {file: self.capsuleImage}
                        }).then(function(result) {
                            self.capsule.image = result.data.filename;

                            if (isEdit) {
                                Factory.update(self.capsule).then(function(result) {
                                    $mdDialog.hide();

                                    var capsulesFromCart = CartFactory.getCartItem(result.data._id);

                                    if (capsulesFromCart) {
                                        CartFactory.removeItem(result.data._id);
                                        CartFactory.addCartItem(result.data);
                                    }
                                    
                                    getCapsules();
                                }).catch(function(err) {
                                    console.log('failed to update the requested capsule', err);
                                });
                            } else {
                                Factory.add(self.capsule).then(function() {
                                    $mdDialog.hide();
                                    getCapsules();
                                }).catch(function(err) {
                                    console.log('failed to update the requested capsule', err);
                                });
                            }
                        }).catch(function(err) {
                            console.log('failed to upload the requested image');
                        });
                    }

                    self.close = function() {
                        $mdDialog.hide();
                    }
                }
            });
        }
    }
})();