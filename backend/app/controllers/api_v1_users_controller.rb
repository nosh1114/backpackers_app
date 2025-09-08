class ApiV1UsersController < ApplicationController
  before_action :authenticate_user, except: [:create]

  def index
    users = User.all.order(id: :asc)
    
    # ページネーション
    if params[:page] && params[:per_page]
      page = params[:page].to_i
      per_page = params[:per_page].to_i
      users = users.limit(per_page).offset(per_page * (page - 1))
    end

    render json: {
      users: users.map do |user|
        {
          id: user.id,
          name: user.name,
          email: user.email,
          bio: user.bio,
          location: user.location,
          website: user.website,
          avatar_url: user.avatar_url,
          created_at: user.created_at,
          updated_at: user.updated_at
        }
      end
    }
  end

  def show
    user = User.find_by(id: params[:id])
    
    if user
      render json: {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          bio: user.bio,
          location: user.location,
          website: user.website,
          avatar_url: user.avatar_url,
          created_at: user.created_at,
          updated_at: user.updated_at
        }
      }
    else
      render json: { error: 'ユーザーが見つかりません' }, status: :not_found
    end
  end

  def profile
    render json: {
      user: {
        id: current_user.id,
        name: current_user.name,
        email: current_user.email,
        bio: current_user.bio,
        location: current_user.location,
        website: current_user.website,
        avatar_url: current_user.avatar_url,
        created_at: current_user.created_at,
        updated_at: current_user.updated_at
      }
    }
  end

  def create
    user = User.new(user_params)
    
    if user.save
      render json: {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          bio: user.bio,
          location: user.location,
          website: user.website,
          avatar_url: user.avatar_url,
          created_at: user.created_at,
          updated_at: user.updated_at
        }
      }, status: :created
    else
      render json: { errors: user.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def update
    if current_user.update(user_params)
      render json: {
        user: {
          id: current_user.id,
          name: current_user.name,
          email: current_user.email,
          bio: current_user.bio,
          location: current_user.location,
          website: current_user.website,
          avatar_url: current_user.avatar_url,
          created_at: current_user.created_at,
          updated_at: current_user.updated_at
        }
      }
    else
      render json: { errors: current_user.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def destroy
    current_user.destroy
    render json: { message: 'ユーザーを削除しました' }
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

  def user_params
    params.require(:user).permit(:name, :email, :password, :password_confirmation, :bio, :location, :website, :avatar_url)
  end
end
