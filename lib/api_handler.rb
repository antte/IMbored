class APIHandler

    @@api_interpreters = Array.new
    @@api_interpreters.push(LastfmAPIInterpreter.new)

    def APIHandler.get_events(options)

        events = Array.new
        options= {}
        @@api_interpreters.each do |api_interpreter|
            events = events | api_interpreter.get_events(options) #pipe = combine and remove duples in array
        end
        return events
    end

end
