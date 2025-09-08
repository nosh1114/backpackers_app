class JwtService
  SECRET_KEY = Rails.application.credentials.secret_key_base || 'fallback_secret_key'
  ALGORITHM = 'HS256'

  def self.encode(payload)
    # 有効期限を設定（24時間）
    payload[:exp] = 24.hours.from_now.to_i unless payload[:exp]
    JWT.encode(payload, SECRET_KEY, ALGORITHM)
  end

  def self.decode(token)
    JWT.decode(token, SECRET_KEY, true, { algorithm: ALGORITHM })[0]
  rescue JWT::DecodeError, JWT::ExpiredSignature
    nil
  end

  def self.generate_token(user)
    payload = {
      user_id: user.id,
      email: user.email
    }
    encode(payload)
  end
end 