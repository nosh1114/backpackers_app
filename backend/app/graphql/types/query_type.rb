# frozen_string_literal: true

module Types
  class QueryType < Types::BaseObject
    description "Root Query"

    # --------------------------
    # Relay ベースの共通フィールド
    # --------------------------
    field :node,  Types::NodeType,                    null: true,
          description: "Fetch an object by Global ID" do
      argument :id, ID, required: true
    end

    def node(id:)
      context.schema.object_from_id(id, context)
    end

    field :nodes, [Types::NodeType],                  null: true,
          description: "Fetch objects by Global IDs" do
      argument :ids, [ID], required: true
    end

    def nodes(ids:)
      ids.map { |gid| context.schema.object_from_id(gid, context) }
    end

    # --------------------------
    # ユーザー関連フィールド
    # --------------------------
    field :user, Types::UserType,                     null: true,
          description: "Find User by ID" do
      argument :id, ID, required: true
    end

    def user(id:)
      User.find_by(id: id)
    end

    field :users, [Types::UserType],                  null: false,
          description: "List users (simple example)" do
      argument :page,  Integer, required: false
      argument :items, Integer, required: false
    end

    def users(page: nil, items: nil)
      scope = User.all.order(id: :asc)
      return scope unless page && items
      scope.limit(items).offset(items * (page - 1))
    end

    # --------------------------
    # テスト用フィールド
    # --------------------------
    field :test_field, String,                        null: false,
          description: "Example field added by generator"

    def test_field
      "Hello World!"
    end
  end
end
