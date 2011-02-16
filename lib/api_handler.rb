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

    def APIHandler.get_event(identifier)
        # This is not how it is supposed to be.. it's just for testing
        return Event.new({
            :title => "Lorum Ipsum", 
            :location => "", 
            :description => "This event is from /lib/api_hander.rb. Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.", 
            :latitude => 0, 
            :longitude => 0, 
            :price => 60 , 
            :startTime => nil, 
            :endTime => nil, 
            :id => 1})
    end

end
