class Event
         
    attr_accessor :title, :location, :description, :latitude, :longitude, :price, :start_time, :end_time, :id , :timestamp
    
    def self.find(param)
        @event = APIHandler.get_event("")
    end

    def self.all(options)
        APIHandler.get_events({})
    end
    
    def initialize(attributes = {})
        self.title = attributes[:title]
        self.description = attributes[:description]
        self.location = attributes[:location]
        self.longitude = attributes[:longitude]
        self.price = attributes[:price]
        self.latitude = attributes[:latitude]
        self.id = attributes[:id]
        self.start_time = attributes[:start_time]
    end

    def read_attribute_for_validation(key)
        @attributes[key]
    end

end

