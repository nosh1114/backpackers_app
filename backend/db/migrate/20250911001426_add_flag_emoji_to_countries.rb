class AddFlagEmojiToCountries < ActiveRecord::Migration[8.0]
  def change
    add_column :countries, :flag_emoji, :string
  end
end
