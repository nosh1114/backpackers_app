# ダミーデータの作成

puts "ダミーデータを作成中..."

# エリアの作成
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

# 国にエリアを割り当て
asia = Area.find_by(name: 'アジア')
europe = Area.find_by(name: 'ヨーロッパ')
north_america = Area.find_by(name: '北アメリカ')
south_america = Area.find_by(name: '南アメリカ')
africa = Area.find_by(name: 'アフリカ')
oceania = Area.find_by(name: 'オセアニア')

# 主要国にエリアを割り当て
Country.find_by(name: '日本')&.update(area: asia)
Country.find_by(name: '韓国')&.update(area: asia)
Country.find_by(name: '中国')&.update(area: asia)
Country.find_by(name: 'タイ')&.update(area: asia)
Country.find_by(name: 'ベトナム')&.update(area: asia)
Country.find_by(name: 'インド')&.update(area: asia)
Country.find_by(name: 'インドネシア')&.update(area: asia)
Country.find_by(name: 'フィリピン')&.update(area: asia)
Country.find_by(name: 'マレーシア')&.update(area: asia)
Country.find_by(name: 'シンガポール')&.update(area: asia)

Country.find_by(name: 'フランス')&.update(area: europe)
Country.find_by(name: 'イタリア')&.update(area: europe)
Country.find_by(name: 'スペイン')&.update(area: europe)
Country.find_by(name: 'ドイツ')&.update(area: europe)
Country.find_by(name: 'イギリス')&.update(area: europe)
Country.find_by(name: 'オランダ')&.update(area: europe)
Country.find_by(name: 'スイス')&.update(area: europe)
Country.find_by(name: 'オーストリア')&.update(area: europe)
Country.find_by(name: 'チェコ')&.update(area: europe)
Country.find_by(name: 'ポーランド')&.update(area: europe)

Country.find_by(name: 'アメリカ')&.update(area: north_america)
Country.find_by(name: 'カナダ')&.update(area: north_america)
Country.find_by(name: 'メキシコ')&.update(area: north_america)

Country.find_by(name: 'ブラジル')&.update(area: south_america)
Country.find_by(name: 'アルゼンチン')&.update(area: south_america)
Country.find_by(name: 'チリ')&.update(area: south_america)
Country.find_by(name: 'ペルー')&.update(area: south_america)

Country.find_by(name: 'エジプト')&.update(area: africa)
Country.find_by(name: '南アフリカ')&.update(area: africa)
Country.find_by(name: 'モロッコ')&.update(area: africa)
Country.find_by(name: 'ケニア')&.update(area: africa)

Country.find_by(name: 'オーストラリア')&.update(area: oceania)
Country.find_by(name: 'ニュージーランド')&.update(area: oceania)

# ダミーユーザーの作成
dummy_users = [
  {
    name: '田中太郎',
    email: 'tanaka@example.com',
    password: 'password123',
    bio: '世界一周バックパッカー。これまで50カ国以上を旅してきました。',
    location: '東京, 日本',
    website: 'https://tanaka-travel.com'
  },
  {
    name: 'Sarah Johnson',
    email: 'sarah@example.com',
    password: 'password123',
    bio: 'Photographer and travel blogger. Love exploring hidden gems around the world.',
    location: 'New York, USA',
    website: 'https://sarah-travels.com'
  },
  {
    name: '山田花子',
    email: 'yamada@example.com',
    password: 'password123',
    bio: '一人旅が大好きな大学生。アジアを中心に旅をしています。',
    location: '大阪, 日本'
  },
  {
    name: 'Marco Rossi',
    email: 'marco@example.com',
    password: 'password123',
    bio: 'Italian food lover and travel enthusiast. Sharing authentic experiences.',
    location: 'Rome, Italy',
    website: 'https://marco-eats.com'
  },
  {
    name: '李小明',
    email: 'li@example.com',
    password: 'password123',
    bio: '中国からの留学生。日本の文化と料理を愛しています。',
    location: '京都, 日本'
  },
  {
    name: 'Emma Wilson',
    email: 'emma@example.com',
    password: 'password123',
    bio: 'Backpacking through Southeast Asia. Love meeting new people and trying local food.',
    location: 'Bangkok, Thailand'
  },
  {
    name: '佐藤健一',
    email: 'sato@example.com',
    password: 'password123',
    bio: '会社員。休暇を利用して海外旅行を楽しんでいます。',
    location: '福岡, 日本'
  },
  {
    name: 'Pierre Dubois',
    email: 'pierre@example.com',
    password: 'password123',
    bio: 'French chef traveling the world to discover new flavors and techniques.',
    location: 'Paris, France',
    website: 'https://pierre-cuisine.com'
  }
]

dummy_users.each do |user_data|
  user = User.find_or_create_by(email: user_data[:email]) do |u|
    u.name = user_data[:name]
    u.password = user_data[:password]
    u.password_confirmation = user_data[:password]
    u.bio = user_data[:bio]
    u.location = user_data[:location]
    u.website = user_data[:website]
    u.role_id = 0 # user role
  end
end

# ダミー投稿の作成
categories = ['宿泊', '食事', '交通', '観光', 'ショッピング', '文化', '安全', 'その他']

dummy_posts = [
  {
    title: '東京の隠れた居酒屋で最高の体験',
    content: '新宿の路地裏にある小さな居酒屋「山田屋」を発見！店主の山田さんが作る手作りのおでんは絶品でした。観光客向けの店ではなく、地元の人たちが集まる本格的な居酒屋です。日本語が話せなくても、店主が英語で丁寧に説明してくれます。',
    country_name: '日本',
    category: '食事',
    author_email: 'tanaka@example.com'
  },
  {
    title: 'バンコクの屋台で食べるべき料理トップ5',
    content: 'バンコクの屋台は本当に素晴らしい！特に以下の5つは絶対に食べてほしい：1) パッタイ（炒め麺）2) トムヤムクン（酸っぱいスープ）3) ソムタム（青パパイヤサラダ）4) ガパオライス（バジル炒めご飯）5) マンゴースティッキーライス。どの屋台でも美味しいですが、特にカオサン通り周辺がおすすめです。',
    country_name: 'タイ',
    category: '食事',
    author_email: 'emma@example.com'
  },
  {
    title: 'パリの地下鉄で迷わないための完全ガイド',
    content: 'パリの地下鉄は複雑に見えますが、コツを掴めば簡単です。まず、RATPアプリをダウンロードしましょう。乗り換えは案内板に従って、色分けされた路線を確認してください。チケットは10枚セット（carnet）がお得です。観光地は主に1-2ゾーン内にあるので、1-2ゾーンチケットで十分です。',
    country_name: 'フランス',
    category: '交通',
    author_email: 'pierre@example.com'
  },
  {
    title: 'ローマのコロッセオを無料で見る方法',
    content: 'コロッセオの入場料は高いですが、実は無料で見ることができます！パラティーノの丘から見下ろすと、コロッセオの全体像が美しく見えます。また、夜のライトアップも必見です。21:00頃からライトアップが始まり、昼間とは違った幻想的な姿を見ることができます。',
    country_name: 'イタリア',
    category: '観光',
    author_email: 'marco@example.com'
  },
  {
    title: 'ニューヨークの地下鉄で安全に移動するコツ',
    content: 'NYCの地下鉄は24時間運行で便利ですが、安全に注意が必要です。夜間は人通りの多い駅を利用し、一人で乗るのは避けましょう。荷物は常に目の届く場所に置き、貴重品は分散して保管してください。また、Google Mapsのリアルタイム情報を活用して、遅延や運休を事前に確認しましょう。',
    country_name: 'アメリカ',
    category: '安全',
    author_email: 'sarah@example.com'
  },
  {
    title: '京都の着物レンタル完全ガイド',
    content: '京都で着物を着るなら、レンタルがおすすめです。予約は前日までに済ませましょう。おすすめの店は「着物レンタル 岡本」と「着物レンタル てくてく京都」。着付けは30分程度かかります。着物を着たままの移動は意外と大変なので、観光ルートは事前に計画しておきましょう。',
    country_name: '日本',
    category: '文化',
    author_email: 'yamada@example.com'
  },
  {
    title: 'シンガポールのホーカーズで食べるべき料理',
    content: 'シンガポールのホーカーズ（屋台）は必見です！特に「チキンライス」「チリクラブ」「ラクサ」は絶品。ホーカーズは清潔で安全なので、安心して食べられます。おすすめのホーカーズは「ニュートン・フードセンター」と「マクスウェル・フードセンター」。',
    country_name: 'シンガポール',
    category: '食事',
    author_email: 'li@example.com'
  },
  {
    title: 'ロンドンの天気に備える完全装備',
    content: 'ロンドンは一日中雨が降る可能性があるので、折りたたみ傘は必須です。また、気温の変化が激しいので、重ね着ができる服装がおすすめ。夏でも長袖を持参しましょう。地下鉄は暖房が効いているので、冬でも薄着で大丈夫です。',
    country_name: 'イギリス',
    category: 'その他',
    author_email: 'sarah@example.com'
  },
  {
    title: 'バリ島のビーチで安全に楽しむ方法',
    content: 'バリ島のビーチは美しいですが、波が強く流れも複雑です。必ずライフガードがいるビーチを選び、赤い旗が立っている時は絶対に海に入らないでください。日焼け止めは必須で、SPF50以上を選びましょう。また、ビーチタオルや帽子も忘れずに。',
    country_name: 'インドネシア',
    category: '安全',
    author_email: 'emma@example.com'
  },
  {
    title: 'ドイツのビール祭りで楽しむコツ',
    content: 'オクトーバーフェストは世界最大のビール祭りです。テントは予約が必要で、早めに予約しましょう。ビールは1リットルのマスで提供され、意外と強いので注意が必要です。現地の伝統衣装を着ると雰囲気が盛り上がります。',
    country_name: 'ドイツ',
    category: '文化',
    author_email: 'tanaka@example.com'
  },
  {
    title: 'オーストラリアのグレートバリアリーフでダイビング',
    content: 'グレートバリアリーフでのダイビングは一生の思い出になります。初心者でも参加できるツアーが多数あります。水中カメラのレンタルも可能で、美しいサンゴ礁と熱帯魚を撮影できます。日焼け対策は必須で、環境に優しい日焼け止めを使用しましょう。',
    country_name: 'オーストラリア',
    category: '観光',
    author_email: 'sarah@example.com'
  },
  {
    title: '韓国のK-POPスタジオツアー体験記',
    content: 'ソウルでK-POPスタジオツアーに参加しました。SMTOWNやJYPエンターテインメントのスタジオを見学でき、実際のレコーディング風景も見ることができます。予約は早めに取る必要があります。韓国語ができなくても、英語対応のツアーがあります。',
    country_name: '韓国',
    category: '文化',
    author_email: 'yamada@example.com'
  },
  {
    title: 'インドの電車で快適に移動する方法',
    content: 'インドの電車は予約が必須です。ACクラス（エアコン付き）を選ぶと快適です。食事は車内販売もありますが、駅の屋台の方が美味しいです。荷物は必ずロックし、貴重品は肌身離さず持参してください。',
    country_name: 'インド',
    category: '交通',
    author_email: 'li@example.com'
  },
  {
    title: 'ブラジルのカーニバルで楽しむ完全ガイド',
    content: 'リオのカーニバルは世界最大のパーティーです。チケットは早めに購入し、ホテルも予約が困難です。サンバスクールのパレードを見るなら、サンボドロモのチケットが必要です。現地の衣装を着ると雰囲気が盛り上がります。',
    country_name: 'ブラジル',
    category: '文化',
    author_email: 'marco@example.com'
  },
  {
    title: 'カナダのオーロラを見るベストスポット',
    content: 'イエローナイフはオーロラ観測の名所です。9月から4月がベストシーズンで、晴れた夜に高い確率で見ることができます。防寒対策は必須で、-30度以下になることもあります。カメラのバッテリーも予備を持参しましょう。',
    country_name: 'カナダ',
    category: '観光',
    author_email: 'sarah@example.com'
  }
]

dummy_posts.each do |post_data|
  country = Country.find_by(name: post_data[:country_name])
  author = User.find_by(email: post_data[:author_email])
  
  if country && author
    Post.find_or_create_by(
      title: post_data[:title],
      user: author,
      country: country
    ) do |post|
      post.content = post_data[:content]
      post.category = post_data[:category]
      post.likes_count = rand(0..50)
    end
  end
end

puts "ダミーデータの作成が完了しました！"
puts "- ユーザー: #{User.count}人"
puts "- 投稿: #{Post.count}件"
puts "- 国: #{Country.count}カ国"
puts "- エリア: #{Area.count}エリア"
