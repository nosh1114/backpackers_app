module Types
  class CountryType < Types::BaseObject
    field :code, String, null: false
    field :name, String, null: false
  end
end
