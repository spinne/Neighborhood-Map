'use strict';

/*### Model ###*/

// Array with 5 basic locations and infos
var manageData = {
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
	
	init: function() {
		
	},
	
	updateInfoWindow: function (marker) {
		console.log(marker.infowin.content);
		this.getFoursquare(marker);
	},
	
	saveData: function(data){
		var currentTime = new Date();
		var currentTime = currentTime.getTime();
		
		var oldTime = JSON.parse(localStorage.getItem('time'));
		
		var currentStatus = currentTime - oldTime;
		
		//Stringify the data.name for localStorage
		var name = JSON.stringify(data.name);
		
		// Store data in localStorage if it hasn't been stored before. 
		// Or if more than a day has passed, update the data.
		if (!localStorage.getItem(name)) {
			localStorage.setItem('time', JSON.stringify(currentTime));
			localStorage.setItem(name, JSON.stringify(data));
		} else if (currentStatus > 86400000) {
			localStorage.removeItem('time');
			localStorage.removeItem(name);
			localStorage.setItem('time', JSON.stringify(currentTime));
			localStorage.setItem(.name, JSON.stringify(data));
		}
	},
	
	getData: function(){
		
	},
	
	getFoursquare: function (locData){
		var fsqQuery = 'https://api.foursquare.com/v2/venues/search' +
			'?client_id=' + 'OYNXUBHDOXCBUDHXT5D1O14S3K2T1YHRCPA0VF3ZMUUF0DLE' +
			'&client_secret=' + 'A5TEMADYGHZE0A0H2X3WEF0G0VKPPHYIRDUAXS3CZBDA2WON' +
			'&v=20130815' +
			'&intent=match' +
			'&ll=' + locData.lat + ',' + locData.lng +
			'&query=' + locData.title;
		
		$.getJSON(fsqQuery, function(data) {
			var results = data.response.venues;
			
			manageData.saveData(results[0]);
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
	
	createMarker: function() {
		var mapMarker =[];
		
		this.myNeighborhood.forEach(function(location) {
			var marker = new Marker(map, location);
			mapMarker.push(marker);
		});
		
		//push the created markes into observableArray
		vm.markerList(mapMarker);
	}
};


// Class for map markers
var Marker = function(map, currentData) {
	var marker;
	var name = currentData.name;
	var dataLat = currentData.lat;
	var dataLng = currentData.lng;
	
	var location = new google.maps.LatLng(dataLat,dataLng);
	
	// Create the marker for the current data set
	marker = new google.maps.Marker({
			map: map,
			position: location,
			title: name,
			lat: dataLat,
			lng: dataLng
	});
	
	// Create empty InfoWindow as part of marker object
	marker.infowin = new google.maps.InfoWindow({
	});
	
	//marker.infowin.content = ko.observable();
	
	//Gets called if marker or list entry is clicked
	marker.handleClick = function() {
		marker.infowin.open(map, marker);
		marker.setAnimation(google.maps.Animation.BOUNCE);
		setTimeout(function () {
			marker.setAnimation(null);
			}, 1400);
			
		marker.infowin.setContent('hey');
		manageData.updateInfoWindow(marker);
	};
	
	// Event handler for click on marker in map
	marker.addListener('click', function() {
		marker.handleClick();
	});
	
	console.log(marker.lat);
	
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
		//Calculate and set the height of the map element
		var mapHeight = ($(window).height() - $('header').outerHeight(true))*0.98;
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
	resizeMap();
});

//
var mapError = function(){
	console.log('put, put');
};


//Search and List
var viewModel = function() {
	var self = this;
	
	// Define observables
	self.locationList = ko.observableArray([]);
	self.markerList = ko.observableArray([]);
	self.query = ko.observable('');
	self.offlineFallback = ko.observable(false);
	
	// Populate the locationsList
	manageData.myNeighborhood.forEach(function(place){
		self.locationList.push(place);
	});
	
	// Open InfoWindow and bounce markers when a list item is clicked
	self.markerMove = function(listItem) {
		var length = self.markerList().length;
		
		for (var i = 0; i < length; i++){
			if(self.markerList()[i].title === listItem.name) {
				self.markerList()[i].handleClick();
			} else {
				self.markerList()[i].infowin.close();
			}
		}
	};

	
	// Search Function
	self.search = function() {
		// remove all the locations
		self.locationList.removeAll();
		
		//Used for setting marker visiblity
		var nameObject = {};
		
		// Trim spaces from the search and turn to lower case
		var searchTerm = self.query().trim().toLowerCase();

		// then push only the matching locations back into the array
		manageData.myNeighborhood.forEach(function(item){
			// search by name or by category 
			if(item.name.toLowerCase().indexOf(searchTerm) >= 0 || item.category.toLowerCase().indexOf(searchTerm) >= 0) {
				self.locationList.push(item);
				nameObject[item.name] = '';
			}
		});
		
		//Set marker visibility - if marker.title is a key in nameObject
		self.markerList().forEach(function(marker) {
			if (marker.title in nameObject){
				marker.setVisible(true);
			} else {
				marker.setVisible(false);
				marker.infowin.close();
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