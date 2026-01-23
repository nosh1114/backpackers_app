class Post < ApplicationRecord
  belongs_to :user
  belongs_to :country
  has_many :comments, dependent: :destroy
  has_many :likes, dependent: :destroy

  # カテゴリー定数
  CATEGORIES = %w[
    宿
    お得情報
    観光地
    お金
    決済
    移動
    交通
    レストラン
    日本宿
    ビザ
    治安
    sim
    文化
  ].freeze

  # バリデーション
  validates :title, presence: true, length: { minimum: 1, maximum: 100 }
  validates :content, presence: true, length: { minimum: 1, maximum: 10000 }
  validates :country_id, presence: true
  validates :category, inclusion: { in: CATEGORIES }, allow_blank: true

  # スコープ
  scope :by_category, ->(category) { where(category: category) }
  scope :by_country, ->(country_id) { where(country_id: country_id) }
  scope :recent, -> { order(created_at: :desc) }
  scope :popular, -> { order(view_count: :desc, created_at: :desc) }
  scope :featured, -> { where(featured: true) }

  # いいね数カウンター
  def update_likes_count!
    update!(likes_count: likes.count)
  end

  # view数をインクリメント
  def increment_view_count!
    increment!(:view_count)
  end
end
