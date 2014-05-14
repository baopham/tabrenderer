before do
  headers "Content-Type" => "text/html; charset=utf-8"
end

get '/' do
  @title = 'Tabular Renderer'
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
  haml :index
end

get '/privacy' do
  @title = 'Privacy | Tabular Renderer'
  haml :privacy
end
