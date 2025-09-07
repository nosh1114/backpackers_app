class AddCountryCodeToPosts < ActiveRecord::Migration[8.0]
  def change
    add_column :posts, :country_code, :string
  end
end
