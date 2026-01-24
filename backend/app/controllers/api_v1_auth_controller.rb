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
          avatar_url: user.avatar_url,
          admin: user.admin?
        }
      }
    else
      render json: { error: 'メールアドレスまたはパスワードが正しくありません' }, status: :unauthorized
    end
  end

  def signup
    Rails.logger.debug "Signup params: #{params.inspect}"
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
          avatar_url: user.avatar_url,
          admin: user.admin?
        }
      }, status: :created
    else
      render json: { errors: user.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def request_password_reset
    email = params[:email]
    
    if email.blank?
      return render json: { error: 'メールアドレスを入力してください' }, status: :bad_request
    end

    user = User.find_by(email: email)
    
    if user
      user.generate_password_reset_token!
      # 本番環境ではメールを送信するが、今は開発用にトークンを返す
      # TODO: ActionMailerでメール送信を実装
      Rails.logger.info "Password reset token for #{email}: #{user.reset_password_token}"
      
      render json: { 
        message: 'パスワードリセットの手続きを開始しました。',
        # 開発環境のみトークンを返す（本番では削除）
        token: Rails.env.development? ? user.reset_password_token : nil
      }
    else
      # セキュリティのため、ユーザーが存在しなくても同じメッセージを返す
      render json: { message: 'パスワードリセットの手続きを開始しました。' }
    end
  end

  def reset_password
    token = params[:token]
    password = params[:password]
    password_confirmation = params[:password_confirmation]

    if token.blank?
      return render json: { error: 'トークンが必要です' }, status: :bad_request
    end

    if password.blank? || password_confirmation.blank?
      return render json: { error: 'パスワードと確認用パスワードを入力してください' }, status: :bad_request
    end

    if password != password_confirmation
      return render json: { error: 'パスワードと確認用パスワードが一致しません' }, status: :bad_request
    end

    if password.length < 8
      return render json: { error: 'パスワードは8文字以上で入力してください' }, status: :bad_request
    end

    user = User.find_by(reset_password_token: token)

    if user.nil?
      return render json: { error: '無効なトークンです' }, status: :bad_request
    end

    if user.password_reset_expired?
      return render json: { error: 'トークンの有効期限が切れています。もう一度パスワードリセットを申請してください' }, status: :bad_request
    end

    user.password = password
    user.password_confirmation = password_confirmation
    
    if user.save(context: :password_reset)
      user.clear_password_reset_token!
      render json: { message: 'パスワードを更新しました。新しいパスワードでログインしてください。' }
    else
      render json: { error: user.errors.full_messages.join(', ') }, status: :unprocessable_entity
    end
  end

  private

  def user_params
    # フロントエンドから送信される正しいパラメータを取得
    # フロントエンドは { user: { name, email, password, password_confirmation } } の形式で送信
    params.require(:user).permit(:name, :email, :password, :password_confirmation, :bio, :avatar_url)
  end
end
