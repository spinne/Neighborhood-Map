'use strict';

/*### Model ###*/

// Array with 5 basic locations and infos
var myNeighborhood = [
	{
		name: 'Kriminalmuseum',
		description: 'If medival torture is for you, this is the place to visit.',
		category: 'Museum, Indoor',
		lat: '49.3755982',
		lng: '10.179146899999978'
	},
	{
		name: 'Molkerei',
		description: 'A nice bar and restaurant with occational live music.',
		category: 'Restaurant, Bar, Food, Music, Indoor',
		lat: '49.3808427', 
		lng: '10.188578300000017'
	},
	{
		name: 'Reiterlesmarkt',
		description: 'Food, drink and Christmas: The famous Christmas market held every december.',
		category: 'Event, Food, Outdoor',
		lat: '49.3768724',
		lng: '10.17927510000004'
	},
	{
		name: 'Lotus-Garten',
		description: 'A tranquil south-east asian garden with café in the middle of Europe.',
		category: 'Restaurant, Food, Outdoor',
		lat: '49.3677609',
		lng: '10.200424399999974'
	},
	{
		name:'Burggarten',
		description: 'The place where the castle used to be is now the city park with beautiful views of the old city.',
		category: 'Park, Outdoor, Landmark',
		lat: '49.3762149', 
		lng: '10.1740536'
	}
];


var manageData = {
	init: function () {
		this.setCurrent();
	},
	
	setCurrent: function() {
		var current;
		for (var i = 0; i < 5; i++){
			current = myNeighborhood[i];
			//current.foursq = this.getFoursquare(current);
			current.mapMarker = this.getMarker(current);
			//current.image = this.getStreetView(current);
			var name = current.name;
			//this.saveData(current, name);
		}
	},
	
	saveData: function(currentData, nameItem, type) {
		/*if(!localStorage.getItem(nameItem)){
			localStorage.setItem(nameItem, JSON.stringify(currentData));
		} else {
			var item = JSON.parse(localStorage.getItem(nameItem));
			
			if (type == 'marker') {
				item.mapMarker = currentData;
				localStorage.setItem(nameItem, JSON.stringify(item));
			} else if (type == 'foursq') {
				item.foursq = currentData;
				localStorage.setItem(nameItem, JSON.stringify(item));
			} else if (type == 'street') {
				item.street = currentData;
				localStorage.setItem(nameItem, JSON.stringify(item));
			} else {
				console.log('Failed Storage');
			}
		}*/
	},
	
	getData: function(){
		localStorage.clear();
	},
	
	getFoursquare: function (locData){
		var fsqQuery = 'https://api.foursquare.com/v2/venues/searchz' +
			'?client_id=' + 'OYNXUBHDOXCBUDHXT5D1O14S3K2T1YHRCPA0VF3ZMUUF0DLE' +
			'&client_secret=' + 'A5TEMADYGHZE0A0H2X3WEF0G0VKPPHYIRDUAXS3CZBDA2WON' +
			'&v=20130815' +
			'&intent=match' +
			'&ll=' + locData.lat + ',' + locData.lng +
			'&query=' + locData.name;
		
		//console.log(fsqQuery);
		
		$.getJSON(fsqQuery, function(data) {
			var results = data.response.venues;
			//console.log(results);
			//return results;
		}).fail(function() {
			console.log('upps');
		});

	},
	
	getStreetView: function (locData) {
		var url = 'https://maps.googleapis.com/maps/api/streetview?' + 
		'size=300x300&location=' + locData.lat + ',' + locData.lng + 
		'&heading=151.78&pitch=-0.76';
		return url;
	},
	
	getMarker: function (locData) {
		var marker = new Marker (map, locData);
		return marker;
	}
	
};


/*### ViewModels ###*/
//
var map;

// Class for map markers
var Marker = function(map, currentData) {
	var marker;
	var name = currentData.name;
	var dataLat = currentData.lat;
	var dataLng = currentData.lng;
	
	var location = new google.maps.LatLng(dataLat,dataLng);
	
	this.name = ko.observable(name);
	this.position  = ko.observable(location);
	
	marker = new google.maps.Marker({
			map: map,
			position: location,
			title: name
			
	});
	
	var contentString = name + '<br>' +
		currentData.description;
	
	marker.infowin = new google.maps.InfoWindow({
		content: contentString
	});
	
	marker.handleClick = function() {
		marker.infowin.open(map, marker);
		marker.setAnimation(google.maps.Animation.BOUNCE);
		setTimeout(function () {
			marker.setAnimation(null);
			}, 1400);
	}
	
	marker.addListener('click', function() {
		marker.handleClick();
	});
}


// Google Maps
var initMap = function() {
	var self = this;
	
	// Fill the map object and select the map div for display.
	map = new google.maps.Map(document.getElementById('map'));
	
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


//Search and List
var viewModel = function() {
	var self = this;
	
	self.locationList = ko.observableArray([]);
	self.markerList = ko.observableArray([]);
	self.query = ko.observable('');

	myNeighborhood.forEach(function(place){
		self.locationList.push(place);
		//var marker = new Marker(map, place.name, place.lat, place.lng);
	});
	
	self.markerMove = function(name) {
		
	}
	
	self.clearStorage = function() {
		localStorage.clear();
	}
	
	self.showStorage = function() {
		var length = localStorage.length;
		
		for (var i = 0; i < length; i++) {
				console.log(localStorage.getItem(localStorage.key(i)));
		}
	}
	
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

//Delay Knockout bindings
$(window).ready(function () {
	ko.applyBindings(new viewModel());
});
