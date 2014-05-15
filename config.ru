require 'rubygems'
require 'bundler/setup'
require 'sinatra'
require 'haml'
require './tabular_renderer'

set :environment, :production
set :run, false
set :raise_errors, false

run Sinatra::Application
