class LastfmAPIInterpreter

    def get_events(options)
        events = Array.new

        testevent = Event.new({
            :title => "satan i gatan",
            :description => "svamp i pizzan"
        })

        testevent2 = Event.new({
            :title => "satan i gatan",
            :description => "svamp i pizzan"
        })

        events.push(testevent)
        events.push(testevent2)

        return events

    end

end
