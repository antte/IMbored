class Event
    attr_accessor :title, :location, :description, :event_time, :id, :distance

    def self.all(options)
        
        return APIHandler.get_events(options) 
    end
    
    def initialize(attributes = {})
        puts(attributes)
        self.id = attributes[:id]
        self.title = attributes[:title]
        self.description = attributes[:description]
        self.location = attributes[:location]
        self.event_time = attributes[:event_time]
        self.distance = attributes[:distance]
     end

    def read_attribute_for_validation(key)
        @attributes[key]
    end

    def self.find(param)
        return APIHandler.get_event(param[:id]) 
    end

end

