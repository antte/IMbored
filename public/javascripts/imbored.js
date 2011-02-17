/*
 * DEPENDENCIES: datetime.js (our own "lib")
 */
$(document).ready(function(){
	
	$("#find_activity").click(function(){
		get_events(get_geo_cordinates());
        $("#spinner").bind("ajaxSend", function() {
	        $(this).show();	
         }).bind("ajaxStop", function() {
	        $(this).hide();
         }).bind("ajaxError", function() {
	        $(this).hide();
         });
		    return false;
	});
}); 


function get_events(coordinates) {

    $.ajax({
        url: 'http://localhost:3000/events.json/?longitude=' + coordinates.longitude + '&latitude=' + coordinates.latitude,
        dataType: 'json',
        type: 'GET',
        processData: false,
        contentType: 'application/json',
        success: function(data) {
            var events = [];
            for(event in data) {
                events.push(data[event]);
            }
            var events_container = $("#events");
            render_events(events, events_container);
        }
    });
}

/*
 * 
 *
 */
function get_geo_cordinates(){
	var coord = {};
	if (navigator.geolocation) {
		navigator.geolocation.getCurrentPosition(
			function( position) {
				alert('Geolocation');
				console.log(position);
	       		coord.longitude = position.coords.longitud;
				coord.latitude = position.coords.latitude;
	    	}, function(error) { 
	        	alert(error.code);
	    	},{timeout:1000}
		);	
	} else {
		alert ('no-geolocation');
	}
	return coord; 
}


/*
 * Takes an object literal (and/or json??, not sure!) and converts it into a/many
 * dom element.
 */
function events_to_html(event) {
    
    if (event instanceof Array) {
        var events = new Array();
        for (e in event) {
            events.push(events_to_html(event[e]));
        }
        return events;
    }
    
    console.log(event);
  

    // We append alot of stuff to this wrapping event element
    var event_element =     $("<li>", {class: "vevent"});

    var h1_element =        $("<h1>", {class: "summary"}).text(event.title);
    var startdate_element = $("<time>", {
            class: "dtstart", 
            title: format_unixtime(event.event_time, "microformat"),
            datetime: format_unixtime(event.event_time, "html5")
    }).text(format_unixtime(event.event_time, "human"));
    
    var description_element = $("<p>", {class: "description"}).text(event.description);

    event_element.append(h1_element);
    event_element.append(startdate_element);
    event_element.append(description_element);

    return event_element;
    
}

/*
 * Jquery append items to the events_container.
 */
function render_events (events, events_container) {

    events = events_to_html(events);

    if (events instanceof Array) {
        for (i in events) {
            // We assume events_container is a jquery object
            events_container.append(events[i]);
        }
    } else {
        events_container.append(events);
    }
}


