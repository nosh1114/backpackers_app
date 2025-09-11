class Post < ApplicationRecord
  belongs_to :user
  belongs_to :country, foreign_key: :country_code, primary_key: :code

  # バリデーション
  validates :title, presence: true, length: { minimum: 1, maximum: 100 }
  validates :content, presence: true, length: { minimum: 1, maximum: 10000 }
  validates :country_code, presence: true
end
