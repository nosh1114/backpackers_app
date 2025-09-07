# frozen_string_literal: true

class User < ApplicationRecord
  has_secure_password

  # 関連付け
  has_many :posts, dependent: :destroy

  # バリデーション
  validates :email, presence: true, uniqueness: true, format: { with: URI::MailTo::EMAIL_REGEXP }
  validates :name, presence: true, length: { minimum: 2, maximum: 50 }
  validates :password, presence: true, length: { minimum: 8 }, on: :create
  validates :password_confirmation, presence: true, on: :create

  # パスワードの複雑性チェックを削除
  # validate :password_complexity, on: :create

  # パスワードリセット機能
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

  private

  # password_complexityメソッドを削除
  # def password_complexity
  #   return if password.blank?
  #   unless password.match?(/\A(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}\z/)
  #     errors.add(:password, 'は8文字以上で入力してください')
  #   end
  # end
end
