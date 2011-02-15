class APIHandler

    @@api_interpreters = Array.new
    @@api_interpreters.push(LastfmAPIInterpreter.new)

    def APIHandler.get_events(options)

        events = Array.new
        @@api_interpreters.each do |api_interpreter|
            events.push(api_interpreter.get_events(options)) 
        end

        return events
    end

end
