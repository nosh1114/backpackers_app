class Post < ApplicationRecord
  belongs_to :user
  belongs_to :country
  has_many :comments, dependent: :destroy
  has_many :likes, dependent: :destroy

  # バリデーション
  validates :title, presence: true, length: { minimum: 1, maximum: 100 }
  validates :content, presence: true, length: { minimum: 1, maximum: 10000 }
  validates :country_id, presence: true

  # スコープ
  scope :by_category, ->(category) { where(category: category) }
  scope :by_country, ->(country_id) { where(country_id: country_id) }
  scope :recent, -> { order(created_at: :desc) }

  # いいね数カウンター
  def update_likes_count!
    update!(likes_count: likes.count)
  end
end
