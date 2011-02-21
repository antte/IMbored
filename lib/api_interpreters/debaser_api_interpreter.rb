# -*- encoding: utf-8 -*-

class DebaserAPIInterpreter
    require 'net/http'
    require "rexml/document"
    include REXML
    include ActionView::Helpers::SanitizeHelper
    
    def get_events(options)
        puts "================================================="
        puts "================================================="
        puts "================================================="
        puts "================================================="
        puts "================================================="
        puts "Debaser"
        puts "================================================="
        puts "================================================="
        puts "================================================="
        puts "================================================="
        puts "================================================="

        return getXMLByGeoParseToEventObjs(options[:longitude].to_f, options[:latitude].to_f, options[:distance].to_i)        
    end

    private 
    
    def getXMLByGeoParseToEventObjs(longitude,latitude,dist)
        @events = Array.new 
        ### geo.getevens options
        ###lat = latitude #(Optional) : Specifies a latitude value to retrieve events for (service returns nearby events by default)
        #location(Optional) : Specifies a location to retrieve events for (service returns nearby events by default)
        ###long = longitude #(Optional) : Specifies a longitude value to retrieve events for (service returns nearby events by default)
        ###distance =  dist #(Optional) : Find events within a specified radius (in kilometres)
        #limit (Optional) : The number of results to fetch per page. Defaults to 10.
        #page #(Optional) : The page number to fetch. Defaults to first page.

        startTime = Time.new
        endTime = startTime + (60 * 60 * 24 * 7) # Seven days

        startDate = startTime.strftime("%Y%m%d")
        endDate= endTime.strftime("%Y%m%d")

        urlString = "http://www.debaser.se/debaser/api/?method=getevents&from="+startDate.to_s+"&to="+endDate.to_s+"&format=xml"

        url = URI.parse(urlString)
        req = Net::HTTP::Get.new(url.path+'?'+url.query)
        res = Net::HTTP.start(url.host, url.port) {|http|
            http.request(req)
        }

        doc = Document.new( res.body )
        doc.elements.each("xml/event") do |event|
            if event.elements["eventstatus"].text != "Inställt" then
                @events.push populateEventFromXml(event) if populateEventFromXml(event) 
            end
        end


        return @events
    end
         
    def populateEventFromXml(item)
        event_time = ""

        venue_name = item.elements["venueslug"]
        if( venue_name == "malmo" ) then
            location = {
                :street => "Norra Parkgatan 2",
                :postal_code => "214 22",
                :country => "Sweden",
                :city => "Malmö",
                :county =>"Malmö",
                :longitude => "13.012906",
                :latitude => "55.595179"
            }
        elsif( venue_name == "slussen" ) then
            location = {
                :street => "Karl Johans Torg 1",
                :postal_code => "111 30",
                :country => "Sweden",
                :city => "Stockholm",
                :county =>"Stockholm",
                :longitude => "18.073346",
                :latitude => "59.321891"
            }
        elsif( venue_name == "humlegarden" ) then
            location = {
                :street => "Sturegatan Kungliga Humlegården 1",
                :postal_code => "114 35",
                :country => "Sweden",
                :city => "Stockholm",
                :county =>"Stockholm",
                :longitude => "18.072981",
                :latitude => "59.339983"
            }
        elsif( venue_name == "medis" ) then
            location = {
                :street => "Medborgarplatsen 8",
                :postal_code => "118 26",
                :country => "Sweden",
                :city => "Stockholm",
                :county =>"Stockholm",
                :longitude => "18.072981",
                :latitude => "59.339983"
            }
        end


        # We regexp through the "open" element to get which hour it starts and adds it to the "starttime"-timestamp
        # The regexp thingie is generated by txt2re.com
        open_element = item.elements["open"].text
        start_hour = 0
        re1='.*?'       # Non-greedy match on filler
        re2='(\\d+)'
        re=(re1+re2)
        m=Regexp.new(re,Regexp::IGNORECASE);
        if m.match(open_element)
            start_hour = m.match(open_element)[1].to_i;
        end
        starttime = Time.zone.parse(item.elements["eventdate"].text).to_i
        starttime = starttime + (60 * 60 * start_hour)

        title = item.elements["event"] !=nil ? item.elements["event"].text : ""
        if item.elements["club"].text != nil then 
            # Meh, don't know how we want to present the "club" data
            title = title + " " +  item.elements["club"].text
        end
        
        option = {
            :title => title,
            :description => item.elements["description"] != nil ? strip_tags(item.elements["description"].text) : "",
            :location => location,
            :event_time => starttime 
        }
        event = Event.new(option)
        return event     
    end
    
    def development
        event = Event.new(option)
    end    
      
end