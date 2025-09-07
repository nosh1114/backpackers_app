Rails.application.routes.draw do
  # API routes
  namespace :api do
    namespace :v1 do
      # Auth routes
      post 'auth/login', to: 'auth#login'
      post 'auth/signup', to: 'auth#signup'
      
      # User routes
      resources :users, only: [:index, :show, :create, :update, :destroy] do
        get 'profile', on: :collection
      end
      
      # Post routes
      resources :posts, only: [:index, :show, :create, :update, :destroy]
      
      # Country routes
      get 'countries', to: 'countries#index'
    end
  end

  # Health check
  get "up" => "rails/health#show", as: :rails_health_check
end
