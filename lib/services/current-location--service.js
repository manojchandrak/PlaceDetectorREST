'use strict';

angular.module('LocationFinder')
	.factory('currentLocationService', currentLocationService);

currentLocationService.$inject = ['$http'];
function currentLocationService($http){
    var currentLocationService = {};

    currentLocationService.currentLocation = currentLocation;

    return currentLocationService;

    function currentLocation(lattitude, longitute) {
        return $http.get("/current-location/" + lattitude + "/" + longitute)
            .then(function(data){
                return data.data;
            });
    };
};
