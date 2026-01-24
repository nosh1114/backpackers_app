class RemoveWebsiteAndLocationFromUsers < ActiveRecord::Migration[8.0]
  def change
    remove_column :users, :website, :string
    remove_column :users, :location, :string
  end
end
