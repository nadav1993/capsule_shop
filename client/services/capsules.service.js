angular.module('capsuleShop').
    factory('Factory', function capsulesFactory($http, $q){
        var service = {
            getAllCapsules: getAllCapsules,
            getById: getById,
            getAllCompanies: getAllCompanies,
            add,
            update,
            delete: deleteCapsule,
            getAllStrengths: getAllStrengths,
            addCompany: addCompany,
            search: search
        }

        return service;
        
        function search(name, companies, strengths) {
            return $http.post('/api/capsuleSearch', {name, companies, strengths});
        }
    
        function getAllCapsules() {
            return $http.get('/api/capsules');
        }

        function getById(capsuleId) {
            return $http.get('/api/capsule/' + capsuleId);
        }

        function getAllCompanies() {
            return $http.get('/api/companies');
        }

        function add(capsule) {
            return $http.post('/api/capsules', capsule);
        }

        function update(capsule) {
            return $http.put('/api/capsules', capsule);
        }

        function deleteCapsule(capsuleId) {
            return $http.delete('/api/capsule/' + capsuleId);
        }

        function addCompany(company) {
            return $http.post('/api/companies', company);
        }

        function getAllStrengths() {
            return [{
                key:0,
                value:"Light"
            }, {
                key:1,
                value:"Medium"
            }, {
                key:2,
                value:"Dark"
            }];
        }
});