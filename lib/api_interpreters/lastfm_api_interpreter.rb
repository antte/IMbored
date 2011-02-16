class LastfmAPIInterpreter
    require 'net/http'
    require "rexml/document"
    include REXML
    @@apiKey = "ff6907a95706562150e0b7f914ebf031"
    @@latitude =59.17
    @@longitude = 18.3 
    
    def get_events(options)
        return getXMLByGeoParseToEventObjs(@@longitude,@@latitude)        
    end

    private 
    
    def getXMLByGeoParseToEventObjs(longitude,latitude)
        @events = Array.new 
        ### geo.getevens options
        lat = latitude #(Optional) : Specifies a latitude value to retrieve events for (service returns nearby events by default)
        #location(Optional) : Specifies a location to retrieve events for (service returns nearby events by default)
        long = longitude #(Optional) : Specifies a longitude value to retrieve events for (service returns nearby events by default)
        distance = 1 #(Optional) : Find events within a specified radius (in kilometres)
        #limit (Optional) : The number of results to fetch per page. Defaults to 10.
        #page #(Optional) : The page number to fetch. Defaults to first page.
        api_key = @@apiKey #(Required) : A Last.fm API key.
        #http://ws.audioscrobbler.com/2.0/?method=geo.getevents&lat=59.17&long=18.3&api_key=ff6907a95706562150e0b7f914ebf031

        urlString = "http://ws.audioscrobbler.com/2.0/?method=geo.getevents&lat="+lat.to_s+"&long="+long.to_s+"&api_key="+api_key.to_s+""  
        
        url = URI.parse(urlString)
        req = Net::HTTP::Get.new(url.path+'?'+url.query)
        res = Net::HTTP.start(url.host, url.port) {|http|
          http.request(req)
        }
        doc = Document.new( res.body )
        doc.elements.each("lfm/events/event") do |event|
          @events.push populateEventFromXml(event) if populateEventFromXml(event) 
        end
        return @events
    end
         
    def populateEventFromXml(item)
        event_time = ""
        location = {
            :street => item.elements["venue/location/street"] !=nil ? item.elements["venue/location/street"].text : "",
            :postal_code => item.elements["venue/location/postalcode"] !=nil ? item.elements["venue/location/postalcode"].text : "",
            :country =>item.elements["venue/location/country"] !=nil ? item.elements["venue/location/country"].text : "",
            :city =>item.elements["venue/location/city"] !=nil ? item.elements["venue/location/city"].text : "",
            :county =>"",
            :long =>@@longitude,
            :lat =>@@latitude
        }
        option = {
          :title => item.elements["title"] !=nil ? item.elements["title"].text : "",
          :description => item.elements["description"] !=nil ? item.elements["description"].text : "",
          :location => location,
          :event_time => item.elements["startDate"] !=nil ?  Time.parse(item.elements["startDate"].text).to_i : ""
        }
        event = Event.new(option)
        return event     
    end 
      
end