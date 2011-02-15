class Event
         
    attr_accessor :title, :location, :description, :latitude, :longitude, :price, :startTime, :endTime, :id


    def self.all
      # return Api.getEvents(option)
      APIHandler.get_events("hej")
    end
    
    def self.find(param)
      return Event.new({
        :title => "Lorum Ipsum", 
        :location => "", 
        :description => "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.", 
        :latitude => 0, 
        :longitude => 0, 
        :price => 60 , 
        :startTime => nil, 
        :endTime => nil, 
        :id => 1})
    end 
    
    def initialize(attributes = {})
      self.title = attributes[:title]
      self.description = attributes[:description]
    end

    def read_attribute_for_validation(key)
      @attributes[key]
    end

end
