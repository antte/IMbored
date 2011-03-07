/*
 * IMBored Javascript
 * DEPENDENCIES: 
 *  - datetime.js (our own "lib")
 *      specifically we use the format_unixtime function
 */

var events_getable = true;
var geo;

// Document ready shorthand
$(function() {
    
    var events_container = $("ul#events");
    var user_position;

    get_position(position_received_callback);

    // This function should be called when the get_position succeeds
    function position_received_callback(position) {
        user_position = position;
        user_position.distance = parseInt(get_cookie("settings_distance"));
        get_events(user_position, events_received_callback); 
    }

    // This function should be called when the get_events succeeds
    function events_received_callback(events) {
        render_events(events, events_container);
    }

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

        if ($("#settings_distance").val() != get_cookie("settings_distance")) {
            var now = new Date();
            var expires = now.getTime()+2592000000;
            set_cookie("settings_distance", $("#settings_distance").val() , new Date(expires));
            get_position();
        }
		
    });
	
    $("#reload_button").click(function() {
        get_events(user_position, events_received_callback); 
    });

    $(document).ajaxStart(function(){
        $.mobile.pageLoading();
        $('.ui-loader h1').text('Laddar');
    });
	
    $(document).ajaxStop(function(){
        $.mobile.pageLoading(true);
    });
});

/*
 * Tries to retrive the users position and runs either a success or a failure
 * callback.
 */
function get_position(callback) {
  
    var callback = callback;

    if (navigator.geolocation) {
        var options = {timeout:5000, maximumAge: 600000};
        navigator.geolocation.getCurrentPosition(success_callback, error_callback, options);
    }   

	function getGeoLocation() { 
		alert('geobastard');

		$.get("/system/geolocation",function(data){ 
			  geo = data.split(";"); 
		});	                                 
	}
	getGeoLocation();

    function success_callback(position) {

        // The only reason this exists is because firefox fires the success
        // callback twice sometimes.
        if (!window.events_getable) {
            return;
        }

        window.events_getable = false;

        var parameters = {};
        parameters.longitude = position.coords.longitude;
        parameters.latitude = position.coords.latitude;

        callback(parameters);

    }
    function error_callback(error) {
        make_error("Failed...")();
    }

}


/*
 * Retrieves events from the api given some parameters and runs either success
 * or error.
 */
function get_events(parameters, success_callback) {

    var request_url = 'http://imbored.heroku.com/events.json?callback=?&longitude=' + parameters.longitude + '&latitude=' + parameters.latitude;
 
    // The backend can't(or shouldn't) handle a non-integer distance
    if (is_int(parameters.distance)) {
        request_url += "&distance=" + parameters.distance.toString();
    }                                                     

    $.getJSON(request_url, success_callback);
}



/*
 * Takes JSON "events", turns them into HTML and append them to events_container.
 */
function render_events(json, events_container) {

    events_container.empty();

    var events = [];
    for(i in json) {
        events.push(json[i]);
    }

    var events = events_to_html(events);

    // Depending on the json data, events is an array of events or one event
    if (events instanceof Array) {
        for (i in events) {
            // We assume events_container is a jquery object
            events_container.append(events[i]);
        }
    } else {
        events_container.append(events);
    }
    
    // jQuery mobile stuff
    events_container.listview("refresh");
    
    // At this point we'll allow events to be loaded again
    window.events_getable = true;

    function events_to_html(event, identifier) {
        if (event instanceof Array) {
            var events = new Array();
            for (e in event) {
                events.push(events_to_html(event[e],event[e].id));
            }
            return events;
        }

        // We append alot of stuff to this wrapping event element
        var event_element = $("<li>").addClass("vevent");

        var h1_element = $("<h1>").text(event.title);
        var startdate_element = $("<time>").attr({ 
                title: format_unixtime(event.event_time, "microformat"),
                datetime: format_unixtime(event.event_time, "html5")
        }).addClass("dtstart").text(format_unixtime(event.event_time, "human"));

        var venue_element = $("<p>").addClass("venue").text(": " + event.location.venue);

        venue_element.prepend(startdate_element); 
        event_element.append(h1_element);
        event_element.append(venue_element);
        event_element.wrapInner("<a href='#"+identifier+"'> data-transition='slide'");
        create_extended_information_page(event, identifier);

        return event_element;
    }

    /*
     *Populate copy of a #extended information with a event and append it to body
     */
    function create_extended_information_page(event, identifier){
        var subpage = $('#extended-information').clone();
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

}

/******************
 *
 *  General functions
 *
 *****************/

function set_cookie(cookie_name, value, expires_in_days){
        var cookie_value = escape(value);
        
        if (expires_in_days) {
            var expire_date = new Date();
            expire_date.setDate(expire_date.getDate() + expires_in_days);
            cookie_value += "; expires=" + expire_date.toUTCString();
        }

	document.cookie = cookie_name + "=" + cookie_value;
}

function get_cookie(cookie_name) {
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
 * TODO: Put this in something nicer than a li! It aint no list item
 */
function make_error(message) {
    return function () {
        var element = $("<li>");
        element.append($("<h1>").text(message));
        events_container.append(element);
    };
}
