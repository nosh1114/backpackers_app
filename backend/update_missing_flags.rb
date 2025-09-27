missing_flags = {
  'azerbaijan' => '��🇿',
  'albania' => '🇦🇱',
  'armenia' => '🇦🇲',
  'angola' => '🇦🇴',
  'antigua_and_barbuda' => '🇦🇬',
  'andorra' => '🇦🇩'
}

missing_flags.each do |code, emoji|
  country = Country.find_by(code: code)
  if country
    country.update(flag_emoji: emoji)
    puts "✅ Updated #{country.name}: #{emoji}"
  else
    puts "❌ Country not found: #{code}"
  end
end

puts "✅ Missing flag emojis updated!"
