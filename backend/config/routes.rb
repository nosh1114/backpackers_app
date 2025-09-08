Rails.application.routes.draw do
  # API routes - 直接コントローラー名で指定
  post '/api/v1/auth/login', to: 'api_v1_auth#login'
  post '/api/v1/auth/signup', to: 'api_v1_auth#signup'
  
  get '/api/v1/users', to: 'api_v1_users#index'
  get '/api/v1/users/profile', to: 'api_v1_users#profile'  # 具体的なルートを先に定義
  get '/api/v1/users/:id', to: 'api_v1_users#show'         # 動的ルートを後に定義
  post '/api/v1/users', to: 'api_v1_users#create'
  put '/api/v1/users', to: 'api_v1_users#update'
  delete '/api/v1/users', to: 'api_v1_users#destroy'
  
  get '/api/v1/posts', to: 'api_v1_posts#index'
  get '/api/v1/posts/:id', to: 'api_v1_posts#show'
  post '/api/v1/posts', to: 'api_v1_posts#create'
  put '/api/v1/posts/:id', to: 'api_v1_posts#update'
  delete '/api/v1/posts/:id', to: 'api_v1_posts#destroy'
  
  get '/api/v1/countries', to: 'api_v1_countries#index'

  # Health check
  get "up" => "rails/health#show", as: :rails_health_check
end
