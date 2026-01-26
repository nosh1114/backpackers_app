# frozen_string_literal: true

class ApiV1BookmarksController < ApplicationController
  before_action :authenticate_user
  before_action :set_post, only: [:create, :destroy]

  # GET /api/v1/bookmarks
  def index
    bookmarks = current_user.bookmarked_posts.includes(:user, :country).order(created_at: :desc)
    
    render json: {
      posts: bookmarks.map do |post|
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
          bookmarked_at: post.bookmarks.find_by(user_id: current_user.id)&.created_at,
          created_at: post.created_at,
          updated_at: post.updated_at
        }
      end
    }
  end

  # POST /api/v1/posts/:post_id/bookmark
  def create
    bookmark = current_user.bookmarks.build(post: @post)
    
    if bookmark.save
      render json: {
        message: 'ブックマークに追加しました',
        bookmarked: true,
        bookmarks_count: @post.bookmarks.count
      }, status: :created
    else
      render json: { error: bookmark.errors.full_messages.join(', ') }, status: :unprocessable_entity
    end
  end

  # DELETE /api/v1/posts/:post_id/bookmark
  def destroy
    bookmark = current_user.bookmarks.find_by(post: @post)
    
    if bookmark&.destroy
      render json: {
        message: 'ブックマークを解除しました',
        bookmarked: false,
        bookmarks_count: @post.bookmarks.count
      }
    else
      render json: { error: 'ブックマークが見つかりません' }, status: :not_found
    end
  end

  # GET /api/v1/posts/:post_id/bookmark/status
  def status
    post = Post.find_by(id: params[:post_id])
    
    if post
      bookmarked = current_user.bookmarks.exists?(post: post)
      render json: {
        bookmarked: bookmarked,
        bookmarks_count: post.bookmarks.count
      }
    else
      render json: { error: '投稿が見つかりません' }, status: :not_found
    end
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

  def set_post
    @post = Post.find_by(id: params[:post_id])
    render json: { error: '投稿が見つかりません' }, status: :not_found unless @post
  end
end

