# frozen_string_literal: true

class User < ApplicationRecord
  has_secure_password

  # 関連付け
  has_many :posts, dependent: :destroy
  has_many :comments, dependent: :destroy
  has_many :likes, dependent: :destroy
  has_many :bookmarks, dependent: :destroy
  has_many :bookmarked_posts, through: :bookmarks, source: :post

  # バリデーション
  validates :email, presence: true, uniqueness: true, format: { with: URI::MailTo::EMAIL_REGEXP }
  validates :name, presence: true, length: { minimum: 2, maximum: 50 }
  validates :password, presence: true, length: { minimum: 8 }, on: :create
  validates :password_confirmation, presence: true, on: :create
  validates :password, presence: true, length: { minimum: 8 }, on: :password_reset
  validates :password_confirmation, presence: true, on: :password_reset

  # コールバック
  after_create :generate_confirmation_token_on_create

  # =====================
  # パスワードリセット機能
  # =====================
  def generate_password_reset_token!
    self.reset_password_token = SecureRandom.urlsafe_base64(32)
    self.reset_password_sent_at = Time.current
    save!
  end

  def password_reset_expired?
    reset_password_sent_at < 1.hour.ago
  end

  def clear_password_reset_token!
    self.reset_password_token = nil
    self.reset_password_sent_at = nil
    save!
  end

  def send_password_reset_email!
    generate_password_reset_token!
    UserMailer.password_reset(self).deliver_now
  end

  # =====================
  # メール認証機能
  # =====================
  def generate_confirmation_token!
    self.confirmation_token = SecureRandom.urlsafe_base64(32)
    self.confirmation_sent_at = Time.current
    save!
  end

  def confirmation_expired?
    return true if confirmation_sent_at.nil?
    confirmation_sent_at < 24.hours.ago
  end

  def confirm_email!
    self.email_confirmed = true
    self.confirmation_token = nil
    self.confirmation_sent_at = nil
    save!
  end

  def generate_confirmation_token_on_create
    self.confirmation_token = SecureRandom.urlsafe_base64(32)
    self.confirmation_sent_at = Time.current
  end

  def send_confirmation_email_async
    # 開発環境では同期的に送信、本番環境では非同期
    if Rails.env.development?
      UserMailer.email_confirmation(self).deliver_now
    else
      UserMailer.email_confirmation(self).deliver_later
    end
  rescue => e
    # メール送信エラーをログに記録するが、ユーザー作成は成功させる
    Rails.logger.error "Failed to send confirmation email: #{e.message}"
    Rails.logger.error e.backtrace.join("\n")
  end

  def send_confirmation_email
    generate_confirmation_token!
    send_confirmation_email_async
  end

  def resend_confirmation_email!
    generate_confirmation_token!
    send_confirmation_email_async
  end

  def email_confirmed?
    email_confirmed == true
  end

  def admin?
    admin == true
  end
end
