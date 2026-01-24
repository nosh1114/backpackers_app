class ApiV1ContactsController < ApplicationController
  def create
    contact = Contact.new(contact_params)

    if contact.save
      render json: {
        message: 'お問い合わせを受け付けました',
        contact: {
          id: contact.id,
          name: contact.name,
          subject: contact.subject,
          created_at: contact.created_at
        }
      }, status: :created
    else
      render json: { errors: contact.errors.full_messages }, status: :unprocessable_entity
    end
  end

  private

  def contact_params
    params.require(:contact).permit(:name, :email, :subject, :message)
  end
end

