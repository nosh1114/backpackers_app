class ApiV1LikesController < ApplicationController
  before_action :authenticate_user
  before_action :set_post

  def toggle
    like = @post.likes.find_by(user_id: current_user.id)

    if like
      # いいねを削除
      like.destroy
      @post.update_likes_count!
      render json: {
        liked: false,
        likes_count: @post.likes_count
      }
    else
      # いいねを追加
      like = @post.likes.create(user: current_user)
      if like.persisted?
        @post.update_likes_count!
        render json: {
          liked: true,
          likes_count: @post.likes_count
        }
      else
        render json: { errors: like.errors.full_messages }, status: :unprocessable_entity
      end
    end
  end

  def status
    liked = @post.likes.exists?(user_id: current_user.id)
    render json: {
      liked: liked,
      likes_count: @post.likes_count || @post.likes.count
    }
  end

  private

  def set_post
    @post = Post.find_by(id: params[:post_id])
    render json: { error: '投稿が見つかりません' }, status: :not_found unless @post
  end

  def authenticate_user
    token = request.headers['Authorization']&.gsub('Bearer ', '')
    return render json: { error: '認証が必要です' }, status: :unauthorized unless token

    payload = JwtService.decode(token)
    return render json: { error: '無効なトークンです' }, status: :unauthorized unless payload

    @current_user = User.find_by(id: payload['user_id'])
    return render json: { error: 'ユーザーが見つかりません' }, status: :unauthorized unless @current_user
  rescue JWT::DecodeError
    render json: { error: '無効なトークンです' }, status: :unauthorized
  end

  def current_user
    @current_user
  end
end

