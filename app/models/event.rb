class Event
    attr_accessor :title, :location, :description, :event_time

    def self.all(options)
        return APIHandler.get_events({})
    end
    
    def initialize(attributes = {})
        puts(attributes)
        self.title = attributes[:title]
        self.description = attributes[:description]
        self.location = attributes[:location]
        self.event_time = attributes[:event_time]
     end

    def read_attribute_for_validation(key)
        @attributes[key]
    end

end

