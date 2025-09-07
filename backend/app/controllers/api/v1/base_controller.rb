class Api::V1::BaseController < ApplicationController
  before_action :authenticate_user

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
end
