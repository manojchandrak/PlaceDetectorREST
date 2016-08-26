'use strict';

angular.module('LocationFinder')
    .controller('landingPageController', landingPageController)
    .directive('landingPage', landingPage);


landingPageController.$inject = ['searchLocationsService', 'currentLocationService', 'locationDetailsService'];
function landingPageController(searchLocationsService, currentLocationService, locationDetailsService){
    var self = this;

    self.searchLocations = function(zipCode){
		return searchLocationsService.getLocations(zipCode)
            .then(function(places){
                self.zipcode = zipCode;
                self.locationsData = places.results;
                self.dropAllMarkers();
            });
	};

    self.getSelectedLocationDetails = function(locationId) {
        return locationDetailsService.getLocationDetails(locationId)
            .then(function(locationDetails) {
                var map = new google.maps.Map(document.getElementById('map'), {
                        zoom: 15,
                        center: new google.maps.LatLng(locationDetails.geometry.location.lat, locationDetails.geometry.location.lng),
                        mapTypeId: google.maps.MapTypeId.TERRAIN
                    }),
                    marker = new google.maps.Marker({
                        map: map,
                        animation: google.maps.Animation.DROP,
                        position: locationDetails.geometry.location
                    }),
                    infoWindow = new google.maps.InfoWindow();

                google.maps.event.addListener(marker, 'click', function() {
                    infoWindow.setContent(
                        '<div><strong>' + locationDetails.name + '</strong><br>' +
                        locationDetails.formatted_address+ '<br>' + locationDetails.international_phone_number  + '</div>'
                    );

                    infoWindow.open(map, this);
                });

                google.maps.event.addListener(marker, 'mouseover', function() {
                    infoWindow.setContent(
                        '<div><strong>' + locationDetails.name + '</strong><br>' +
                        locationDetails.formatted_address+ '<br>' + locationDetails.international_phone_number  + '</div>'
                    );

                    infoWindow.open(map, this);
                });

                google.maps.event.addListener(marker, 'mouseout', function() {
                    infoWindow.close(map, this);
                });
            });
    };

    self.dropAllMarkers = function() {
        var bounds = new google.maps.LatLngBounds(),
            mapOptions = {
                mapTypeId: google.maps.MapTypeId.TERRAIN
            },
            map = new google.maps.Map(document.getElementById("map"), mapOptions),
            markers = [];

            console.log(self.markersData);

        angular.forEach(self.locationsData, function(value) {
            markers.push([value.place_id, value.geometry.location.lat, value.geometry.location.lng]);
        });
        var infoWindow = new google.maps.InfoWindow(), marker, i;

        angular.forEach(markers, function(marker){
            locationDetailsService.getLocationDetails(marker[0])
                .then(function(locationDetails) {
                    var position = new google.maps.LatLng(marker[1], marker[2]);
                    bounds.extend(position);
                    marker = new google.maps.Marker({
                       position: position,
                       map: map
                    });

                    google.maps.event.addListener(marker, 'click', function() {
                        infoWindow.setContent(
                            '<div><strong>' + locationDetails.name + '</strong><br>' +
                            locationDetails.formatted_address+ '<br>' + locationDetails.international_phone_number  + '</div>'
                        );

                        infoWindow.open(map, this);
                    });

                    google.maps.event.addListener(marker, 'mouseover', function() {
                        infoWindow.setContent(
                            '<div><strong>' + locationDetails.name + '</strong><br>' +
                            locationDetails.formatted_address+ '<br>' + locationDetails.international_phone_number  + '</div>'
                        );

                        infoWindow.open(map, this);
                    });

                    google.maps.event.addListener(marker, 'mouseout', function() {
                        infoWindow.close(map, this);
                    });

                    map.fitBounds(bounds);
                });
        });
    };

    window.navigator.geolocation.getCurrentPosition(function(pos){
        self.lat = pos.coords.latitude;
        self.lng = pos.coords.longitude;

        currentLocationService.currentLocation(self.lat, self.lng)
            .then(function(zipcode) {
                self.zipcode = zipcode;
            })
            .then(function(){
                return searchLocationsService.getLocations(self.zipcode)
                    .then(function(places){
                        console.log(places);
                        return places.results;
                    });
            })
            .then(function(locations) {
                console.log(locations);
                self.locationsData = locations;
                self.markersData = locations;
                self.dropAllMarkers();
            });
    });
};

function landingPage() {
    return {
        restrict: 'E',
        controller: 'landingPageController',
        controllerAs: 'landPageCtrl',
        templateUrl: 'templates/locations.html'
    };
};
