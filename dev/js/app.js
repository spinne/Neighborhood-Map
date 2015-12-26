'use strict';

/*### Model ###*/

// Array with 5 basic locations and infos
var myNeighborhood = [
	{
		name: 'Kriminalmuseum, Rothenburg ob der Tauber',
		description: 'If medival torture is for you, this is the place to visit.',
		category: 'Museum, Indoor',
		location: '(49.3755982, 10.179146899999978)'
	},
	{
		name: 'Molkerei, Rothenburg ob der Tauber',
		description: 'A nice bar and restaurant with occational live music.',
		category: 'Restaurant, Bar, Food, Music, Indoor',
		location: '(49.3808427, 10.188578300000017)'
	},
	{
		name: 'Reiterlesmarkt, Rothenburg ob der Tauber',
		description: 'Food, drink and Christmas: The famous Christmas market held every december.',
		category: 'Event, Food, Outdoor',
		location: '(49.3768724, 10.17927510000004)'
	},
	{
		name: 'Lotus-Garten, Rothenburg ob der Tauber',
		description: 'A tranquil south-east asian garden with café in the middle of Europe.',
		category: 'Restaurant, Food, Outdoor',
		location: '(49.3677609, 10.200424399999974)'
	},
	{
		name:'Rödertor, Rothenburg ob der Tauber',
		description: 'One of the gates through the intact medival city wall.',
		category: 'Outdoor, Landmark',
		location: '(49.37656759999999, 10.184596300000067)'
	}
];

// Managing all data and storing it in local storage
var manageData = function() {
	var self = this;
	
	self.addMarker = function(map, placeData) {
	}
}

// Class for map markers
var Marker = function(map, name, address, location) {
	var marker;
	
	this.name = ko.observable(name);
	this.position  = ko.observable(location);
	//this.address = ko.observable(address);
	
	marker = new google.maps.Marker({
			map: map,
			position: location,
			title: name,
			//address: address
	});
	
	console.log('n: ' + name + 'l: ' + location);
	//marker.setVisible(false);
/*
  this.isVisible = ko.observable(false);

  this.isVisible.subscribe(function(currentState) {
    if (currentState) {
      marker.setMap(map);
    } else {
      marker.setMap(null);
    }
  });

  this.isVisible(true);
  */
}

/*### ViewModels ###*/	

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
	
	// Find the locations on the map
	self.createMarker = function(placeData) {
		var lat = placeData.geometry.location.lat();
		var lon = placeData.geometry.location.lng();
		var address = placeData.formatted_address;
		var name = placeData.name;
		var location = placeData.geometry.location;
		var bounds = window.mapBounds;
		
		/* Create a marker and set its position.
		var marker = new google.maps.Marker({
			map: map,
			position: placeData.geometry.location,
			title: name,
			address: address
		});*/
		
		//var marker = new Marker(map, name, address, location);
		
		// Fit the map to the markers
		bounds.extend(new google.maps.LatLng(lat, lon));
		map.fitBounds(bounds);
		map.setCenter(bounds.getCenter());
	}
	
	// Find the location in myNeighborhood with Google places
	self.findLocation = function() {
		var service = new google.maps.places.PlacesService(map);

		for (var place in myNeighborhood) {
			var request = {
					query: myNeighborhood[place].name
				};
			
			service.textSearch(request, callback);
		}
	}
	
	// Callback for Google Places
	self.callback = function(results, status) {
		if (status == google.maps.places.PlacesServiceStatus.OK) {
			createMarker(results[0]);
		}
	}
	
	window.mapBounds = new google.maps.LatLngBounds();
	findLocation();
}

// Listen for resize and adjust map
$(window).resize(function() {
	resizeMap();
});

//Search and List
var viewModel = function() {
	var self = this;
	
	self.locationList = ko.observableArray([]);
	self.query = ko.observable('');

	
	myNeighborhood.forEach(function(place){
		self.locationList.push(place);
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
