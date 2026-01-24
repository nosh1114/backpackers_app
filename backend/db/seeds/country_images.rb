# frozen_string_literal: true

# 国ごとの代表的なUnsplash画像URL
COUNTRY_IMAGES = {
  # アジア
  '日本' => 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1200&q=80',
  'タイ' => 'https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?auto=format&fit=crop&w=1200&q=80',
  'ベトナム' => 'https://images.unsplash.com/photo-1557750255-c76072a7aad1?auto=format&fit=crop&w=1200&q=80',
  'インドネシア' => 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=1200&q=80',
  'フィリピン' => 'https://images.unsplash.com/photo-1518509562904-e7ef99cdcc86?auto=format&fit=crop&w=1200&q=80',
  'シンガポール' => 'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?auto=format&fit=crop&w=1200&q=80',
  'マレーシア' => 'https://images.unsplash.com/photo-1596422846543-75c6fc197f07?auto=format&fit=crop&w=1200&q=80',
  '韓国' => 'https://images.unsplash.com/photo-1538485399081-7191377e8241?auto=format&fit=crop&w=1200&q=80',
  '中国' => 'https://images.unsplash.com/photo-1508804185872-d7badad00f7d?auto=format&fit=crop&w=1200&q=80',
  '台湾' => 'https://images.unsplash.com/photo-1470004914212-05527e49370b?auto=format&fit=crop&w=1200&q=80',
  '香港' => 'https://images.unsplash.com/photo-1536599018102-9f803c140fc1?auto=format&fit=crop&w=1200&q=80',
  'インド' => 'https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=1200&q=80',
  'ネパール' => 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1200&q=80',
  'スリランカ' => 'https://images.unsplash.com/photo-1586613835341-59e08c6e6116?auto=format&fit=crop&w=1200&q=80',
  'モンゴル' => 'https://images.unsplash.com/photo-1569317002804-ab77bcf1bce4?auto=format&fit=crop&w=1200&q=80',
  'カンボジア' => 'https://images.unsplash.com/photo-1569242840510-9fe6f0112cee?auto=format&fit=crop&w=1200&q=80',
  'ラオス' => 'https://images.unsplash.com/photo-1570789210967-2cac24afeb00?auto=format&fit=crop&w=1200&q=80',
  'ミャンマー' => 'https://images.unsplash.com/photo-1558862107-d49ef2a04d72?auto=format&fit=crop&w=1200&q=80',

  # ヨーロッパ
  'フランス' => 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1200&q=80',
  'イタリア' => 'https://images.unsplash.com/photo-1515859005217-8a1f08870f59?auto=format&fit=crop&w=1200&q=80',
  'スペイン' => 'https://images.unsplash.com/photo-1539037116277-4b208ae96642?auto=format&fit=crop&w=1200&q=80',
  'ドイツ' => 'https://images.unsplash.com/photo-1467269204594-9661b134dd2b?auto=format&fit=crop&w=1200&q=80',
  'イギリス' => 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=1200&q=80',
  'オランダ' => 'https://images.unsplash.com/photo-1534351590666-13e3e96b5017?auto=format&fit=crop&w=1200&q=80',
  'ベルギー' => 'https://images.unsplash.com/photo-1491557345352-5929e343eb89?auto=format&fit=crop&w=1200&q=80',
  'スイス' => 'https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?auto=format&fit=crop&w=1200&q=80',
  'オーストリア' => 'https://images.unsplash.com/photo-1516550893923-42d28e5677af?auto=format&fit=crop&w=1200&q=80',
  'チェコ' => 'https://images.unsplash.com/photo-1541849546-216549ae216d?auto=format&fit=crop&w=1200&q=80',
  'ポーランド' => 'https://images.unsplash.com/photo-1519197924294-4ba991a11128?auto=format&fit=crop&w=1200&q=80',
  'ハンガリー' => 'https://images.unsplash.com/photo-1541343672885-9be56236302a?auto=format&fit=crop&w=1200&q=80',
  'ポルトガル' => 'https://images.unsplash.com/photo-1548707309-dcebeab9ea9b?auto=format&fit=crop&w=1200&q=80',
  'ギリシャ' => 'https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=1200&q=80',
  'クロアチア' => 'https://images.unsplash.com/photo-1555990793-da11153b2473?auto=format&fit=crop&w=1200&q=80',
  'アイスランド' => 'https://images.unsplash.com/photo-1476610182048-b716b8518aae?auto=format&fit=crop&w=1200&q=80',
  'ノルウェー' => 'https://images.unsplash.com/photo-1531366936337-7c912a4589a7?auto=format&fit=crop&w=1200&q=80',
  'スウェーデン' => 'https://images.unsplash.com/photo-1509356843151-3e7d96241e11?auto=format&fit=crop&w=1200&q=80',
  'フィンランド' => 'https://images.unsplash.com/photo-1538332576228-eb5b4c4de6f5?auto=format&fit=crop&w=1200&q=80',
  'デンマーク' => 'https://images.unsplash.com/photo-1513622470522-26c3c8a854bc?auto=format&fit=crop&w=1200&q=80',
  'アイルランド' => 'https://images.unsplash.com/photo-1564959130747-897fb406b9af?auto=format&fit=crop&w=1200&q=80',
  'ロシア' => 'https://images.unsplash.com/photo-1513326738677-b964603b136d?auto=format&fit=crop&w=1200&q=80',
  'トルコ' => 'https://images.unsplash.com/photo-1527838832700-5059252407fa?auto=format&fit=crop&w=1200&q=80',

  # 北米
  'アメリカ' => 'https://images.unsplash.com/photo-1485738422979-f5c462d49f74?auto=format&fit=crop&w=1200&q=80',
  'カナダ' => 'https://images.unsplash.com/photo-1503614472-8c93d56e92ce?auto=format&fit=crop&w=1200&q=80',
  'メキシコ' => 'https://images.unsplash.com/photo-1518105779142-d975f22f1b0a?auto=format&fit=crop&w=1200&q=80',

  # 中南米
  'ブラジル' => 'https://images.unsplash.com/photo-1483729558449-99ef09a8c325?auto=format&fit=crop&w=1200&q=80',
  'アルゼンチン' => 'https://images.unsplash.com/photo-1589909202802-8f4aadce1849?auto=format&fit=crop&w=1200&q=80',
  'ペルー' => 'https://images.unsplash.com/photo-1526392060635-9d6019884377?auto=format&fit=crop&w=1200&q=80',
  'チリ' => 'https://images.unsplash.com/photo-1478827536114-da961b7f86d2?auto=format&fit=crop&w=1200&q=80',
  'コロンビア' => 'https://images.unsplash.com/photo-1518638150340-f706e86654de?auto=format&fit=crop&w=1200&q=80',
  'エクアドル' => 'https://images.unsplash.com/photo-1510759395431-94e36b3b2bb6?auto=format&fit=crop&w=1200&q=80',
  'ボリビア' => 'https://images.unsplash.com/photo-1591543620767-582b2e76369e?auto=format&fit=crop&w=1200&q=80',
  'コスタリカ' => 'https://images.unsplash.com/photo-1559128010-7c1ad6e1b6a5?auto=format&fit=crop&w=1200&q=80',
  'キューバ' => 'https://images.unsplash.com/photo-1500759285222-a95626b934cb?auto=format&fit=crop&w=1200&q=80',

  # オセアニア
  'オーストラリア' => 'https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?auto=format&fit=crop&w=1200&q=80',
  'ニュージーランド' => 'https://images.unsplash.com/photo-1507699622108-4be3abd695ad?auto=format&fit=crop&w=1200&q=80',
  'フィジー' => 'https://images.unsplash.com/photo-1505881502353-a1986add3762?auto=format&fit=crop&w=1200&q=80',

  # アフリカ
  'エジプト' => 'https://images.unsplash.com/photo-1539650116574-8efeb43e2750?auto=format&fit=crop&w=1200&q=80',
  '南アフリカ' => 'https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?auto=format&fit=crop&w=1200&q=80',
  'モロッコ' => 'https://images.unsplash.com/photo-1489749798305-4fea3ae63d43?auto=format&fit=crop&w=1200&q=80',
  'ケニア' => 'https://images.unsplash.com/photo-1547970810-dc1eac37d174?auto=format&fit=crop&w=1200&q=80',
  'タンザニア' => 'https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&w=1200&q=80',

  # 中東
  'アラブ首長国連邦' => 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1200&q=80',
  'イスラエル' => 'https://images.unsplash.com/photo-1544967082-d9d25d867d66?auto=format&fit=crop&w=1200&q=80',
  'ヨルダン' => 'https://images.unsplash.com/photo-1548786811-dd6e453ccca7?auto=format&fit=crop&w=1200&q=80',
}.freeze

# デフォルト画像（マッピングにない国用）
DEFAULT_IMAGE = 'https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?auto=format&fit=crop&w=1200&q=80'

puts "国の画像URLを更新中..."

Country.find_each do |country|
  image_url = COUNTRY_IMAGES[country.name] || DEFAULT_IMAGE
  # バリデーションをスキップして直接カラムを更新
  country.update_column(:image_url, image_url)
  puts "  #{country.name}: #{image_url[0..50]}..."
end

puts "完了！ #{Country.count}件の国の画像を更新しました。"

