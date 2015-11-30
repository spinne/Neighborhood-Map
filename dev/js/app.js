var myNeighborhood = [
	{
		name: 'Kriminalmuseum, Rothenburg ob der Tauber',
		type: 'Museum'
	},
	{
		name: 'Molkerei, Rothenburg',
		type: 'Restaurant, Bar, Food, Music'
	},
	{
		name: 'Reiterlesmarkt, Rothenburg',
		type: 'Event, Food, Outdoor'
	},
	{
		name: 'Lotusgarten, Rothenburg',
		type: 'Restaurant, Food, Outdoor'
	},
	{
		name:'Rödertor, Rothenburg',
		type: 'Outdoor, Landmark'
	}
];

function scaleMap() {
	var headerHeight = $('header').height();
	var documentHeight = $(document).height();
	var mapHeight = documentHeight - headerHeight;
	
	$('#map').height(mapHeight);
}

function initMap() {
	scaleMap();
	// Create a map object and specify the DOM element for display.
	var map = new google.maps.Map(document.getElementById('map'));
	
	// Find the location in myNeighborhood
	function createMarker(placeData) {
		var lat = placeData.geometry.location.lat();
		var lon = placeData.geometry.location.lng();
		var name = placeData.formatted_address;
		var bounds = window.mapBounds;
		
		// Create a marker and set its position.
		var marker = new google.maps.Marker({
			map: map,
			position: placeData.geometry.location,
			title: name
		});
		
		bounds.extend(new google.maps.LatLng(lat, lon));
		map.fitBounds(bounds);
		map.setCenter(bounds.getCenter());
	}
	
	function findLocation() {
		var service = new google.maps.places.PlacesService(map);
		
		for (var place in myNeighborhood) {
			var request = {
					query: myNeighborhood[place].name
				};
			
			service.textSearch(request, callback);
		}
	}
	
	function callback(results, status) {
		if (status == google.maps.places.PlacesServiceStatus.OK) {
			createMarker(results[0]);
			}
	}
	
	window.mapBounds = new google.maps.LatLngBounds();
	findLocation();
}

var ViewModel = function() {
	var self = this;
	
	self.locationList = ko.observableArray([]);
	self.query = ko.observable('');
	self.searchBy = ko.observable('name');
	
	myNeighborhood.forEach(function(place){
		self.locationList.push(place);
	});
	
	self.search = function() {
		// remove all the locations
		self.locationList.removeAll();

		// push only the matching locations back into the array
		myNeighborhood.forEach(function(x){
			// search by name
			if(self.searchBy() == 'name'){
				if(x.name.toLowerCase().indexOf(self.query().toLowerCase()) >= 0) {
					self.locationList.push(x);
				}
			} 
			// or by type of location
			else if (self.searchBy() == 'type') {
				if(x.type.toLowerCase().indexOf(self.query().toLowerCase()) >= 0) {
					self.locationList.push(x);
				}
			}
			scaleMap();
		});
	}
}

ko.applyBindings(new ViewModel());
