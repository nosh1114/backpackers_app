# frozen_string_literal: true

module Types
  class MutationType < Types::BaseObject
    # TODO: remove me
    field :test_field, String, null: false,
      description: "An example field added by the generator"
    def test_field
      "Hello World"
    end

    field :create_user, mutation: Mutations::CreateUser
    field :update_profile, mutation: Mutations::UpdateProfile
    field :login, mutation: Mutations::Login
    field :signup, mutation: Mutations::Signup
    field :request_password_reset, mutation: Mutations::RequestPasswordReset
    field :reset_password, mutation: Mutations::ResetPassword
    field :create_post, mutation: Mutations::CreatePost
  end
end
