class AddEmailConfirmationToUsers < ActiveRecord::Migration[8.0]
  def change
    add_column :users, :email_confirmed, :boolean, default: false, null: false
    add_column :users, :confirmation_token, :string
    add_column :users, :confirmation_sent_at, :datetime
    
    # 既存ユーザーは確認済みとする
    reversible do |dir|
      dir.up do
        User.update_all(email_confirmed: true)
      end
    end
  end
end
