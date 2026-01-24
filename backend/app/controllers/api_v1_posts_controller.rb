class ApiV1PostsController < ApplicationController
  before_action :authenticate_user, except: [:index, :show, :search, :categories]

  def index
    posts = Post.includes(:user, :country, :comments, :likes)
    posts = posts.where(country_id: params[:country_id]) if params[:country_id].present?
    
    # 特集記事フィルター
    if params[:featured].present?
      featured_value = params[:featured].to_s.downcase
      if featured_value == 'true' || featured_value == '1'
        posts = posts.where(featured: true)
      end
    end
    
    # カテゴリーフィルター（複数対応）
    if params[:category].present?
      # category[]形式の配列パラメータまたは単一のcategoryパラメータに対応
      categories = if params[:category].is_a?(Array)
        params[:category]
      elsif params[:'category[]'].present?
        params[:'category[]']
      else
        [params[:category]]
      end
      posts = posts.where(category: categories)
    end
    
    # ソート機能
    case params[:sort]
    when 'recent'
      posts = posts.recent
    when 'popular', nil
      # デフォルトは人気順（view数順）
      # featuredを優先し、その後view数順
      posts = posts.order(featured: :desc, view_count: :desc, created_at: :desc)
    else
      posts = posts.recent
    end
    
    # 総件数を取得（ページネーション前）
    total_count = posts.count
    
    # ページネーション
    page = params[:page]&.to_i || 1
    per_page = params[:per_page]&.to_i || 20
    posts = posts.limit(per_page).offset(per_page * (page - 1))

    render json: {
      posts: posts.map do |post|
        {
          id: post.id,
          title: post.title,
          content: post.content,
          category: post.category,
          featured: post.featured || false,
          images: post.image_urls,
          country: {
            id: post.country.id,
            code: post.country.code,
            name: post.country.name,
            flag_emoji: post.country.flag_emoji,
            image_url: post.country.image_url
          },
          user: {
            id: post.user.id,
            name: post.user.name,
            avatar_url: post.user.avatar_url,
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

  def show
    post = Post.includes(:user, :country, :comments, :likes).find_by(id: params[:id])
    
    if post
      # view数をインクリメント（count_view=falseの場合はスキップ）
      unless params[:count_view] == 'false'
        post.increment_view_count!
      end
      
      render json: {
        post: {
          id: post.id,
          title: post.title,
          content: post.content,
          category: post.category,
          featured: post.featured || false,
          images: post.image_urls,
          country: {
            id: post.country.id,
            code: post.country.code,
            name: post.country.name,
            flag_emoji: post.country.flag_emoji,
            image_url: post.country.image_url
          },
          user: {
            id: post.user.id,
            name: post.user.name,
            avatar_url: post.user.avatar_url,
            email: post.user.email
          },
          view_count: post.view_count || 0,
          likes_count: post.likes_count || post.likes.count,
          comments_count: post.comments.count,
          comments: post.comments.order(created_at: :desc).map do |comment|
            {
              id: comment.id,
              content: comment.content,
              user: {
                id: comment.user.id,
                name: comment.user.name,
                avatar_url: comment.user.avatar_url,
                email: comment.user.email
              },
              created_at: comment.created_at
            }
          end,
          created_at: post.created_at,
          updated_at: post.updated_at
        }
      }
    else
      render json: { error: '投稿が見つかりません' }, status: :not_found
    end
  end

  def create
    post = current_user.posts.build(post_params)
    
    if post.save
      render json: {
        post: {
          id: post.id,
          title: post.title,
          content: post.content,
          category: post.category,
          featured: post.featured || false,
          images: post.image_urls,
          country: {
            id: post.country.id,
            code: post.country.code,
            name: post.country.name,
            flag_emoji: post.country.flag_emoji,
            image_url: post.country.image_url
          },
          user: {
            id: post.user.id,
            name: post.user.name,
            avatar_url: post.user.avatar_url,
            email: post.user.email
          },
          view_count: post.view_count || 0,
          likes_count: post.likes_count || 0,
          comments_count: post.comments.count,
          created_at: post.created_at,
          updated_at: post.updated_at
        }
      }, status: :created
    else
      render json: { errors: post.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def update
    post = current_user.posts.find_by(id: params[:id])
    
    if post
      if post.update(post_params)
        render json: {
          post: {
            id: post.id,
            title: post.title,
            content: post.content,
            category: post.category,
            featured: post.featured || false,
            images: post.image_urls,
            country: {
              id: post.country.id,
              code: post.country.code,
              name: post.country.name,
              flag_emoji: post.country.flag_emoji,
              image_url: post.country.image_url
            },
            user: {
              id: post.user.id,
              name: post.user.name,
              avatar_url: post.user.avatar_url,
              email: post.user.email
            },
            view_count: post.view_count || 0,
            likes_count: post.likes_count || post.likes.count,
            comments_count: post.comments.count,
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

  def destroy
    post = current_user.posts.find_by(id: params[:id])
    
    if post
      post.destroy
      render json: { message: '投稿を削除しました' }
    else
      render json: { error: '投稿が見つかりません' }, status: :not_found
    end
  end

  def search
    Rails.logger.debug "検索パラメータ: #{params.inspect}"
    Rails.logger.debug "検索キーワード: #{params[:q]}"
    
    # 検索クエリが空の場合は空配列を返す
    if params[:q].blank?
      render json: { posts: [] }
      return
    end
    
    search_term = "%#{params[:q]}%"
    posts = Post.includes(:user, :country)
                .left_outer_joins(:country)
                .where('posts.title ILIKE ? OR posts.content ILIKE ? OR countries.name ILIKE ?', 
                       search_term, search_term, search_term)
                .order(created_at: :desc)
    
    Rails.logger.debug "検索結果数: #{posts.count}"
    
    render json: {
      posts: posts.map do |post|
        {
          id: post.id,
          title: post.title,
          content: post.content,
          category: post.category,
          featured: post.featured || false,
          images: post.image_urls,
          country: post.country ? {
            id: post.country.id,
            code: post.country.code,
            name: post.country.name,
            flag_emoji: post.country.flag_emoji,
            image_url: post.country.image_url
          } : nil,
          user: {
            id: post.user.id,
            name: post.user.name,
            avatar_url: post.user.avatar_url,
            email: post.user.email
          },
          view_count: post.view_count || 0,
          likes_count: post.likes_count || post.likes.count,
          comments_count: post.comments.count,
          created_at: post.created_at,
          updated_at: post.updated_at
        }
      end
    }
  end

  def categories
    render json: {
      categories: Post::CATEGORIES
    }
  end

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

  def post_params
    params.require(:post).permit(:title, :content, :country_id, :category, :featured, images: [])
  end
end