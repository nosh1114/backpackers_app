# frozen_string_literal: true

module Mutations
  class ResetPassword < BaseMutation
    description "Reset password with token"

    argument :token, String, required: true
    argument :password, String, required: true
    argument :password_confirmation, String, required: true

    field :success, Boolean, null: false
    field :message, String, null: false

    def resolve(token:, password:, password_confirmation:)
      user = User.find_by(reset_password_token: token)
      
      return {
        success: false,
        message: "無効なトークンです"
      } unless user

      return {
        success: false,
        message: "トークンの有効期限が切れています"
      } if user.password_reset_expired?

      return {
        success: false,
        message: "パスワードが一致しません"
      } unless password == password_confirmation

      return {
        success: false,
        message: "パスワードは8文字以上で入力してください"
      } if password.length < 8

      user.password = password
      user.password_confirmation = password_confirmation
      user.clear_password_reset_token!

      if user.save
        {
          success: true,
          message: "パスワードが正常にリセットされました"
        }
      else
        {
          success: false,
          message: user.errors.full_messages.join(", ")
        }
      end
    end
  end
end 