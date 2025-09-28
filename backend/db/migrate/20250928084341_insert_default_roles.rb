class InsertDefaultRoles < ActiveRecord::Migration[8.0]
  def up
    Role.create!(id: 0, name: 'user')
    Role.create!(id: 1, name: 'admin')
  end

  def down
    Role.where(id: [0, 1]).destroy_all
  end
end
