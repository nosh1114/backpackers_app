# 不足している国の国旗絵文字を追加
missing_countries = {
  'nauru' => '🇳🇷',
  'vatican_city' => '🇻��',
  'vanuatu' => '🇻🇺',
  'bahamas' => '🇧🇸',
  'barbados' => '🇧🇧',
  'papua_new_guinea' => '��🇬',
  'palau' => '🇵🇼',
  'fiji' => '🇫🇯',
  'brunei' => '🇧🇳',
  'bosnia_and_herzegovina' => '🇧🇦',
  'malta' => '🇲🇹',
  'marshall_islands' => '🇲🇭',
  'micronesia' => '🇫🇲',
  'monaco' => '🇲🇨',
  'montenegro' => '🇲🇪',
  'mauritania' => '🇲🇷',
  'liechtenstein' => '🇱🇮',
  'luxembourg' => '🇱🇺',
  'lesotho' => '🇱🇸',
  'north_macedonia' => '🇲🇰',
  'timor_leste' => '🇹🇱',
  'equatorial_guinea' => '🇬🇶',
  'taiwan' => '🇹🇼',
  'kosovo' => '🇽🇰'
}

puts "Updating #{missing_countries.length} missing countries..."

missing_countries.each do |code, emoji|
  country = Country.find_by(code: code)
  if country
    country.update(flag_emoji: emoji)
    puts "✅ Updated #{country.name}: #{emoji}"
  else
    puts "❌ Country not found: #{code}"
  end
end

puts "✅ Missing countries update completed!"
