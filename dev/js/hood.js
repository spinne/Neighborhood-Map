'use strict';

/*### Model ###*/

// Array with 5 basic locations and infos
var myNeighborhood = [
	{
		name: 'Kriminalmuseum, Rothenburg ob der Tauber',
		description: 'If medival torture is for you, this is the place to visit.',
		category: 'Museum, Indoor',
		lat: '49.3755982',
		lng: '10.179146899999978'
	},
	{
		name: 'Molkerei, Rothenburg ob der Tauber',
		description: 'A nice bar and restaurant with occational live music.',
		category: 'Restaurant, Bar, Food, Music, Indoor',
		lat: '49.3808427', 
		lng: '10.188578300000017'
	},
	{
		name: 'Reiterlesmarkt, Rothenburg ob der Tauber',
		description: 'Food, drink and Christmas: The famous Christmas market held every december.',
		category: 'Event, Food, Outdoor',
		lat: '49.3768724',
		lng: '10.17927510000004'
	},
	{
		name: 'Lotus-Garten, Rothenburg ob der Tauber',
		description: 'A tranquil south-east asian garden with café in the middle of Europe.',
		category: 'Restaurant, Food, Outdoor',
		lat: '49.3677609',
		lng: '10.200424399999974'
	},
	{
		name:'Burggarten, Rothenburg ob der Tauber',
		description: 'The place where the castle used to be is now the city park with beautiful views of the old city.',
		category: 'Park, Outdoor, Landmark',
		lat: '49.3762149', 
		lng: '10.1740536'
	}
];


var manageData = {
	init: function () {
		var self = this;
		var data = myNeighborhood[4];
		self.getFoursquare(data);
	},
	
	getFoursquare: function (locData){
		var shortName = locData.name.split(',');
		var fsqQuery = 'https://api.foursquare.com/v2/venues/search' +
			'?client_id=' + 'OYNXUBHDOXCBUDHXT5D1O14S3K2T1YHRCPA0VF3ZMUUF0DLE' +
			'&client_secret=' + 'A5TEMADYGHZE0A0H2X3WEF0G0VKPPHYIRDUAXS3CZBDA2WON' +
			'&v=20130815' +
			'&intent=match' +
			'&ll=' + locData.lat + ',' + locData.lng +
			'&query=' + shortName[0];
		
		console.log(fsqQuery);
		
		$.getJSON(fsqQuery, function(data) {
			var results = data.response.venues;
			console.log(results);

		// $.each( articles, function( key, val ) {
			// }
		// });
		}).fail(function() {
		});
	},
	
	getStreetView: function (locData) {
		var url = 'https://maps.googleapis.com/maps/api/streetview?' + 
		'size=300x300&location=' + locData.lat + ',' + locData.lng + 
		'&heading=151.78&pitch=-0.76';
	}
};

/*
var manageData = function() {
	this.testing = myNeighborhood[0];

	this.getFoursquare = function(locData) {
		var fsqQuery = 'https://api.foursquare.com/v2/venues/search' +
			'?client_id=' + 'OYNXUBHDOXCBUDHXT5D1O14S3K2T1YHRCPA0VF3ZMUUF0DLE' +
			'&client_secret=' + 'A5TEMADYGHZE0A0H2X3WEF0G0VKPPHYIRDUAXS3CZBDA2WON' +
			'&ll=' + locData.lat + ',' + locData.lng +
			'&query=' + locData.name;
		
		console.log(fsqQuery);
	
		$.getJSON( nytQuery, function( data ) {	

		$.each( articles, function( key, val ) {
			}
		});
		}).error(function() {
		});
	}

	this.getWiki = function() {
		console.log(myNeighborhood[1]);
	}
	//getFoursquare(myNeighborhood[0]);
	
	console.log(myNeighborhood[1]);
	
}
*/

/*### ViewModels ###*/

// Class for map markers
var Marker = function(map, name, lat, lng) {
	var marker;
	
	var location = '(' + lat + ',' + lng +')';
	
	this.name = ko.observable(name);
	this.position  = ko.observable(location);
	
	marker = new google.maps.Marker({
			map: map,
			position: location,
			title: name
	});
}

var initMap = function() {
	var self = this;
	
	// Fill the map object and select the map div for display.
	var map = new google.maps.Map(document.getElementById('map'));
	
	// Make the map fit the height of the screen
	self.scaleMap = function() {
		//Calculate and set the height of the map element
		var mapHeight = ($(window).height() - $('header').outerHeight(true))*0.98;
		$('#map').height(mapHeight);
	}
	scaleMap();
	
	// Adjust map on resize
	self.resizeMap = function(){
		scaleMap();
		map.fitBounds(mapBounds);
	}
	
	// Center map around locations in myNeighborhood
	self.findLocation = function() {
		var bounds = window.mapBounds;
		myNeighborhood.forEach(function(place){
			bounds.extend(new google.maps.LatLng(place.lat, place.lng));
			map.fitBounds(bounds);
			map.setCenter(bounds.getCenter());
		});
	}
	
	window.mapBounds = new google.maps.LatLngBounds();
	findLocation();
	manageData.init();
}

// Listen for resize and adjust map
$(window).resize(function() {
	resizeMap();
});

/*
//Search and List
var viewModel = function() {
	var self = this;
	
	self.locationList = ko.observableArray([]);
	self.markerList = ko.observableArray([]);
	self.query = ko.observable('');

	myNeighborhood.forEach(function(place){
		self.locationList.push(place);
		var marker = new Marker(map, place.name, place.lat, place.lng);
		self.markerList.push(marker);
	});
	
	// Search Function
	self.search = function() {
		// remove all the locations
		self.locationList.removeAll();
		
		// Trim spaces from the search and turn to lower case
		var searchTerm = self.query().trim().toLowerCase();

		// then push only the matching locations back into the array
		myNeighborhood.forEach(function(x){
			// search by name or by category 
			if(x.name.toLowerCase().indexOf(searchTerm) >= 0 || x.category.toLowerCase().indexOf(searchTerm) >= 0) {
				self.locationList.push(x);
			}
		});
	}
}

ko.applyBindings(new viewModel());
*/
