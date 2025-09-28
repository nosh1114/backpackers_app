class AddColumnsToComments < ActiveRecord::Migration[8.0]
  def change
    # 既存のカラムをチェックして、存在しない場合のみ追加
    add_column :comments, :post_id, :bigint unless column_exists?(:comments, :post_id)
    add_column :comments, :user_id, :bigint unless column_exists?(:comments, :user_id)
    add_column :comments, :content, :text unless column_exists?(:comments, :content)
  end
end
