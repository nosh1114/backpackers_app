class RemoveCountryCodeFromPosts < ActiveRecord::Migration[8.0]
  def change
    remove_column :posts, :country_code, :string
  end
end
