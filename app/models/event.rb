class Event
    attr_accessor :title, :location, :description, :latitude, :longitude, :price, :start_time, :end_time, :id , :timestamp

    def self.all(options)
        APIHandler.get_events(options)
    end
    
    def self.find(options)
        APIHandler.get_event(options)    
    end 
    
    def initialize(attributes = {})
        self.title = attributes[:title]
        self.description = attributes[:description]
        self.location = attributes[:location]
        self.longitude = attributes[:longitude]
        self.price = attributes[:price]
        self.latitude = attributes[:latitude]
        self.id = attributes[:id]
        self.starttime = attributes[:start_time]
    end

    def read_attribute_for_validation(key)
        @attributes[key]
    end

end

