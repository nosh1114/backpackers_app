class Area < ApplicationRecord
  has_many :countries, dependent: :destroy

  validates :name, presence: true, uniqueness: true
end
