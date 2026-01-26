# Be sure to restart your server when you modify this file.

# Avoid CORS issues when API is called from the frontend app.
# Handle Cross-Origin Resource Sharing (CORS) in order to accept cross-origin Ajax requests.

# Read more: https://github.com/cyu/rack-cors

Rails.application.config.middleware.insert_before 0, Rack::Cors do
  allow do
    # 開発環境
    origins_env = [
      'http://localhost:5173',
      'http://127.0.0.1:5173',
      'http://localhost:5174',
      'http://127.0.0.1:5174'
    ]
    
    # 本番環境
    if Rails.env.production?
      # 環境変数から取得
      if ENV['FRONTEND_URL'].present?
        origins_env << ENV['FRONTEND_URL']
      end
      
      # RenderのURLパターンを明示的に許可
      # 正規表現ではなく、文字列マッチングを使用
      origins_env << 'https://backpackers-app.onrender.com'
      origins_env << 'https://backpackers-app-frontend.onrender.com'
      
      # カスタムドメイン（bappa.jp）
      origins_env << 'https://bappa.jp'
      origins_env << 'https://www.bappa.jp'
      
      # RenderのURLパターン（正規表現も試す）
      # ただし、rack-corsは正規表現をサポートしているので、これも追加
      origins_env << /https:\/\/.*\.onrender\.com/
    end
    
    origins origins_env

    resource '*',
      headers: :any,
      methods: [:get, :post, :put, :patch, :delete, :options, :head],
      credentials: false,
      expose: ['Authorization']
  end
end
