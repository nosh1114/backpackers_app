class ApiV1CountriesController < ApplicationController
  def index
    countries = Country.ordered.map do |country|
      {
        code: country.code,
        name: country.name
      }
    end

    render json: {
      countries: countries
    }
  end
end
