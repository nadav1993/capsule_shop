(function() {
    'use strict';

    angular
        .module('managerModule')
        .component('manageCompanies', {
            controller: ManageCompaniesController,
            controllerAs: 'ctrl',
            templateUrl: 'components/manage.capsule.companies/manage.capsule.companies.component.html',
            bindings: {
                companies: '<'
            }
        });

    ManageCompaniesController.$inject = ['$mdDialog'];

    function ManageCompaniesController($mdDialog) {
        var self = this;

        self.$onInit = function() {
            self.companies = self.companies.data;
        };

        self.openDialog = function(event, company) {
            $mdDialog.show({
                templateUrl: 'pages/templates/addCompany.html',
                targetEvent: event,
                clickOutsideToClose: true,
                escapeToClose: true,
                locals: {
                    company: company,
                    companies: self.companies,
                },
                controllerAs: 'ctrl',
                controller: function(Factory, company, companies) {
                    var self = this;
                    var isEdit = false;
                    self.companies = companies;
                    self.capsuleImage = {};

                    self.title = 'Add Company';
                    
                    self.save = function() {
                        var isFound = self.companies.find(function(obj) {
                            return obj.name ===self.company.name;
                        });

                        if (isFound) {
                            self.isAlreadyExists = true;
                        } else {
                            Factory.addCompany(self.company).then(function(result) {
                                $mdDialog.hide();
                                self.companies.push(result.data);
                            }).catch(function(err) {
                                console.log('failed to add the company', err);
                            });
                        }
                    }

                    self.refreshValidation = function() {
                        self.isAlreadyExists = false;
                    }

                    self.close = function() {
                        $mdDialog.hide();
                    }
                }
            });
        }
    }
})();