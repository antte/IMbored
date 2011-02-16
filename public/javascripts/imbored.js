/*
 * DEPENDENCIES: datetime.js (our own "lib")
 */
$(document).ready(function(){

    var coordinates = {};

    if (navigator.geolocation) {

        function foundLocation(position) {
            coordinates.longitude = position.coords.longitude;
            coordinates.latitude = position.coords.latitude;
            alert('Found location: ' + longitude + ', ' + latitude);
        }    

        function noLocation() {
            alert('Could not find location');
        }

        navigator.geolocation.getCurrentPosition(foundLocation, noLocation);

    } 
    
    function getEvents(coordinates) {
        $.ajax({
            url: 'http://localhost:3000/events.json/?longitude=' + coordinates.longitude + '&latitude=' + coordinates.latitude,
            dataType: 'json',
            type: 'GET',
            processData: false,
            contentType: 'application/json',
            success: function(data) {
                console.log(data);
                /*
                var events = [];
                for(event in data) {
                    events.push(data[event]);
                }
                return events;
                */
            }
        });
    }
    
    events = getEvents(coordinates);

    var events_container = $("#events");
    
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
        var event_element =     $("<article>", {class: "vevent"});

        var h1_element =        $("<h1>", {class: "summary"}).text(event.title);
        var startdate_element = $("<time>", {
                class: "dtstart", 
                title: format_unixtime(event.unixtime, "microformat"),
                datetime: format_unixtime(event.unixtime, "html5")
        }).text(format_unixtime(event.unixtime, "human"));
        
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
        if (events instanceof Array) {
            for (i in events) {
                // We assume events_container is a jquery object
                events_container.append(events[i]);
            }
        } else {
            events_container.append(events);
        }
    }

    events = events_to_html(events);
    render_events(events, events_container);

});
