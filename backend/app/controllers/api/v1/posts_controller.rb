class Api::V1::PostsController < Api::V1::BaseController
  def index
    posts = Post.includes(:user).order(created_at: :desc)
    posts = posts.where(country_code: params[:country_code]) if params[:country_code].present?
    
    # ページネーション
    if params[:page] && params[:per_page]
      page = params[:page].to_i
      per_page = params[:per_page].to_i
      posts = posts.limit(per_page).offset(per_page * (page - 1))
    end

    render json: {
      posts: posts.map do |post|
        {
          id: post.id,
          title: post.title,
          content: post.content,
          country_code: post.country_code,
          user: {
            id: post.user.id,
            name: post.user.name,
            avatar_url: post.user.avatar_url
          },
          created_at: post.created_at,
          updated_at: post.updated_at
        }
      end
    }
  end

  def show
    post = Post.includes(:user).find_by(id: params[:id])
    
    if post
      render json: {
        post: {
          id: post.id,
          title: post.title,
          content: post.content,
          country_code: post.country_code,
          user: {
            id: post.user.id,
            name: post.user.name,
            avatar_url: post.user.avatar_url
          },
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
          country_code: post.country_code,
          user: {
            id: post.user.id,
            name: post.user.name,
            avatar_url: post.user.avatar_url
          },
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
            country_code: post.country_code,
            user: {
              id: post.user.id,
              name: post.user.name,
              avatar_url: post.user.avatar_url
            },
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

  private

  def post_params
    params.require(:post).permit(:title, :content, :country_code)
  end
end
