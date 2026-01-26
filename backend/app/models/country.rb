class Country < ApplicationRecord
  belongs_to :area, optional: true  # エリアが未設定の国も許可
  has_many :posts, dependent: :destroy

  validates :code, presence: true, uniqueness: true
  validates :name, presence: true

  scope :ordered, -> { order(:name) }
end
