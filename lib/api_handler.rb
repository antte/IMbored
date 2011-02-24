class APIHandler

    @@api_interpreters = Array.new
    @@api_interpreters.push(LastfmAPIInterpreter.new)
    @@api_interpreters.push(DebaserAPIInterpreter.new)

    def APIHandler.get_events(options)
        
        events = []
        @@api_interpreters.each do |api_interpreter|
            events = events | api_interpreter.get_events(options) #pipe = combine and remove duples in array
        end
        # Sort events by time

        events.sort! { |a,b| a.event_time <=> b.event_time}

        return events

    end

    def APIHandler.get_event(identifier)
        # The identifier is a string with this structure "api_id". Where API is the name for the apiinterpreter and id
        # the id supplied by the api
        # "lastfm_3874432" is one example
        identifier = identifier.split("_")
        if(identifier[0] == "lastfm") then
            return LastfmAPIInterpreter.new.get_event(identifier[1])
        elsif(identifier[0] == "debaser") then
            return DebaserAPIInterpreter.new.get_event(identifier[1])
        end
        return nil
    end

end
