class AddColumnsToLikes < ActiveRecord::Migration[8.0]
  def change
    # 既存のカラムをチェックして、存在しない場合のみ追加
    add_column :likes, :post_id, :bigint unless column_exists?(:likes, :post_id)
    add_column :likes, :user_id, :bigint unless column_exists?(:likes, :user_id)
  end
end
