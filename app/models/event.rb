class Event
         
    attr_accessor :title, :location, :description, :latitude, :longitude, :price, :startTime, :endTime, :id
    
    def self.all
      APIHandler.get_events({})
    end
    
    def self.find(param)
        @event = APIHandler.get_event("")
    end 
    
    def initialize(attributes = {})
      self.title = attributes[:title]
      self.description = attributes[:description]
    end

    def read_attribute_for_validation(key)
      @attributes[key]
    end

end
