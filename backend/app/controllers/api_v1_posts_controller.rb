class ApiV1PostsController < ApplicationController
  before_action :authenticate_user, except: [:index, :show]

  def index
    posts = Post.includes(:user).order(created_at: :desc)
    posts = posts.where(country_code: params[:country_code]) if params[:country_code].present?
    
    # ページネーション
    if params[:page] && params[:per_page]
      page = params[:page].to_i
      per_page = params[:per_page].to_i
      posts = posts.limit(per_page).offset(per_page * (page - 1))
    end

    render json: {
      posts: posts.map do |post|
        {
          id: post.id,
          title: post.title,
          content: post.content,
          country_code: post.country_code,
          user: {
            id: post.user.id,
            name: post.user.name,
            avatar_url: post.user.avatar_url
          },
          created_at: post.created_at,
          updated_at: post.updated_at
        }
      end
    }
  end

  def show
    post = Post.includes(:user).find_by(id: params[:id])
    
    if post
      render json: {
        post: {
          id: post.id,
          title: post.title,
          content: post.content,
          country_code: post.country_code,
          user: {
            id: post.user.id,
            name: post.user.name,
            avatar_url: post.user.avatar_url
          },
          created_at: post.created_at,
          updated_at: post.updated_at
        }
      }
    else
      render json: { error: '投稿が見つかりません' }, status: :not_found
    end
  end

  def create
    # デバッグログを追加
    Rails.logger.debug "Raw params: #{params.inspect}"
    Rails.logger.debug "Post params: #{params[:post].inspect}"
    
    post = current_user.posts.build(post_params)
    
    Rails.logger.debug "Post params: #{post.inspect}"
    if post.save
      render json: {
        post: {
          id: post.id,
          title: post.title,
          content: post.content,
          country_code: post.country_code,
          user: {
            id: post.user.id,
            name: post.user.name,
            avatar_url: post.user.avatar_url
          },
          created_at: post.created_at,
          updated_at: post.updated_at
        }
      }, status: :created
    else
      render json: { errors: post.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def update
    post = current_user.posts.find_by(id: params[:id])
    
    if post
      if post.update(post_params)
        render json: {
          post: {
            id: post.id,
            title: post.title,
            content: post.content,
            country_code: post.country_code,
            user: {
              id: post.user.id,
              name: post.user.name,
              avatar_url: post.user.avatar_url
            },
            created_at: post.created_at,
            updated_at: post.updated_at
          }
        }
      else
        render json: { errors: post.errors.full_messages }, status: :unprocessable_entity
      end
    else
      render json: { error: '投稿が見つかりません' }, status: :not_found
    end
  end

  def destroy
    post = current_user.posts.find_by(id: params[:id])
    
    if post
      post.destroy
      render json: { message: '投稿を削除しました' }
    else
      render json: { error: '投稿が見つかりません' }, status: :not_found
    end
  end

  private

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

  def post_params
    # フロントエンドから送信された元のpostパラメーターを使用
    params.require(:post).permit(:title, :content, :country_code, :category)
  end
end
