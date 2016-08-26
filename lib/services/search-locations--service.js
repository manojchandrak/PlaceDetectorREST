'use strict';

angular.module('LocationFinder')
	.factory('searchLocationsService', searchLocationsService);

searchLocationsService.$inject = ['$http'];
function searchLocationsService($http){
    var searchLocationsService = {};

    searchLocationsService.getLocations = getLocations;

    return searchLocationsService;

    function getLocations(zipCode) {
        return $http.get("/places/" + zipCode)
            .then(function(data){
                return data.data;
            });
    };
};
