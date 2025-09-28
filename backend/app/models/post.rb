class Post < ApplicationRecord
  belongs_to :user
  # country_idではなくcountry_codeを使用するように修正
  # belongs_to :country を削除し、country_codeを直接使用
  has_many :comments, dependent: :destroy
  has_many :likes, dependent: :destroy

  # バリデーション
  validates :title, presence: true, length: { minimum: 1, maximum: 100 }
  validates :content, presence: true, length: { minimum: 1, maximum: 10000 }
  validates :category, presence: true
  validates :country_code, presence: true  # country_idからcountry_codeに変更

  # スコープ
  scope :by_category, ->(category) { where(category: category) }
  scope :by_country, ->(country_code) { where(country_code: country_code) }  # country_idからcountry_codeに変更
  scope :recent, -> { order(created_at: :desc) }

  # いいね数カウンター
  def update_likes_count!
    update!(likes_count: likes.count)
  end
end
