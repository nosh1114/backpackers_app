# frozen_string_literal: true

module Mutations
  class Login < BaseMutation
    description "ログイン（メール＆パスワード認証）"

    argument :email, String, required: true
    argument :password, String, required: true

    field :user, Types::UserType, null: true
    field :token, String, null: true
    field :errors, [String], null: false

    def resolve(email:, password:)
      user = User.find_by(email: email)
      if user&.authenticate(password)
        token = JwtService.generate_token(user)
        {
          user: user,
          token: token,
          errors: []
        }
      else
        {
          user: nil,
          token: nil,
          errors: ["メールアドレスまたはパスワードが正しくありません"]
        }
      end
    end
  end
end 