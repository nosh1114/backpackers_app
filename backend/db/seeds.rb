# This file should ensure the existence of records required to run the application in every environment (production,
# development, test). The code here should be idempotent so that it can be executed at any point in every environment.
# The data can then be loaded with the bin/rails db:seed command (or created alongside the database with db:setup).
#
# Example:
#
#   ["Action", "Comedy", "Drama", "Horror"].each do |genre_name|
#     MovieGenre.find_or_create_by!(name: genre_name)
#   end

# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the bin/rails db:seed command (or created alongside the database with db:setup).

puts "🌱 Seeding database..."

# サンプルユーザーの作成
users_data = [
  {
    name: "田中太郎",
    email: "tanaka@example.com",
    password: "Password123!",
    bio: "世界一周を目指すバックパッカー。アジア、ヨーロッパ、南米を旅してきました。",
    location: "東京",
    website: "https://tanaka-travel.com",
    avatar_url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face"
  },
  {
    name: "佐藤花子",
    email: "sato@example.com",
    password: "Password123!",
    bio: "写真家として世界中を旅しています。特に自然と文化に興味があります。",
    location: "大阪",
    website: "https://sato-photography.com",
    avatar_url: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face"
  },
  {
    name: "山田次郎",
    email: "yamada@example.com",
    password: "Password123!",
    bio: "予算重視のバックパッカー。安くても楽しい旅を心がけています。",
    location: "福岡",
    website: nil,
    avatar_url: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face"
  },
  {
    name: "鈴木美咲",
    email: "suzuki@example.com",
    password: "Password123!",
    bio: "女性一人旅の専門家。安全で楽しい旅のコツを共有します。",
    location: "名古屋",
    website: "https://suzuki-solo-travel.com",
    avatar_url: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face"
  },
  {
    name: "高橋健一",
    email: "takahashi@example.com",
    password: "Password123!",
    bio: "長期滞在型の旅が好き。一つの場所に1ヶ月以上滞在して、その土地の文化を深く理解します。",
    location: "札幌",
    website: "https://takahashi-longstay.com",
    avatar_url: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face"
  }
]

users_data.each do |user_data|
  user = User.find_or_initialize_by(email: user_data[:email])
  
  if user.new_record?
    user.assign_attributes(
      name: user_data[:name],
      password: user_data[:password],
      password_confirmation: user_data[:password],
      bio: user_data[:bio],
      location: user_data[:location],
      website: user_data[:website],
      avatar_url: user_data[:avatar_url]
    )
    
    if user.save
      puts "✅ Created user: #{user.name} (#{user.email})"
    else
      puts "❌ Failed to create user: #{user_data[:name]} - #{user.errors.full_messages.join(', ')}"
    end
  else
    puts "⏭️  User already exists: #{user.name} (#{user.email})"
  end
end

# ダミーデータの読み込み
load Rails.root.join('db', 'seeds', 'dummy_data.rb')

puts "🎉 Seeding completed!"
puts "📊 Total users: #{User.count}"
puts "📊 Total posts: #{Post.count}"
puts "📊 Total countries: #{Country.count}"
