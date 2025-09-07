module Mutations
  class CreatePost < BaseMutation
    argument :title, String, required: true
    argument :content, String, required: true
    argument :country_code, String, required: true

    field :post, Types::PostType, null: true
    field :errors, [String], null: false

    def resolve(title:, content:, country_code:)
      return { post: nil, errors: ['ログインが必要です'] } unless context[:current_user]

      post = context[:current_user].posts.build(
        title: title,
        content: content,
        country_code: country_code
      )

      if post.save
        {
          post: post,
          errors: []
        }
      else
        {
          post: nil,
          errors: post.errors.full_messages
        }
      end
    end
  end
end 