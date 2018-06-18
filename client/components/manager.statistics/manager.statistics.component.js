(function() {
    'use strict';

    angular
        .module('managerModule')
        .component('managerStatistics', {
            controller: managerStatisticsController,
            controllerAs: 'ctrl',
            templateUrl: 'components/manager.statistics/manager.statistics.component.html',
            bindings: {
                capsules: '<'
            }
        });

        managerStatisticsController.$inject = ['Factory'];

    function managerStatisticsController(Factory) {
        var self = this;
		self.options = {
                chart: {
                    type: 'pieChart',
                    height: 500,
                    x: function(d){return d._id;},
                    y: function(d){return d.capsules.length;},
                    showLabels: true,
                    duration: 500,
                    labelThreshold: 0.01,
                    labelSunbeamLayout: true,
                    legend: {
                        margin: {
                            top: 5,
                            right: 35,
                            bottom: 5,
                            left: 0
                        }
                    }
                }
        };
        self.barOptions = {
            chart: {
                type: 'discreteBarChart',
                height: 450,
                margin : {
                    top: 20,
                    right: 20,
                    bottom: 50,
                    left: 55
                },
                x: function(d){return d.value;},
                y: function(d){
                    return d.value.length;
                },
                showValues: true,
                valueFormat: function(d){
                    return d3.format(',.0f')(d);
                },
                duration: 500,
                xAxis: {
                    axisLabel: 'strengths'
                },
                yAxis: {
                    axisLabel: 'NO# of products',
                    axisLabelDistance: -10
                }
            }
    };
		self.$onInit = function() {
            self.capsules = self.capsules.data;
            self.capsulesByStrength = initData(self.capsules);
            self.capsulesByStrength = [
                {
                    key: "Cumulative Return",
                    values: self.capsulesByStrength
                }
            ]
		}

		function initData(data) {
			if (!data) {
				return data;
			}
			var results = [];
			for (var i = 0; i < data.length; i++) {
				results = results.concat(data[i].capsules);
            }

            let strengths = Factory.getAllStrengths();
            for (var i = 0; i < strengths.length; i++) {
                strengths[i].value = [];
            }

            for (var i = 0; i < results.length; i++) {
				strengths[results[i].strength].value.push(results[i]);
            }

			return strengths;
        }
    }
})();