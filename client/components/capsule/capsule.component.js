(function() {
    'use strict';

    angular
        .module('capsuleShop')
        .component('capsule', {
            templateUrl: 'components/capsule/capsule.component.html',
            controller: Controller,
            controllerAs: 'ctrl',
            bindings: {
                capsule: '<'
            }
        });

    Controller.$inject = ['ViewFactory','Factory'];

    function Controller(ViewFactory, Factory){
        var self = this;

        self.$onInit = function() {
            self.capsule = self.capsule.data;
            ViewFactory.newView(self.capsule.strength, self.capsule._id);
            self.strengths = Factory.getAllStrengths()
            self.capsule.strength = self.strengths[self.capsule.strength].value
            self.addToCart = true;
            self.imageUrl = self.capsule.image ? 'public/Images/' + self.capsule.image : 'public/Images/capsule.jpg';
        };        
    }
})()