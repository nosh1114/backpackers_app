class AddForeignKeys < ActiveRecord::Migration[8.0]
  def change
    # 既存の外部キー制約をチェックして、存在しない場合のみ追加
    add_foreign_key :users, :roles, column: :role_id unless foreign_key_exists?(:users, :roles, column: :role_id)
    add_foreign_key :countries, :areas, column: :area_id unless foreign_key_exists?(:countries, :areas, column: :area_id)
    add_foreign_key :posts, :countries, column: :country_id unless foreign_key_exists?(:posts, :countries, column: :country_id)
    add_foreign_key :comments, :posts, column: :post_id unless foreign_key_exists?(:comments, :posts, column: :post_id)
    add_foreign_key :comments, :users, column: :user_id unless foreign_key_exists?(:comments, :users, column: :user_id)
    add_foreign_key :likes, :posts, column: :post_id unless foreign_key_exists?(:likes, :posts, column: :post_id)
    add_foreign_key :likes, :users, column: :user_id unless foreign_key_exists?(:likes, :users, column: :user_id)
  end
end
