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

# 必須データの読み込み（順序重要）
# 1. 国のデータ（197カ国）
puts "📌 Loading countries..."
load Rails.root.join('db', 'seeds', 'countries.rb')

# 2. 国の画像URL（必須データ）
puts "📌 Loading country images..."
load Rails.root.join('db', 'seeds', 'country_images.rb')

# 3. エリアの作成（必須データ）
puts "📌 Creating areas..."
areas = [
  { name: 'アジア' },
  { name: 'ヨーロッパ' },
  { name: '北アメリカ' },
  { name: '南アメリカ' },
  { name: 'アフリカ' },
  { name: 'オセアニア' }
]

areas.each do |area_data|
  Area.find_or_create_by(name: area_data[:name])
end
puts "✅ #{Area.count} areas created successfully!"

# 4. すべての国にエリアを割り当て（必須データ・ISOコードベース）
puts "📌 Assigning areas to countries..."
load Rails.root.join('db', 'seeds', 'country_areas.rb')

# エリアオブジェクトを取得
areas_hash = {
  'アジア' => Area.find_by!(name: 'アジア'),
  'ヨーロッパ' => Area.find_by!(name: 'ヨーロッパ'),
  '北アメリカ' => Area.find_by!(name: '北アメリカ'),
  '南アメリカ' => Area.find_by!(name: '南アメリカ'),
  'アフリカ' => Area.find_by!(name: 'アフリカ'),
  'オセアニア' => Area.find_by!(name: 'オセアニア')
}

# 割り当て失敗を記録
failed_assignments = []
assigned_count = 0

# ISOコードベースで割り当て（重複・漏れを防ぐ）
COUNTRY_AREA_MAPPING.each do |country_code, area_name|
  country = Country.find_by(code: country_code)
  area = areas_hash[area_name]
  
  if country.nil?
    failed_assignments << { code: country_code, reason: 'Country not found' }
    next
  end
  
  if area.nil?
    failed_assignments << { code: country_code, reason: "Area '#{area_name}' not found" }
    next
  end
  
  country.update!(area: area)
  assigned_count += 1
end

# 失敗があればエラーを発生させる（検知可能にする）
if failed_assignments.any?
  error_message = "Failed to assign areas to #{failed_assignments.length} countries:\n"
  failed_assignments.each do |failure|
    error_message += "  - #{failure[:code]}: #{failure[:reason]}\n"
  end
  raise error_message
end

puts "✅ Assigned areas to #{assigned_count} countries!"

# 5. 検証：すべての国にエリアが割り当てられているか確認
puts "📌 Verifying area assignments..."
countries_without_area = Country.left_joins(:area).where(areas: { id: nil })
if countries_without_area.any?
  missing_countries = countries_without_area.pluck(:code, :name)
  error_message = "❌ CRITICAL: #{missing_countries.length} countries without area assignment:\n"
  missing_countries.each do |code, name|
    error_message += "  - #{code} (#{name})\n"
  end
  raise error_message
end

# 6. 検証：期待される国数と一致するか確認
actual_count = Country.count
if actual_count != EXPECTED_COUNTRY_COUNT
  raise "❌ CRITICAL: Expected #{EXPECTED_COUNTRY_COUNT} countries, but found #{actual_count} countries!"
end

puts "✅ Verification passed: All #{actual_count} countries have area assignments!"

# サンプルユーザーとダミーデータの作成（開発環境のみ）
if Rails.env.development?
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
  puts "📌 Loading dummy data..."
  load Rails.root.join('db', 'seeds', 'dummy_data.rb')
else
  puts "⏭️  Skipping dummy data (production mode)"
end

# 7. 最終検証：countries.rbとcountry_areas.rbの整合性確認
puts "📌 Verifying consistency between countries.rb and country_areas.rb..."

# countries.rbから国コードを取得（DBから取得する方法に変更）
defined_country_codes = Country.pluck(:code).to_set
mapped_country_codes = COUNTRY_AREA_MAPPING.keys.to_set

# マッピングに含まれていない国を検出
missing_in_mapping = defined_country_codes - mapped_country_codes
if missing_in_mapping.any?
  missing_names = Country.where(code: missing_in_mapping.to_a).pluck(:name, :code).map { |n, c| "#{n} (#{c})" }
  raise "❌ CRITICAL: #{missing_in_mapping.length} countries in database are missing from country_areas.rb:\n  #{missing_names.join(', ')}"
end

# マッピングに含まれているが、DBに存在しない国を検出
extra_in_mapping = mapped_country_codes - defined_country_codes
if extra_in_mapping.any?
  raise "❌ CRITICAL: #{extra_in_mapping.length} countries in country_areas.rb are missing from database:\n  #{extra_in_mapping.to_a.sort.join(', ')}"
end

puts "✅ Consistency check passed: All countries are properly mapped!"

puts "🎉 Seeding completed!"
puts "📊 Total users: #{User.count}"
puts "📊 Total posts: #{Post.count}"
puts "📊 Total countries: #{Country.count}"
puts "📊 Countries with area: #{Country.joins(:area).count} / #{Country.count}"
