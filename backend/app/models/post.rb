class Post < ApplicationRecord
  include Countries
  
  belongs_to :user

  # バリデーション
  validates :title, presence: true, length: { minimum: 1, maximum: 100 }
  validates :content, presence: true, length: { minimum: 1, maximum: 10000 }
  validates :country_code, presence: true, inclusion: { in: Countries::COUNTRY_CODES }
end
