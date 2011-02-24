require 'test_helper'

class TestLastfmAPIInterpreter < ActiveSupport::TestCase
  # Replace this with your real tests.
  last_fm = LastfmAPIInterpreter.new 
  test  "test Lastfm" do
    last_fm.get_events
  end
end
