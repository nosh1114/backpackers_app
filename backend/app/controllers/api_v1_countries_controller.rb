class ApiV1CountriesController < ApplicationController
  def index
    countries = Country.ordered.map do |country|
      {
        id: country.id,
        code: country.code,
        name: country.name,
        flag_emoji: country.flag_emoji
      }
    end

    render json: {
      countries: countries
    }
  end

  def stats
    countries = Country.ordered.includes(:posts).map do |country|
      posts = country.posts
      recent_posts = posts.order(created_at: :desc).limit(2)
      
      {
        id: country.id,
        code: country.code,
        name: country.name,
        flag_emoji: country.flag_emoji,
        tip_count: posts.count,
        last_post_date: posts.maximum(:created_at) || country.created_at,
        recent_tips: recent_posts.map do |post|
          {
            title: post.title,
            category: post.category
          }
        end
      }
    end

    render json: {
      countries: countries
    }
  end
end