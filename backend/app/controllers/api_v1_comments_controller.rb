class ApiV1CommentsController < ApplicationController
  before_action :authenticate_user, except: [:index]
  before_action :set_post

  def index
    comments = @post.comments.includes(:user).order(created_at: :desc)
    
    render json: {
      comments: comments.map do |comment|
        {
          id: comment.id,
          content: comment.content,
          user: {
            id: comment.user.id,
            name: comment.user.name,
            avatar_url: comment.user.avatar_url,
            email: comment.user.email
          },
          created_at: comment.created_at,
          updated_at: comment.updated_at
        }
      end
    }
  end

  def create
    comment = @post.comments.build(comment_params)
    comment.user = current_user

    if comment.save
      render json: {
        comment: {
          id: comment.id,
          content: comment.content,
          user: {
            id: comment.user.id,
            name: comment.user.name,
            avatar_url: comment.user.avatar_url,
            email: comment.user.email
          },
          created_at: comment.created_at,
          updated_at: comment.updated_at
        }
      }, status: :created
    else
      render json: { errors: comment.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def update
    comment = @post.comments.find_by(id: params[:id])
    
    if comment.nil?
      render json: { error: 'コメントが見つかりません' }, status: :not_found
    elsif comment.user_id != current_user.id && !current_user.admin?
      render json: { error: '編集権限がありません' }, status: :forbidden
    elsif comment.update(comment_params)
      render json: {
        comment: {
          id: comment.id,
          content: comment.content,
          user: {
            id: comment.user.id,
            name: comment.user.name,
            avatar_url: comment.user.avatar_url,
            email: comment.user.email
          },
          created_at: comment.created_at,
          updated_at: comment.updated_at
        }
      }
    else
      render json: { errors: comment.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def destroy
    comment = @post.comments.find_by(id: params[:id])
    
    if comment.nil?
      render json: { error: 'コメントが見つかりません' }, status: :not_found
    elsif comment.user_id != current_user.id && !current_user.admin?
      render json: { error: '削除権限がありません' }, status: :forbidden
    else
      comment.destroy
      render json: { message: 'コメントを削除しました' }
    end
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

  def comment_params
    params.require(:comment).permit(:content)
  end
end

