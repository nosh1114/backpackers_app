# frozen_string_literal: true

class AddImageUrlToCountries < ActiveRecord::Migration[8.0]
  def change
    add_column :countries, :image_url, :string
  end
end

