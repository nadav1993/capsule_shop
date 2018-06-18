angular.module('capsuleShop').
    factory('ViewFactory', function StoreFactory($http){
        var service = {
            newView: newView,
            recommedation: recommedation,
            twit: twit
        }

        return service;

        function twit(text) {
            return $http.post('/api/twits', { text });
        }
    
        function newView(strength, prodId) {
            const now = new Date();
            const view = {
                strength,
                productId: prodId,
                viewDate: now
            };
            return $http.put('/api/view', view);
        }

        function recommedation() {
            return $http.get('/api/view');
        }
});