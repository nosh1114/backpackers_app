# frozen_string_literal: true

module Mutations
  class Signup < BaseMutation
    description "ユーザー登録"

    argument :name, String, required: true
    argument :email, String, required: true
    argument :password, String, required: true
    argument :password_confirmation, String, required: true

    field :user, Types::UserType, null: true
    field :token, String, null: true
    field :errors, [String], null: false

    def resolve(name:, email:, password:, password_confirmation:)
      user = User.new(
        name: name,
        email: email,
        password: password,
        password_confirmation: password_confirmation
      )

      if user.save
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
          errors: user.errors.full_messages
        }
      end
    end
  end
end 