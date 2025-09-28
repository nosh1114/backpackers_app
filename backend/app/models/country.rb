class Country < ApplicationRecord
  belongs_to :area
  has_many :posts, dependent: :destroy

  validates :code, presence: true, uniqueness: true
  validates :name, presence: true

  scope :ordered, -> { order(:name) }
end
