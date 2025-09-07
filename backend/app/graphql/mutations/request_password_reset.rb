# frozen_string_literal: true

module Mutations
  class RequestPasswordReset < BaseMutation
    description "Request password reset"

    argument :email, String, required: true

    field :success, Boolean, null: false
    field :message, String, null: false

    def resolve(email:)
      user = User.find_by(email: email.downcase)
      
      if user
        user.generate_password_reset_token!
        
        # 実際のメール送信はここで実装
        # 開発環境ではコンソールにトークンを出力
        if Rails.env.development?
          puts "🔐 Password reset token for #{email}: #{user.reset_password_token}"
        end
        
        {
          success: true,
          message: "パスワードリセット用のメールを送信しました"
        }
      else
        {
          success: false,
          message: "このメールアドレスは登録されていません"
        }
      end
    end
  end
end 