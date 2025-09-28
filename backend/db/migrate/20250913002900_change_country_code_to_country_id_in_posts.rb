class ChangeCountryCodeToCountryIdInPosts < ActiveRecord::Migration[8.0]
  def change
    # 既存のcountry_codeをcountry_idに変更
    add_column :posts, :country_id, :bigint
    add_foreign_key :posts, :countries
    
    # 既存データの移行（country_codeからcountry_idに変換）
    reversible do |dir|
      dir.up do
        execute <<-SQL
          UPDATE posts 
          SET country_id = countries.id 
          FROM countries 
          WHERE posts.country_code = countries.code
        SQL
      end
    end
    
    # 古いカラムを削除
    remove_column :posts, :country_code
    add_index :posts, :country_id
  end
end
