class AddProfileFieldsToUsers < ActiveRecord::Migration[8.0]
  def change
    add_column :users, :bio, :text
    add_column :users, :location, :string
    add_column :users, :website, :string
    add_column :users, :avatar_url, :string
  end
end
