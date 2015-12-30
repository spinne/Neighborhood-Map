'use strict';

/*### Model ###*/

var manageData = {
	// Array with 5 basic locations and infos
	myNeighborhood: [
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
			name: 'Lotos-Garten',
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
	],
	
	//Array to collect completed locations
	locationsArray: [] ,
	
	//Variable to catch google maps fail
	googleMap: false,
	
	// Create and collect all data except google map and markers - called from viewModel
	// --> Foursquare / getData !!!!
	init: function() {
		this.myNeighborhood.forEach(function(location) {
			var newLocation = new Location(location);
			manageData.locationsArray.push(newLocation);
			//manageData.getFoursquare(newLocation);
			manageData.getData(newLocation.name(), newLocation);
		});
		return this.locationsArray;
	},
	
	// Populate InfoWindow / Fallback
	updateInfoWindow: function (location) {
		var contentString;
		var warn = '';
		var conditional = '';
		
		// Check if foursquare api worked or if data could be retrieved from localStorage
		if (location.foursqFail === true && location.foursqID() == '') {
			warn = '<p class="warning">Sorry! Failed to load Foursquare. Try refresh.</p>';
		} else if (location.foursqFail === true) {
			warn = '<p class="hint">Hey! Had to use saved Foursquare data, might be outdated.</p>';
		} 
		
		//Check foursquare results
		if (location.stats() != '') {
			conditional = conditional +
				'<div class="info-fsq"><h2 class="info-head">'+
				'<a class="info-link" target="_blank" href="https://foursquare.com/v/' + location.foursqID() + '">Foursquare</a>'+
				'</h2><ul class="info-stats">'+
				'<li> Checkins: ' + location.stats().checkinsCount + '</li>' +
				'<li> Users: ' + location.stats().usersCount + '</li>' +
				'<li> Tips: ' + location.stats().tipCount + '</li>' +
				'</ul></div>';
		}
		
		if (location.address().hasOwnProperty('address')) {
			conditional = conditional +
				'<div class="info-contact"><h2 class="info-head">Address:</h2>' + location.address().address + ' <br> Rothenburg / Tauber' +
				'</div>';
		}
		
		if (location.url() != '') {
			conditional = conditional +
			'<div class="info-url"><a class="info-link" target="_blank" href="' + location.url() + '"> Visit the ' + location.name() + ' Website</a></div>';
		}
		
		// Assemble contentString
		contentString = warn +
			'<div class="info-description">' + location.description() + '</div>' +
			conditional +
			'<div class="info-div"> Coordinates: ' + location.lat() + 
			' | ' + location.lng() + '<br>' +
			'Category: ' + location.category() + '</div>';
		
		//If google maps works add headline and setContent - else return string without headline
		if (manageData.googleMap === false) {
			var contentStr = '<h2 class="info-head">' + location.name() + '</h2>' + contentString;
			location.marker().infowin.setContent(contentStr);
		} else {
			return contentString;
		}
	},
	
	// Save the foursquare api results in localStorage
	saveData: function(forSave){
		var currentTime = new Date();
		var currentTime = currentTime.getTime();
		
		var oldTime = JSON.parse(localStorage.getItem('time'));
		
		var currentStatus = currentTime - oldTime;
		
		//Stringify the data.name for localStorage
		var name = JSON.stringify(forSave.name);
		
		// Store data in localStorage if it hasn't been stored before. 
		// Or if more than a day has passed, update the data.
		if (!localStorage.getItem(name)) {
			localStorage.setItem('time', JSON.stringify(currentTime));
			localStorage.setItem(name, JSON.stringify(forSave));
		} else if (currentStatus > 86400000) {
			localStorage.removeItem('time');
			localStorage.removeItem(name);
			localStorage.setItem('time', JSON.stringify(currentTime));
			localStorage.setItem(name, JSON.stringify(forSave));
		}
	},
	
	// If foursquare api can't be reached retrieve save data from localStorage
	getData: function(dataName, locData){
		var name = JSON.stringify(dataName);
		var retrieved = JSON.parse(localStorage.getItem(name));
		
		if(retrieved != null) {
			if (retrieved.hasOwnProperty('id')){
				locData.foursqID(retrieved.id);
			}
			
			if (retrieved.hasOwnProperty('url')){
				locData.url(retrieved.url);
			}
			
			if (retrieved.hasOwnProperty('stats')){
				locData.stats(retrieved.stats);
			}
			
			if (retrieved.hasOwnProperty('address')){
				locData.address(retrieved.address);
			}
		}
		
		// Check if foursquare took longer than google maps
		if(!$.isEmptyObject(locData.marker())) {
			manageData.updateInfoWindow(locData);
		}
	},
	
	// Call foursquare api for infos on location
	getFoursquare: function (locData){
		var fsqQuery = 'https://api.foursquare.com/v2/venues/search' +
			'?client_id=' + 'OYNXUBHDOXCBUDHXT5D1O14S3K2T1YHRCPA0VF3ZMUUF0DLE' +
			'&client_secret=' + 'A5TEMADYGHZE0A0H2X3WEF0G0VKPPHYIRDUAXS3CZBDA2WON' +
			'&v=20130815' +
			'&intent=match' +
			'&ll=' + locData.lat() + ',' + locData.lng() +
			'&query=' + locData.name();
		
		$.getJSON(fsqQuery, function(data) {
			var results = data.response.venues;
			
			var forSave = {};
			forSave.name = locData.name();
			
			if (results[0].hasOwnProperty('id')){
				locData.foursqID(results[0].id);
				forSave.id = results[0].id;
			}
			
			if (results[0].hasOwnProperty('url')){
				locData.url(results[0].url);
				forSave.url = results[0].url;
			}
			
			if (results[0].hasOwnProperty('stats')){
				locData.stats(results[0].stats);
				forSave.stats = results[0].stats;
			}
			
			if (results[0].hasOwnProperty('location')){
				locData.address(results[0].location);
				forSave.address = results[0].location;
			}

			manageData.saveData(forSave);
			
			// Check if foursquare took longer than google maps
			if(!$.isEmptyObject(locData.marker())) {
				manageData.updateInfoWindow(locData);
			}
			
		}).fail(function() {
			locData.foursqFail = true;
			manageData.getData(locData.name(), locData);
		});
	},
	
	//Creat the map markers - called from initMap
	createMarker: function() {
		this.locationsArray.forEach(function(location) {
			var marker = new Marker(map, location);
			location.marker(marker);
			manageData.updateInfoWindow(location);
		});
	},
	
	// If googleMaps fails use InfoWindow content as fallback
	googleFail: function() {
		this.locationsArray.forEach(function(location) {
			var data = manageData.updateInfoWindow(location);
			location.googleFail(data);
		});
	}
};

// Class for locations
// foursquare --> true !!!!!
var Location = function(location) {
	this.name = ko.observable(location.name);
	this.description = ko.observable(location.description);
	this.category = ko.observable(location.category);
	this.lat = ko.observable(location.lat);
	this.lng = ko.observable(location.lng);
	this.marker = ko.observable('');
	this.foursqID = ko.observable('');
	this.url = ko.observable('');
	this.stats = ko.observable('');
	this.address = ko.observable('');
	this.googleFail = ko.observable('');
	this.foursqFail = true;
};


// Class for map markers
var Marker = function(map, currentData) {
	var marker;
	var name = currentData.name();
	var dataLat = currentData.lat();
	var dataLng = currentData.lng();
	
	var location = new google.maps.LatLng(dataLat,dataLng);
	
	// Create the marker for the current data set
	marker = new google.maps.Marker({
			map: map,
			position: location,
			title: name,
	});
	
	// Create empty InfoWindow as part of marker object
	marker.infowin = new google.maps.InfoWindow({
		maxWidth: 300
	});
	
	//marker.infowin.content = ko.observable();
	
	//Gets called if marker or list entry is clicked
	marker.handleClick = function() {
		marker.infowin.open(map, marker);
		marker.setAnimation(google.maps.Animation.BOUNCE);
		setTimeout(function () {
			marker.setAnimation(null);
			}, 1400);
	};
	
	// Event handler for click on marker in map
	marker.addListener('click', function() {
		marker.handleClick();
	});
	
	return marker;
};

// Google Maps

var map;

var initMap = function() {
	var self = this;
	
	// Fill the map object and select the map div for display.
	map = new google.maps.Map(document.getElementById('map'));
	
	// Make the map fit the height of the screen with 1% margin
	self.scaleMap = function() {
		//Calculate and set the height of the map element, dependend on window width
		var mapHeight = ($(window).width() < 751) ? ($(window).height() - $('header').outerHeight(true))*0.98 : $(window).height()*0.98;
		$('#map').height(mapHeight);
	};
	
	// Adjust map on resize
	self.resizeMap = function(){
		self.scaleMap();
		map.fitBounds(window.mapBounds);
	};
	
	// Center map around locations in myNeighborhood
	self.findLocation = function() {
		var bounds = window.mapBounds;
		manageData.myNeighborhood.forEach(function(place){
			bounds.extend(new google.maps.LatLng(place.lat, place.lng));
			map.fitBounds(bounds);
			map.setCenter(bounds.getCenter());
		});
	};
	
	self.scaleMap();
	window.mapBounds = new google.maps.LatLngBounds();
	self.findLocation();
	manageData.createMarker();
};

// Listen for resize and adjust map
$(window).resize(function() {
	if(!manageData.googleMap) {
		resizeMap();
	}
});

//
var mapError = function(){
	vm.offlineFallback(true);
	vm.toggleMenu(true);
	vm.googleWorks(false);
	manageData.googleMap = true;
	manageData.googleFail();
};


//Search and List
var viewModel = function() {
	var self = this;
	
	// Define observables
	self.locationList = ko.observableArray([]);
	self.completeList = ko.observableArray([]);
	self.query = ko.observable('');
	self.offlineFallback = ko.observable(false);
	self.adminMode = ko.observable(false);
	self.toggleMenu = ko.observable(false);
	self.googleWorks = ko.observable(true);
	
	// Save the locations in Array - no need to call model everytime for search.
	self.completeList(manageData.init());
	
	// Populate the locationsList
	self.completeList().forEach(function(place){
		self.locationList.push(place);
	});
	
	// Toggle mobile menubar
	self.showMenu = function () {
		self.toggleMenu(!self.toggleMenu());
	}
	
	// Open InfoWindow and bounce markers when a list item is clicked
	self.markerMove = function(listItem) {
		if (!self.offlineFallback()){
			var length = self.locationList().length;
			
			for (var i = 0; i < length; i++){
				if(self.locationList()[i].name === listItem.name) {
					self.locationList()[i].marker().handleClick();
				} else {
					self.locationList()[i].marker().infowin.close();
				}
			}
		}
	};

	
	// Eventhandler for clicking 'x' to clear on search input
	$('#search').on('search', function() {
		self.search();
	});
	
	// LocalStorage functions - reached by typing 'admin' in search.
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
		
		// Admin mode
		if (searchTerm == 'admin') {
			self.adminMode(true);
		} else {
			self.adminMode(false);
		}

		// then push only the matching locations back into the array
		self.completeList().forEach(function(item){
			// search by name or by category 
			if(item.name().toLowerCase().indexOf(searchTerm) >= 0 || item.category().toLowerCase().indexOf(searchTerm) >= 0) {
				self.locationList.push(item);
				if (!self.offlineFallback()){
					item.marker().setVisible(true);
				}
			} else {
				if (!self.offlineFallback()){
					item.marker().infowin.close();
					item.marker().setVisible(false);
				}
			}
		});
	};
};


//  viewModel stored in global variable for referencing
var vm = new viewModel();
ko.applyBindings(vm);

/*Delay Knockout bindings
$(window).ready(function () {
	ko.applyBindings(new viewModel());
});*/
