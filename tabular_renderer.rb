app_title = 'TabRenderer'

before do
  headers "Content-Type" => "text/html; charset=utf-8"
end

get '/' do
  @title = app_title
  @page = 'index'
  haml :index
end

get '/tabular/render' do
  redirect '/'
end

require 'csv'
post '/tabular/render' do
  @tabular_input = params['tabular-input']
  @delimiter = params['delimiter']
  @render_result =
    begin
      CSV.parse(@tabular_input, {:col_sep => @delimiter, :row_sep => :auto}).to_a
    rescue Exception => e
      e.message
    end

  if @render_result.respond_to?(:match) and matches = @render_result.match(/line (\d+)/)
    @error_line = matches[1]
  end

  @page = 'index'

  haml :index
end

get '/privacy' do
  @title = "Privacy | #{app_title}"
  @page = 'privacy'
  haml :privacy
end
