$(document).ready(function() {
	if (navigator.geolocation) {
       (navigator.geolocation.getCurrentPosition(foundLocation, noLocation));

	    function foundLocation(position) {
	        var long = position.coords.longitude;
			var lat = position.coords.latitude;
	        alert('Found location: ' + long + ', ' + lat);
	
	    }    

	    function noLocation() {
	        alert('Could not find location');
	    }
	 } 
  
		$.ajax( {
			url: 'http://localhost:3000/events/?longitude=59.34747237416667&latitude=18.04923685',
			dataType: 'json',
			type: 'GET',
			processData: false,
			contentType: 'application/json'
			
		});
		
		
		     /* Converts an atomic (as in small bits) event datetime values into a human
		     * readable datetime. Such as "18th of April 2011 at 13:40pm".
		     * TODO: IMPLEMENT
		     */
		    function unixtime_to_human (unixtime) {
			    
			  var human = new Date;
			 
		    }
	
});
