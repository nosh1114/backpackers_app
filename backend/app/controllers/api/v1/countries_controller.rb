class Api::V1::CountriesController < ApplicationController
  def index
    render json: {
      countries: Countries::COUNTRIES
    }
  end
end
