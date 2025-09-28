class AddStatusAndCountryIdAndViewCountToPosts < ActiveRecord::Migration[8.0]
  def change
    # 既存のカラムをチェックして、存在しない場合のみ追加
    add_column :posts, :status, :bigint unless column_exists?(:posts, :status)
    # country_idは既に存在するため、コメントアウト
    # add_column :posts, :country_id, :bigint
    add_column :posts, :view_count, :integer unless column_exists?(:posts, :view_count)
  end
end
