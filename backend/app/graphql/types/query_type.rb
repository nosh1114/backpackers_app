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
    # プロフィール関連フィールド
    # --------------------------
    field :current_user_profile, Types::UserType,     null: true,
          description: "Get current user profile"

    def current_user_profile
      context[:current_user]
    end

    # --------------------------
    # 投稿関連フィールド
    # --------------------------
    field :posts, [Types::PostType],                  null: false,
          description: "List all posts" do
      argument :page,  Integer, required: false
      argument :items, Integer, required: false
      argument :country_code, String, required: false
    end

    def posts(page: nil, items: nil, country_code: nil)
      scope = Post.includes(:user).order(created_at: :desc)
      scope = scope.where(country_code: country_code) if country_code.present?
      return scope unless page && items
      scope.limit(items).offset(items * (page - 1))
    end

    field :post, Types::PostType,                     null: true,
          description: "Find Post by ID" do
      argument :id, ID, required: true
    end

    def post(id:)
      Post.includes(:user).find_by(id: id)
    end

    # --------------------------
    # 国関連フィールド
    # --------------------------
    field :countries, [Types::CountryType],           null: false,
          description: "List all countries"

    def countries
      Countries::COUNTRIES.map do |country|
        OpenStruct.new(code: country[:code], name: country[:name])
      end
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
