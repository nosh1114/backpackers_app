class ApiV1AdminController < ApplicationController
  before_action :authenticate_user
  before_action :check_admin

  def posts
    posts = Post.includes(:user, :country, :comments, :likes)
    
    # 検索機能
    if params[:q].present?
      search_term = "%#{params[:q]}%"
      posts = posts.where('posts.title ILIKE ? OR posts.content ILIKE ?', search_term, search_term)
    end

    # 国フィルター
    if params[:country_id].present?
      posts = posts.where(country_id: params[:country_id])
    end

    # カテゴリーフィルター
    if params[:category].present?
      posts = posts.where(category: params[:category])
    end
    
    # ソート
    case params[:sort]
    when 'recent'
      posts = posts.order(created_at: :desc)
    when 'popular'
      posts = posts.order(view_count: :desc, created_at: :desc)
    else
      posts = posts.order(created_at: :desc)
    end
    
    # ページネーション（30件ずつ）
    page = params[:page]&.to_i || 1
    per_page = params[:per_page]&.to_i || 30
    total_count = posts.count
    posts = posts.limit(per_page).offset(per_page * (page - 1))

    render json: {
      posts: posts.map do |post|
        {
          id: post.id,
          title: post.title,
          content: post.content,
          category: post.category,
          featured: post.featured || false,
          country: {
            id: post.country.id,
            name: post.country.name,
            flag_emoji: post.country.flag_emoji
          },
          user: {
            id: post.user.id,
            name: post.user.name,
            email: post.user.email
          },
          view_count: post.view_count || 0,
          likes_count: post.likes_count || post.likes.count,
          comments_count: post.comments.count,
          created_at: post.created_at,
          updated_at: post.updated_at
        }
      end,
      pagination: {
        page: page,
        per_page: per_page,
        total_count: total_count,
        total_pages: (total_count.to_f / per_page).ceil
      }
    }
  end

  def show_post
    post = Post.includes(:user, :country).find_by(id: params[:id])
    
    if post
      render json: {
        post: {
          id: post.id,
          title: post.title,
          content: post.content,
          category: post.category,
          featured: post.featured || false,
          country: {
            id: post.country.id,
            name: post.country.name,
            flag_emoji: post.country.flag_emoji
          },
          user: {
            id: post.user.id,
            name: post.user.name,
            email: post.user.email
          },
          view_count: post.view_count || 0,
          likes_count: post.likes_count || 0,
          created_at: post.created_at,
          updated_at: post.updated_at
        }
      }
    else
      render json: { error: '投稿が見つかりません' }, status: :not_found
    end
  end

  def update_post
    post = Post.find_by(id: params[:id])
    
    if post
      if post.update(post_params)
        render json: {
          post: {
            id: post.id,
            title: post.title,
            content: post.content,
            category: post.category,
            featured: post.featured || false,
            created_at: post.created_at,
            updated_at: post.updated_at
          }
        }
      else
        render json: { errors: post.errors.full_messages }, status: :unprocessable_entity
      end
    else
      render json: { error: '投稿が見つかりません' }, status: :not_found
    end
  end

  def delete_post
    post = Post.find_by(id: params[:id])
    
    if post
      post.destroy
      render json: { message: '投稿を削除しました' }
    else
      render json: { error: '投稿が見つかりません' }, status: :not_found
    end
  end

  def users
    users = User.all
    
    # 検索機能
    if params[:q].present?
      search_term = "%#{params[:q]}%"
      users = users.where('users.name ILIKE ? OR users.email ILIKE ?', search_term, search_term)
    end
    
    users = users.order(id: :asc)
    
    # ページネーション（30件ずつ）
    page = params[:page]&.to_i || 1
    per_page = params[:per_page]&.to_i || 30
    total_count = users.count
    users = users.limit(per_page).offset(per_page * (page - 1))
    
    render json: {
      users: users.map do |user|
        {
          id: user.id,
          name: user.name,
          email: user.email,
          bio: user.bio,
          avatar_url: user.avatar_url,
          admin: user.admin?,
          posts_count: user.posts.count,
          created_at: user.created_at,
          updated_at: user.updated_at
        }
      end,
      pagination: {
        page: page,
        per_page: per_page,
        total_count: total_count,
        total_pages: (total_count.to_f / per_page).ceil
      }
    }
  end

  def show_user
    target_user = User.find_by(id: params[:id])
    
    if target_user
      # ユーザーの投稿一覧も取得
      posts = target_user.posts.includes(:country).order(created_at: :desc)
      
      render json: {
        user: {
          id: target_user.id,
          name: target_user.name,
          email: target_user.email,
          bio: target_user.bio,
          avatar_url: target_user.avatar_url,
          admin: target_user.admin?,
          created_at: target_user.created_at,
          updated_at: target_user.updated_at,
          posts: posts.map do |post|
            {
              id: post.id,
              title: post.title,
              category: post.category,
              featured: post.featured || false,
              country: {
                id: post.country.id,
                name: post.country.name,
                flag_emoji: post.country.flag_emoji
              },
              view_count: post.view_count || 0,
              created_at: post.created_at
            }
          end
        }
      }
    else
      render json: { error: 'ユーザーが見つかりません' }, status: :not_found
    end
  end

  def update_user
    target_user = User.find_by(id: params[:id])
    
    if target_user
      if target_user.update(user_params)
        render json: {
          user: {
            id: target_user.id,
            name: target_user.name,
            email: target_user.email,
            bio: target_user.bio,
            avatar_url: target_user.avatar_url,
            admin: target_user.admin?,
            created_at: target_user.created_at,
            updated_at: target_user.updated_at
          }
        }
      else
        render json: { errors: target_user.errors.full_messages }, status: :unprocessable_entity
      end
    else
      render json: { error: 'ユーザーが見つかりません' }, status: :not_found
    end
  end

  def delete_user
    target_user = User.find_by(id: params[:id])
    
    if target_user
      target_user.destroy
      render json: { message: 'ユーザーを削除しました' }
    else
      render json: { error: 'ユーザーが見つかりません' }, status: :not_found
    end
  end

  # お問い合わせ管理
  def contacts
    contacts = Contact.all
    
    # フィルター
    if params[:status].present?
      contacts = contacts.where(status: params[:status])
    end
    
    if params[:unread] == 'true'
      contacts = contacts.unread
    end
    
    contacts = contacts.order(created_at: :desc)
    
    # ページネーション
    page = params[:page]&.to_i || 1
    per_page = params[:per_page]&.to_i || 30
    total_count = contacts.count
    contacts = contacts.limit(per_page).offset(per_page * (page - 1))
    
    render json: {
      contacts: contacts.map do |contact|
        {
          id: contact.id,
          name: contact.name,
          email: contact.email,
          subject: contact.subject,
          message: contact.message,
          status: contact.status,
          read: contact.read,
          created_at: contact.created_at,
          updated_at: contact.updated_at
        }
      end,
      pagination: {
        page: page,
        per_page: per_page,
        total_count: total_count,
        total_pages: (total_count.to_f / per_page).ceil
      },
      unread_count: Contact.unread.count
    }
  end

  def update_contact
    contact = Contact.find_by(id: params[:id])
    
    if contact
      if contact.update(contact_params)
        render json: {
          contact: {
            id: contact.id,
            name: contact.name,
            email: contact.email,
            subject: contact.subject,
            message: contact.message,
            status: contact.status,
            read: contact.read,
            created_at: contact.created_at,
            updated_at: contact.updated_at
          }
        }
      else
        render json: { errors: contact.errors.full_messages }, status: :unprocessable_entity
      end
    else
      render json: { error: 'お問い合わせが見つかりません' }, status: :not_found
    end
  end

  def delete_contact
    contact = Contact.find_by(id: params[:id])
    
    if contact
      contact.destroy
      render json: { message: 'お問い合わせを削除しました' }
    else
      render json: { error: 'お問い合わせが見つかりません' }, status: :not_found
    end
  end

  private

  def authenticate_user
    token = request.headers['Authorization']&.gsub('Bearer ', '')
    return render json: { error: '認証が必要です' }, status: :unauthorized unless token

    payload = JWT.decode(token, Rails.application.secret_key_base, true, algorithm: 'HS256').first
    return render json: { error: '無効なトークンです' }, status: :unauthorized unless payload

    @current_user = User.find_by(id: payload['user_id'])
    return render json: { error: 'ユーザーが見つかりません' }, status: :unauthorized unless @current_user
  rescue JWT::DecodeError
    render json: { error: '無効なトークンです' }, status: :unauthorized
  end

  def current_user
    @current_user
  end

  def check_admin
    unless current_user&.admin?
      render json: { error: '管理者権限が必要です' }, status: :forbidden
    end
  end

  def post_params
    params.require(:post).permit(:title, :content, :category, :featured, :country_id)
  end

  def user_params
    params.require(:user).permit(:name, :email, :bio, :admin)
  end

  def contact_params
    params.require(:contact).permit(:status, :read)
  end
end

