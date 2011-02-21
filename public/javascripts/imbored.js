/*
 * DEPENDENCIES: datetime.js (our own "lib")
 */

/*
 * Get events
 */
function get_events(){

    /*successfully got position*/
    function success_callback(position) {

        var coordinates = {};

        coordinates.longitude = position.coords.longitude;
        coordinates.latitude = position.coords.latitude;

        render_events_from_api(coordinates);

    }

    /*failure to get position*/
    function error_callback(error) {

        var coordinates = {};
        
        // TODO: Make a more useful error message to the user.
        alert("We couldn't find your position, sorry.");
        
    }

    if (navigator.geolocation) {
        var options = {timeout:1000, maximumAge: 600000};
        navigator.geolocation.getCurrentPosition(success_callback, error_callback, options);
    } else {
        error_callback({});
    }
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

    // We append alot of stuff to this wrapping event element
    var event_element =     $("<li>").addClass("vevent");

    var h1_element =        $("<h1>").addClass("summary").text(event.title);
    var startdate_element = $("<time>").attr({ 
            title: format_unixtime(event.event_time, "microformat"),
            datetime: format_unixtime(event.event_time, "html5")
    }).addClass("dtstart").text(format_unixtime(event.event_time, "human"));

    var description_element = $("<p>").addClass("description").text(event.description);

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

function render_events_from_api (options) {

    var request_url = '/events.json?longitude=' + options.longitude + '&latitude=' + options.latitude;
    
    if (is_int(options.distance)) {
        request_url += "&distance=" + options.distance.toString();
    }
    
    $.ajax({
        url: request_url,
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
        },
        statusCode: {
            204: function() {
                render_error("Couldn't find any events",events_container);
            }

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

function render_error (error, events_container) {
    var element = $("<li>");
    var h1_element = $("<h1>").text(error);
    element.append(h1_element);
    events_container.append(element);
}

$(document).ready(function(){

    $("#spinner").hide();

    $("#spinner").ajaxSend(function() {   
        $(this).show();	
    });

    $("#spinner").ajaxStop(function() {
        $(this).hide();
    });


    $("#find_activity").click(function(){

        // Need to save the spinner so that it doesnt get removed by .empty()
        var spinner = $("#spinner").clone();
        $("#events").empty();
        $("#events").append(spinner);

        get_events();
        return false;

    });

});
