class Country < ApplicationRecord
  validates :code, presence: true, uniqueness: true
  validates :name, presence: true

  scope :ordered, -> { order(:name) }
end
