Rails.application.routes.draw do
  # API routes - 直接コントローラー名で指定
  post '/api/v1/auth/login', to: 'api_v1_auth#login'
  post '/api/v1/auth/signup', to: 'api_v1_auth#signup'
  post '/api/v1/auth/password_reset', to: 'api_v1_auth#request_password_reset'
  post '/api/v1/auth/password_reset/confirm', to: 'api_v1_auth#reset_password'
  
  get '/api/v1/users', to: 'api_v1_users#index'
  get '/api/v1/users/profile', to: 'api_v1_users#profile'  # 具体的なルートを先に定義
  get '/api/v1/users/:id', to: 'api_v1_users#show'         # 動的ルートを後に定義
  get '/api/v1/users/:id/posts', to: 'api_v1_users#posts'  # ユーザーの投稿一覧
  post '/api/v1/users', to: 'api_v1_users#create'
  put '/api/v1/users', to: 'api_v1_users#update'
  delete '/api/v1/users', to: 'api_v1_users#destroy'
  
  get '/api/v1/posts', to: 'api_v1_posts#index'
  get '/api/v1/posts/categories', to: 'api_v1_posts#categories'
  get '/api/v1/posts/search', to: 'api_v1_posts#search'  # 動的ルートの前に定義
  get '/api/v1/posts/:id', to: 'api_v1_posts#show'
  post '/api/v1/posts', to: 'api_v1_posts#create'
  put '/api/v1/posts/:id', to: 'api_v1_posts#update'
  delete '/api/v1/posts/:id', to: 'api_v1_posts#destroy'
  
  # Comments
  get '/api/v1/posts/:post_id/comments', to: 'api_v1_comments#index'
  post '/api/v1/posts/:post_id/comments', to: 'api_v1_comments#create'
  put '/api/v1/posts/:post_id/comments/:id', to: 'api_v1_comments#update'
  delete '/api/v1/posts/:post_id/comments/:id', to: 'api_v1_comments#destroy'
  
  # Likes
  post '/api/v1/posts/:post_id/like', to: 'api_v1_likes#toggle'
  get '/api/v1/posts/:post_id/like/status', to: 'api_v1_likes#status'
  
  # Bookmarks
  get '/api/v1/bookmarks', to: 'api_v1_bookmarks#index'
  post '/api/v1/posts/:post_id/bookmark', to: 'api_v1_bookmarks#create'
  delete '/api/v1/posts/:post_id/bookmark', to: 'api_v1_bookmarks#destroy'
  get '/api/v1/posts/:post_id/bookmark/status', to: 'api_v1_bookmarks#status'
  
  get '/api/v1/countries', to: 'api_v1_countries#index'
  get '/api/v1/countries/stats', to: 'api_v1_countries#stats'
  get '/api/v1/countries/by_areas', to: 'api_v1_countries#by_areas'

  # Contact
  post '/api/v1/contacts', to: 'api_v1_contacts#create'

  # Admin API
  get '/api/v1/admin/posts', to: 'api_v1_admin#posts'
  get '/api/v1/admin/posts/:id', to: 'api_v1_admin#show_post'
  put '/api/v1/admin/posts/:id', to: 'api_v1_admin#update_post'
  delete '/api/v1/admin/posts/:id', to: 'api_v1_admin#delete_post'
  get '/api/v1/admin/users', to: 'api_v1_admin#users'
  get '/api/v1/admin/users/:id', to: 'api_v1_admin#show_user'
  put '/api/v1/admin/users/:id', to: 'api_v1_admin#update_user'
  delete '/api/v1/admin/users/:id', to: 'api_v1_admin#delete_user'
  get '/api/v1/admin/contacts', to: 'api_v1_admin#contacts'
  put '/api/v1/admin/contacts/:id', to: 'api_v1_admin#update_contact'
  delete '/api/v1/admin/contacts/:id', to: 'api_v1_admin#delete_contact'

  # Health check
  get "up" => "rails/health#show", as: :rails_health_check
end
