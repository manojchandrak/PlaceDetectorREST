angular.module("LocationFinder", ["ngRoute"])
	.config(config);

config.$inject = ['$routeProvider'];
function config($routeProvider) {
	$routeProvider
		.when("/", {
			template: "<landing-page />"
		});
};
