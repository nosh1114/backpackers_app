class ApiV1CountriesController < ApplicationController
  def index
    render json: {
      countries: Countries::COUNTRIES
    }
  end
end
