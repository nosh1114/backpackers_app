class RemoveRolesAndRoleIdFromUsers < ActiveRecord::Migration[8.0]
  def change
    # usersテーブルからrole_idカラムを削除
    remove_foreign_key :users, :roles if foreign_key_exists?(:users, :roles)
    remove_column :users, :role_id, :bigint
    
    # rolesテーブルを削除
    drop_table :roles do |t|
      t.string :name
      t.timestamps
    end
  end
end
