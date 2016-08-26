'use strict';

angular.module('LocationFinder')
	.factory('locationDetailsService', locationDetailsService);

locationDetailsService.$inject = ['$http'];
function locationDetailsService($http){
    var locationDetailsService = {};

    locationDetailsService.getLocationDetails = getLocationDetails;

    return locationDetailsService;

    function getLocationDetails(locationId) {
        return $http.get("/locationDetail/" + locationId)
            .then(function(data){
                return data.data;
            });
    };
};
