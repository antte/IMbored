    require 'net/http'
class LastfmAPIInterpreter
    require "rexml/document"
    include REXML
    include ActionView::Helpers::SanitizeHelper
    @@apiKey = "ff6907a95706562150e0b7f914ebf031"
    def get_events(options)
      return getXMLByGeoParseToEventObjs(options[:longitude].to_f, options[:latitude].to_f, options[:distance].to_i)        
    end

    private 
    
    def getXMLByGeoParseToEventObjs(longitude,latitude,dist)
        @events = Array.new 
        ### geo.getevens options
        lat = latitude #(Optional) : Specifies a latitude value to retrieve events for (service returns nearby events by default)
        #location(Optional) : Specifies a location to retrieve events for (service returns nearby events by default)
        long = longitude #(Optional) : Specifies a longitude value to retrieve events for (service returns nearby events by default)
        distance =  dist #(Optional) : Find events within a specified radius (in kilometres)
        #limit (Optional) : The number of results to fetch per page. Defaults to 10.
        #page #(Optional) : The page number to fetch. Defaults to first page.
        api_key = @@apiKey #(Required) : A Last.fm API key.

        urlString = "http://ws.audioscrobbler.com/2.0/?method=geo.getevents&lat="+lat.to_s+"&long="+long.to_s+"&api_key="+api_key 

        if dist != nil then
            urlString += "&distance=" + dist.to_s
        end

        url = URI.parse(urlString)
        req = Net::HTTP::Get.new(url.path+'?'+url.query)
        res = Net::HTTP.start(url.host, url.port) {|http|
          http.request(req)
        }
        doc = Document.new( res.body )
        doc.elements.each("lfm/events/event") do |event|
          event = populateEventFromXml(event)
          if event then
            @events.push event
          end
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
            :longitude =>item.elements["venue/location/geo:point/geo:long"] !=nil ? item.elements["venue/location/geo:point/geo:long"].text : "",
            :latitude =>item.elements["venue/location/geo:point/geo:lat"] !=nil ? item.elements["venue/location/geo:point/geo:lat"].text : "",
            :venue => item.elements["venue/name"] != nil ? item.elements["venue/name"].text : ""
        }

        option = {
          :title => item.elements["title"] !=nil ? item.elements["title"].text : "",
          :description => item.elements["description"] !=nil ? strip_tags(item.elements["description"].text) : "",
          :location => location,
          :event_time => item.elements["startDate"] !=nil ?  Time.zone.parse(item.elements["startDate"].text).to_i : ""
        }
        event = Event.new(option)
        return event     
    end
    
    def development
        event = Event.new(option)
    end    
      
end
