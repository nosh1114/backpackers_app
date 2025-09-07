# frozen_string_literal: true

module Mutations
  class UpdateProfile < BaseMutation
    description "Update user profile"

    argument :name, String, required: false
    argument :email, String, required: false
    argument :bio, String, required: false
    argument :location, String, required: false
    argument :website, String, required: false
    argument :avatar_url, String, required: false

    field :user, Types::UserType, null: true
    field :errors, [String], null: false

    def resolve(name: nil, email: nil, bio: nil, location: nil, website: nil, avatar_url: nil)
      user = context[:current_user]
      
      return { user: nil, errors: ["ログインが必要です"] } unless user

      # 更新可能な属性のみを更新
      user.name = name if name.present?
      user.email = email if email.present?
      user.bio = bio if bio.present?
      user.location = location if location.present?
      user.website = website if website.present?
      user.avatar_url = avatar_url if avatar_url.present?

      if user.save
        {
          user: user,
          errors: []
        }
      else
        {
          user: nil,
          errors: user.errors.full_messages
        }
      end
    end
  end
end 