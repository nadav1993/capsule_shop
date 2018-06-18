(function() {
    'use strict';

    angular
        .module('capsuleShop')
        .config(['$stateProvider', '$urlRouterProvider', routesConfigFunction]);

    function routesConfigFunction($stateProvider, $urlRouterProvider) {
        $urlRouterProvider.otherwise('/home');

        $stateProvider
            .state('home', {
                url: '/home',
                component: 'home',
                resolve: {
                    capsules: function(Factory){
                        return Factory.getAllCapsules();
                    }
                }
            })
            .state('about', {
                url: '/about',
                templateUrl: 'pages/about.html'
            })
            .state('stores', {
                url: '/stores',
                component: 'stores',
                resolve: {
                    stores: function(StoreFactory) {
                        return StoreFactory.getAllStores();
                    }
                }
            })
            .state('capsules', {
                url: '/capsules',
                component: 'capsuleList',
                resolve: {
                    capsules: function(Factory){
                        return Factory.getAllCapsules();
                    },
                    companies: function(Factory){
                        return Factory.getAllCompanies();
                    }
                }
            })
            .state('capsuleDetails', {
                url: '/capsule/:id',
                component: 'capsule',
                resolve: {
                    capsule: function(Factory, $stateParams){
                        return Factory.getById($stateParams.id);
                    }
                }
            })
            .state('manager-capsules', {
                url: '/manager-capsules',
                component: 'manageCapsules',
                resolve: {
                    capsules: function(Factory){
                        return Factory.getAllCapsules();
                    },
                    companies: function(Factory){
                        return Factory.getAllCompanies();
                    }
                }                
            })
            .state('manager-statistics', {
                url: '/manager-statistics',
                component: 'managerStatistics',
                resolve: {
                    capsules: function(Factory){
                        return Factory.getAllCapsules();
                    }
                }                
            })
            .state('manager-companies', {
                url: '/manager-companies',
                component: 'manageCompanies',
                resolve: {
                    companies: function(Factory){
                        return Factory.getAllCompanies();
                    }
                }
            })
            .state('cart', {
                url: '/cart',
                component: 'cart',
                resolve: {
                    cartItems: function(CartFactory){
                        return CartFactory.getCartItems();
                    }
                }         
            })
            .state('error', {
                utl: '/error',
                component: ''				
            });            
    }
})();