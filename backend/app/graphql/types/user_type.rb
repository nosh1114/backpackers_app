# frozen_string_literal: true

module Types
  class UserType < Types::BaseObject
    description "User type"

    field :id, ID, null: false
    field :name, String, null: false
    field :email, String, null: false
    field :bio, String, null: true
    field :location, String, null: true
    field :website, String, null: true
    field :avatar_url, String, null: true
    field :created_at, GraphQL::Types::ISO8601DateTime, null: false
    field :updated_at, GraphQL::Types::ISO8601DateTime, null: false
  end
end
