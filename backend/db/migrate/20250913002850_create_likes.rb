class CreateLikes < ActiveRecord::Migration[8.0]
  def change
    create_table :likes do |t|
      t.references :post, null: false, foreign_key: true
      t.references :user, null: false, foreign_key: true
      t.timestamps
    end
    
    add_index :likes, [:post_id, :user_id], unique: true
    add_index :likes, :user_id
  end
end
