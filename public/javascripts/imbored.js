/*
 * IMBored Javascript
 * DEPENDENCIES: 
 *  - datetime.js (our own "lib")
 *      specifically we use the format_unixtime function
 */

var events_getable = true;

/*
 * Tries to retrive the users position and runs either a success or a failure
 * callback.
 */
function get_position(success, error) {
	
    events_container.empty();
    if (navigator.geolocation) {
        var options = {timeout:5000, maximumAge: 600000};
        $.mobile.pageLoading();
        navigator.geolocation.getCurrentPosition(success, error, options);
    } else {
        error();
    }

}

function position_success(position) {

    // The only reason this exists is because firefox fires the success
    // callback twice sometimes.
    if (!window.events_getable) {
        return;
    }

    window.events_getable = false;

    var parameters = {};

    parameters.longitude = position.coords.longitude;
    parameters.latitude = position.coords.latitude;
    parameters.distance = parseInt(get_cookie("settings_distance"));

    get_events(parameters, render_events, make_error("Couldn't find any events."));

}

function position_error(error) {

    // TODO: Make a more useful error message to the user.
    alert("We couldn't find your position, sorry. Setting default Stockholm position");
   if (!window.events_getable) {
        return;
    }
    window.events_getable = false;
    var parameters = {};
    parameters.longitude = 59;
    parameters.latitude = 18;
    parameters.distance = parseInt(get_cookie("settings_distance"));

    get_events(parameters, render_events, make_error("Couldn't find any events."));

    
}

/*
 * Takes an object literal (and/or json??, not sure!) and converts it into a/many
 * dom element.
 */
function events_to_html(event,identifier) {

    if (event instanceof Array) {
        var events = new Array();
        for (e in event) {
            events.push(events_to_html(event[e],event[e].id));
        }
        return events;
    }

    // We append alot of stuff to this wrapping event element
    var event_element =     $("<li>").addClass("vevent");

    var h1_element =        $("<h1>").text(event.title);
    var startdate_element = $("<time>").attr({ 
            title: format_unixtime(event.event_time, "microformat"),
            datetime: format_unixtime(event.event_time, "html5")
    }).addClass("dtstart").text(format_unixtime(event.event_time, "human"));

    var venue_element = $("<p>").addClass("venue").text(": " + event.location.venue);

	venue_element.prepend(startdate_element); 
	event_element.append(h1_element);
    event_element.append(venue_element);
	event_element.wrapInner("<a href='#"+identifier+"'> data-transition='slide'");
    create_subpage(identifier,event);
	return event_element;

}
/*
 *Populate copy of a #extended information with a event and append it to body
 */

function create_subpage(identifier , event){
	
	var subpage = $('#extended-information').clone();
	$('#extended-information .ui-btn-text').text('Tillbaka');
	subpage.attr('data-url',identifier);
	subpage.find("h2").html(event.title);
	subpage.find("h3 time").attr({ 
            title: format_unixtime(event.event_time, "microformat"),
            datetime: format_unixtime(event.event_time, "html5")
    }).addClass("dtstart").text(format_unixtime(event.event_time, "human") +' : ');
	subpage.find("h3").append(event.location.venue);			
	subpage.find("p").text(event.description)
	subpage.find("address").text(event.location.street +' - '+ event.location.postal_code +' '+event.location.city +' - '+ event.location.country);
	$("body").append(subpage);	
}


/*
 * Converts json events into html and
 * Jquery append items to the events_container.
 */
function render_events (json) {

    var json_array = [];
    window.events = json_array;
    for(i in json) {
        json_array.push(json[i]);
    }

    var events = events_to_html(json_array);
    window.events = json_array;
    // Depending on the json data, events is an array of events or one event
    if (events instanceof Array) {
        for (i in events) {
            // We assume events_container is a jquery object
            events_container.append(events[i]);
        }
    } else {
        events_container.append(events);
    }
    
    // Jquery mobile stuff
    events_container.listview("refresh");
    
    // At this point we'll allow events to be loaded again
    window.events_getable = true;

}

/*
 * Retrieves events from the api given some parameters and runs either success
 * or error.
 */
function get_events (parameters, success, error) {

    if (!parameters.latitude || !parameters.longitude) {
        error();
    }

    var request_url = '/events.json?longitude=' + parameters.longitude + '&latitude=' + parameters.latitude;
    
    if (is_int(parameters.distance)) {
        request_url += "&distance=" + parameters.distance.toString();
    }                                                     

    
    $.ajax({
        url: request_url,
        dataType: 'json',
        type: 'GET',
        processData: false,
        contentType: 'application/json',
        success: success,
        statusCode: {
            204: error
        }
    });
}

/*
 * Checks if a variable is an integer
 */
function is_int(value){
    if((parseFloat(value) == parseInt(value)) && !isNaN(value)){
        return true;
    } else {
        return false;
    }
}

/*
 * Returns an error function that can be executed to display an error message.
 */
function make_error (error) {
    return function () {
        var element = $("<li>");
        element.append($("<h1>").text(error));
        events_container.append(element);
    };
}

function set_cookie( cookie_name, value, expires_in_days){

        var cookie_value = escape(value);
        
        if (expires_in_days) {

            var expire_date = new Date();
            expire_date.setDate(expire_date.getDate() + expires_in_days);

            cookie_value += "; expires=" + expire_date.toUTCString();

        }

	document.cookie = cookie_name + "=" + cookie_value;

}

function get_cookie(cookie_name){

    var i;
    var key;
    var value;
    var all_cookies = document.cookie.split(";");

    for ( i = 0 ; i < all_cookies.length ; i++ ){
        
        
        key = all_cookies[i].substr(0 , all_cookies[i].indexOf("=") );

        value = all_cookies[i].substr( all_cookies[i].indexOf("=") + 1 );
		
        key = key.replace(/^\s+|\s+$/g,"");

        if ( key == cookie_name ){
            return unescape(value);
        }
    }

    return false;

}

$(document).ready(function(){
    
    // This is where the events will be appended (appending it to window will
    // make it globaly accessible)
    window.events_container = $("ul#events");
	
    get_position(position_success, position_error);
    
    $("#settings_form").submit(function(event){
        event.preventDefault();
    });
    
    $("#settings").bind("pageshow", function(){
	    var distance = get_cookie("settings_distance");
	    var slider = $("#settings_distance");
	    if (distance != false) {
	    	slider.val(distance);
	    }
    	slider.slider("refresh");
    });
       
	$("#settings_done").click(function(event){
		
            event.preventDefault();
            
            if ($("#settings_distance").val()) {
                var now = new Date();
                var expires = now.getTime()+2592000000;
                set_cookie("settings_distance", $("#settings_distance").val() , new Date(expires));
            }
		
            
            $("#settings").hide();
            $("#main").show();

            get_position(position_success, position_error);
        
	});
	
	$(document).ajaxStart(function(){
		$.mobile.pageLoading();
	});
	
	$(document).ajaxStop(function(){
		$.mobile.pageLoading(true);
	});
});




