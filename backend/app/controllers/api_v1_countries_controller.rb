class ApiV1CountriesController < ApplicationController
  # デフォルト画像URL
  DEFAULT_IMAGE_URL = 'https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?auto=format&fit=crop&w=1200&q=80'.freeze

  def index
    countries = Country.ordered.map do |country|
      {
        id: country.id,
        code: country.code,
        name: country.name,
        flag_emoji: country.flag_emoji,
        image_url: country.image_url || DEFAULT_IMAGE_URL
      }
    end

    render json: {
      countries: countries
    }
  end

  def stats
    countries = Country.ordered.includes(posts: :user).map do |country|
      posts = country.posts
      recent_posts = posts.order(created_at: :desc).limit(2)
      
      {
        id: country.id,
        code: country.code,
        name: country.name,
        flag_emoji: country.flag_emoji,
        image_url: country.image_url || DEFAULT_IMAGE_URL,
        tip_count: posts.count,
        last_post_date: posts.maximum(:created_at) || country.created_at,
        recent_tips: recent_posts.map do |post|
          {
            id: post.id,
            title: post.title,
            category: post.category || 'その他',
            author_name: post.user.name,
            author_avatar_url: post.user.avatar_url,
            author_email: post.user.email,
            created_at: post.created_at
          }
        end
      }
    end

    render json: {
      countries: countries
    }
  end

  def by_areas
    # エリアごとに国をグループ化し、投稿数でソート
    areas = Area.includes(:countries).order(:name).map do |area|
      countries_with_stats = area.countries.includes(:posts).map do |country|
        posts = country.posts
        {
          id: country.id,
          code: country.code,
          name: country.name,
          flag_emoji: country.flag_emoji,
          image_url: country.image_url || DEFAULT_IMAGE_URL,
          tip_count: posts.count,
          view_count: posts.sum(:view_count) || 0
        }
      end
      
      # 投稿数が多い順にソート（投稿数が同じ場合はview数でソート）
      sorted_countries = countries_with_stats.sort_by { |c| [-c[:tip_count], -c[:view_count]] }
      
      {
        id: area.id,
        name: area.name,
        countries: sorted_countries
      }
    end

    render json: {
      areas: areas
    }
  end
end