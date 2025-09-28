class AddAreaIdToCountries < ActiveRecord::Migration[8.0]
  def change
    add_column :countries, :area_id, :bigint
  end
end
