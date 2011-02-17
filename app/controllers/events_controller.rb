class EventsController < ApplicationController
  # GET /events
  # GET /events.xml
  def index

    # If the required parameters are missing give 400
    if params[:long] == nil or params[:lat] == nil then
        render_error("400")
        return
    end

    options  = {
      :long => params[:long], 
      :lat => params[:lat],
      :distance => params[:distance]
    }

    @events = Event.all(options)
  
    if @events.length > 0 then
      respond_to do |format|
        format.html # index.html.erb
        format.json { render :json => @events }
      end
    else
        # If no events was found
        render_error("204")
    end
  end


  def render_error(code)
    if code == "204" then
      respond_to do |format|
        puts "204!"
        format.html { render :file => "#{Rails.root}/public/204.html", :status => :no_content }
        format.json { head :no_content }
      end
    elsif code == "400" then
      respond_to do |format|
        puts "400!"
        format.html { render :file => "#{Rails.root}/public/400.html", :status => :bad_request }
        format.json { head :bad_request }
      end
    end   
  end


  # GET /events/1
  # GET /events/1.xml
  def show
    @event = Event.find(params)

    respond_to do |format|
      format.html # show.html.erb
      format.json  { render :json => @events }
    end
  end

  # GET /events/new
  # GET /events/new.xml
  def new
    @event = Event.new

    respond_to do |format|
      format.html # new.html.erb
    end
  end

  # GET /events/1/edit
  def edit
    @event = Event.find(params[:id])
  end

  # POST /events
  # POST /events.xml
  def create
    @event = Event.new(params[:event])

    respond_to do |format|
      if @event.save
        format.html { redirect_to(@event, :notice => 'Event was successfully created.') }
      else
        format.html { render :action => "new" }
      end
    end
  end

  # PUT /events/1
  # PUT /events/1.xml
  def update
    @event = Event.find(params[:id])

    respond_to do |format|
      if @event.update_attributes(params[:event])
        format.html { redirect_to(@event, :notice => 'Event was successfully updated.') }
        format.xml  { head :ok }
      else
        format.html { render :action => "edit" }
        format.xml  { render :xml => @event.errors, :status => :unprocessable_entity }
      end
    end
  end

  # DELETE /events/1
  # DELETE /events/1.xml
  def destroy
    @event = Event.find(params[:id])
    @event.destroy

    respond_to do |format|
      format.html { redirect_to(events_url) }
      format.xml  { head :ok }
    end
  end
end
