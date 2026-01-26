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
    # N+1クエリを避けるため、事前に統計情報を取得
    country_stats = Post.group(:country_id)
                        .select('country_id, COUNT(*) as tip_count, MAX(created_at) as last_post_date')
                        .index_by(&:country_id)
    
    # すべての投稿を一度に取得して、Ruby側でグループ化（N+1を完全に回避）
    # 各カ国ごとに最新2件のみを保持
    all_posts = Post.includes(:user)
                     .order(created_at: :desc)
                     .to_a
    
    recent_posts_by_country = {}
    all_posts.each do |post|
      country_id = post.country_id
      next unless country_id
      
      recent_posts_by_country[country_id] ||= []
      if recent_posts_by_country[country_id].length < 2
        recent_posts_by_country[country_id] << post
      end
    end

    countries = Country.ordered.map do |country|
      stats = country_stats[country.id]
      recent_posts = recent_posts_by_country[country.id] || []
      
      {
        id: country.id,
        code: country.code,
        name: country.name,
        flag_emoji: country.flag_emoji,
        image_url: country.image_url || DEFAULT_IMAGE_URL,
        tip_count: stats&.tip_count.to_i,
        last_post_date: stats&.last_post_date || country.created_at,
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