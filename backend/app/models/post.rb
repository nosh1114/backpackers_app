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
  
  # 画像アップロード後に自動的に圧縮
  after_commit :compress_images, on: [:create, :update]

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
  # 環境に応じて適切なURLを返す:
  # - 本番環境（S3使用）: S3のフルURLを返す（例: https://bucket.s3.amazonaws.com/...）
  # - 本番環境（ローカルストレージ）: フルURLを返す（例: https://backpackers-app-backend.onrender.com/rails/active_storage/...）
  # - 開発環境（ローカルストレージ）: 相対パスを返す（例: /rails/active_storage/...）
  #   フロントエンドのgetFullImageUrlが相対パスをフルURLに変換する
  def image_urls
    return [] unless images.attached?
    
    # S3設定を一度だけ確認（パフォーマンス向上）
    is_s3_configured = ENV['AWS_S3_BUCKET'].present?
    
    urls = images.map do |image|
      begin
        # S3を使用している場合
        if is_s3_configured && image.service.respond_to?(:url)
          # S3のフルURLを返す（CORS設定が必要）
          # Rails 8.0.2ではcontent_typeとfilenameパラメータが必要
          image.service.url(
            image.key,
            expires_in: 1.hour,
            disposition: :inline,
            filename: image.filename,
            content_type: image.blob.content_type
          )
        else
          # ローカルストレージの場合
          if Rails.env.production?
            # 本番環境ではフルURLを返す
            backend_url = ENV['BACKEND_URL'] || ENV['FRONTEND_URL']&.gsub(/\/$/, '') || 'https://backpackers-app-backend.onrender.com'
            relative_path = Rails.application.routes.url_helpers.rails_blob_url(image, only_path: true)
            "#{backend_url}#{relative_path}"
          else
            # 開発環境では相対パスを返す（フロントエンドのgetFullImageUrlがVITE_BACKEND_URLを付加してフルURLに変換）
            Rails.application.routes.url_helpers.rails_blob_url(image, only_path: true)
          end
        end
      rescue => e
        Rails.logger.error "Failed to generate image URL for post_id=#{id}: #{e.message}"
        nil
      end
    end.compact
    
    urls
  end

  private

  # 画像を圧縮
  def compress_images
    return unless images.attached?

    images.each do |image|
      next unless image.blob.persisted?

      # バックグラウンドジョブで圧縮（パフォーマンス向上のため）
      ImageCompressionJob.perform_later(image.blob.id)
    end
  end

  # 画像のバリデーション
  def validate_images
    return unless images.attached?

    # 最大5枚まで
    if images.count > 5
      errors.add(:images, '画像は最大5枚までアップロードできます')
    end

    images.each do |image|
      # ファイルサイズ制限（5MB）
      if image.blob.byte_size > 5.megabytes
        errors.add(:images, '画像は1枚あたり5MB以下にしてください')
      end

      # ファイル形式制限
      acceptable_types = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/heic', 'image/heif']
      unless acceptable_types.include?(image.blob.content_type)
        errors.add(:images, 'JPEG、PNG、GIF、WebP、HEIC形式の画像のみアップロードできます')
      end
    end
  end
end
