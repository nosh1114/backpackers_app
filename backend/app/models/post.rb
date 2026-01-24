class Post < ApplicationRecord
  belongs_to :user
  belongs_to :country
  has_many :comments, dependent: :destroy
  has_many :likes, dependent: :destroy
  has_many :bookmarks, dependent: :destroy
  has_many :bookmarked_by_users, through: :bookmarks, source: :user
  
  # 画像添付（最大5枚）
  has_many_attached :images
  
  # 画像のバリデーション
  validate :validate_images

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

  # 画像URLを取得
  def image_urls
    return [] unless images.attached?
    images.map do |image|
      Rails.application.routes.url_helpers.rails_blob_url(image, only_path: true)
    end
  end

  private

  # 画像のバリデーション
  def validate_images
    return unless images.attached?

    # 最大5枚まで
    if images.count > 5
      errors.add(:images, '画像は最大5枚までアップロードできます')
    end

    images.each do |image|
      # ファイルサイズ制限（2MB）
      if image.blob.byte_size > 2.megabytes
        errors.add(:images, '画像は1枚あたり2MB以下にしてください')
      end

      # ファイル形式制限
      acceptable_types = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
      unless acceptable_types.include?(image.blob.content_type)
        errors.add(:images, 'JPEG、PNG、GIF、WebP形式の画像のみアップロードできます')
      end
    end
  end
end
