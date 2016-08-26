'use strict';
var hapi = require('hapi' ),
    wreck = require('wreck'),
    zipcodes = require('zipcodes'),
    googleAPIKey = "AIzaSyAjNfDZOq3Jr_pnXea0AcNHbbigUdAFupk",
	server = new hapi.Server();

server.connection({ port: 8081 });

server.route({
	method: 'GET',
	path: '/{anything*}',
	config: {
		handler: {
			directory: {
				path: './lib',
				index: true
			}
		}
	}
});

server.route({
    method: 'GET',
    path: '/places/{zip}',
    handler: function(req, reply) {
        var googleAPIUrl = "/maps/api/place/nearbysearch/json?location=",
            zipDetails = zipcodes.lookup(req.params.zip);

        googleAPIUrl += zipDetails.latitude+","+zipDetails.longitude+"&radius=500&key="+googleAPIKey;

        var options = {
          host: 'maps.googleapis.com',
          path: googleAPIUrl
        };

        console.log('https://maps.googleapis.com' + googleAPIUrl);

        wreck.get('https://maps.googleapis.com' + googleAPIUrl, function(err, response, payload){


            console.log(JSON.parse(payload));
            payload = JSON.parse(payload).results;

            reply({
                lat: zipDetails.latitude,
                lng: zipDetails.longitude,
                results: payload
            });
        });
    }
});

server.route({
    method: 'GET',
    path: '/locationDetail/{locationId}',
    handler: function(req, reply) {
        var googleAPIUrl = "/maps/api/place/details/json?placeid=";
    	googleAPIUrl+=req.params.locationId+"&key="+googleAPIKey;

        wreck.get('https://maps.googleapis.com' + googleAPIUrl, function(err, response, payload){
            reply(JSON.parse(payload).result);
        });

    }
});

server.route({
    method: 'GET',
    path: '/current-location/{lat}/{lng}',
    handler: function(req, reply) {
        var googleAPIUrl = '/maps/api/geocode/json?latlng=';

    	googleAPIUrl += req.params.lat + ',' + req.params.lng + '&key='+googleAPIKey;

        wreck.get('https://maps.googleapis.com' + googleAPIUrl, function(err, response, payload){
            reply(JSON.parse(payload).results[0].address_components[6].long_name);
        });

    }
});

server.start(function(){
	console.log("Server is running: " + server.info.uri);
});
