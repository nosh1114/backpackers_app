class ApiV1AuthController < ApplicationController
  def login
    email = params[:email]
    password = params[:password]

    user = User.find_by(email: email)
    
    if user&.authenticate(password)
      token = JwtService.generate_token(user)
      render json: {
        token: token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          bio: user.bio,
          location: user.location,
          website: user.website,
          avatar_url: user.avatar_url
        }
      }
    else
      render json: { error: 'メールアドレスまたはパスワードが正しくありません' }, status: :unauthorized
    end
  end

  def signup
    user = User.new(user_params)
    
    if user.save
      token = JwtService.generate_token(user)
      render json: {
        token: token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          bio: user.bio,
          location: user.location,
          website: user.website,
          avatar_url: user.avatar_url
        }
      }, status: :created
    else
      render json: { errors: user.errors.full_messages }, status: :unprocessable_entity
    end
  end

  private

  def user_params
    params.require(:user).permit(:name, :email, :password, :password_confirmation, :bio, :location, :website, :avatar_url)
  end
end
