class Contact < ApplicationRecord
  STATUSES = %w[pending in_progress resolved].freeze
  SUBJECTS = %w[question bug feedback report other].freeze

  validates :name, presence: true
  validates :email, presence: true, format: { with: URI::MailTo::EMAIL_REGEXP }
  validates :subject, presence: true, inclusion: { in: SUBJECTS }
  validates :message, presence: true, length: { minimum: 10, maximum: 5000 }
  validates :status, inclusion: { in: STATUSES }

  scope :unread, -> { where(read: false) }
  scope :pending, -> { where(status: 'pending') }
  scope :recent, -> { order(created_at: :desc) }
end

