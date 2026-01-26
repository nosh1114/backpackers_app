class UserMailer < ApplicationMailer
  # パスワードリセットメール
  def password_reset(user)
    @user = user
    @reset_url = "#{frontend_url}/password-reset?token=#{user.reset_password_token}"
    
    mail(
      to: @user.email,
      subject: '【Backpacker Tips】パスワードリセットのご案内'
    )
  end

  # メール確認メール
  def email_confirmation(user)
    @user = user
    @confirmation_url = "#{frontend_url}/confirm-email?token=#{user.confirmation_token}"
    
    mail(
      to: @user.email,
      subject: '【Backpacker Tips】メールアドレスの確認'
    )
  end

  private

  def frontend_url
    Rails.env.production? ? 'https://backpacker-tips.com' : 'http://localhost:5173'
  end
end
