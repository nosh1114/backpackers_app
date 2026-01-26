class ApiV1AuthController < ApplicationController
  def login
    email = params[:email]
    password = params[:password]

    user = User.find_by(email: email)
    
    if user&.authenticate(password)
      # メール未確認の場合は警告を返す（ログインは許可）
      token = JwtService.generate_token(user)
      render json: {
        token: token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          bio: user.bio,
          avatar_url: user.avatar_url,
          admin: user.admin?,
          email_confirmed: user.email_confirmed?
        },
        warning: user.email_confirmed? ? nil : 'メールアドレスが未確認です。確認メールを送信してください。'
      }
    else
      render json: { error: 'メールアドレスまたはパスワードが正しくありません' }, status: :unauthorized
    end
  end

  def signup
    user = User.new(user_params)
    
    if user.save
      # 確認メールを送信（after_commitで送信されるが、念のため明示的に送信）
      begin
        user.send_confirmation_email_async
      rescue => e
        Rails.logger.error "Failed to send confirmation email: #{e.message}"
        # メール送信エラーでもユーザー作成は成功させる
      end
      
      token = JwtService.generate_token(user)
      render json: {
        token: token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          bio: user.bio,
          avatar_url: user.avatar_url,
          admin: user.admin?,
          email_confirmed: false
        },
        message: '登録が完了しました。確認メールをお送りしましたので、メールアドレスを確認してください。'
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
      user.send_password_reset_email!
      Rails.logger.info "Password reset email sent to #{email}"
      
      render json: { 
        message: 'パスワードリセットのメールを送信しました。メールをご確認ください。',
        # 開発環境のみトークンを返す（本番では削除）
        token: Rails.env.development? ? user.reset_password_token : nil
      }
    else
      # セキュリティのため、ユーザーが存在しなくても同じメッセージを返す
      render json: { message: 'パスワードリセットのメールを送信しました。メールをご確認ください。' }
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

  # メールアドレス確認
  def confirm_email
    token = params[:token]

    if token.blank?
      return render json: { error: 'トークンが必要です' }, status: :bad_request
    end

    user = User.find_by(confirmation_token: token)

    if user.nil?
      return render json: { error: '無効なトークンです' }, status: :bad_request
    end

    if user.email_confirmed?
      return render json: { message: 'メールアドレスは既に確認済みです' }
    end

    if user.confirmation_expired?
      return render json: { error: 'トークンの有効期限が切れています。確認メールを再送してください' }, status: :bad_request
    end

    user.confirm_email!
    render json: { message: 'メールアドレスが確認されました。ログインしてください。' }
  end

  # 確認メール再送
  def resend_confirmation
    email = params[:email]

    if email.blank?
      return render json: { error: 'メールアドレスを入力してください' }, status: :bad_request
    end

    user = User.find_by(email: email)

    if user.nil?
      # セキュリティのため、ユーザーが存在しなくても同じメッセージを返す
      return render json: { message: '確認メールを再送しました。メールをご確認ください。' }
    end

    if user.email_confirmed?
      return render json: { error: 'メールアドレスは既に確認済みです' }, status: :bad_request
    end

    user.resend_confirmation_email!
    Rails.logger.info "Confirmation email resent to #{email}"
    
    render json: { 
      message: '確認メールを再送しました。メールをご確認ください。',
      # 開発環境のみトークンを返す（本番では削除）
      token: Rails.env.development? ? user.confirmation_token : nil
    }
  end

  private

  def user_params
    # フロントエンドから送信される正しいパラメータを取得
    # フロントエンドは { user: { name, email, password, password_confirmation } } の形式で送信
    params.require(:user).permit(:name, :email, :password, :password_confirmation, :bio, :avatar_url)
  end
end
