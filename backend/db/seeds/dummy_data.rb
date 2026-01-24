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

Country.find_by(name: 'アメリカ合衆国')&.update(area: north_america)
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
Country.find_by(name: 'ジンバブエ')&.update(area: africa)
Country.find_by(name: 'ザンビア')&.update(area: africa)
Country.find_by(name: 'ボツワナ')&.update(area: africa)
Country.find_by(name: 'ナミビア')&.update(area: africa)

Country.find_by(name: 'オーストラリア')&.update(area: oceania)
Country.find_by(name: 'ニュージーランド')&.update(area: oceania)

# 追加のアジア諸国
Country.find_by(name: 'ラオス')&.update(area: asia)
Country.find_by(name: 'ネパール')&.update(area: asia)
Country.find_by(name: 'バングラデシュ')&.update(area: asia)

# 追加の南アメリカ諸国
Country.find_by(name: 'ボリビア')&.update(area: south_america)

# 追加の北アメリカ諸国
Country.find_by(name: 'アメリカ合衆国')&.update(area: north_america)

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
  end
end

# ダミー投稿の作成
categories = ['宿', 'お得情報', '観光地', 'お金', '決済', '移動', '交通', 'レストラン', '日本宿', 'ビザ', '治安', 'sim', '文化']

# ユーザーが訪れた国に関する投稿データ
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
    country_name: 'アメリカ合衆国',
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
  },
  # ベトナム 🇻🇳
  {
    title: 'ホーチミンの安い宿泊先おすすめ5選',
    content: 'ホーチミンで予算重視の宿を探している方へ。1) バックパッカーホステル（1泊5ドル）2) ゲストハウス（1泊8ドル）3) 安いホテル（1泊12ドル）4) エアビー（1泊10ドル）5) コワーキングスペース併設ホステル（1泊7ドル）。どの宿も中心部から近く、WiFi完備で清潔です。',
    country_name: 'ベトナム',
    category: '宿',
    author_email: 'tanaka@example.com',
    view_count: 1250,
    featured: false
  },
  {
    title: 'ハノイの屋台で食べるべきベトナム料理',
    content: 'ハノイの屋台は最高！フォー（牛肉麺）、バインミー（ベトナムサンドイッチ）、ブンチャー（焼き肉麺）、ネム（生春巻き）、チャーカー（魚の鍋）は必食。1食2-3ドルで満腹になれます。',
    country_name: 'ベトナム',
    category: 'レストラン',
    author_email: 'yamada@example.com',
    view_count: 980,
    featured: false
  },
  {
    title: 'ベトナムのSIMカード購入完全ガイド',
    content: 'ベトナムでSIMカードを買うなら、空港か街の携帯ショップで。Viettel、Vinaphone、Mobifoneの3社あり。Viettelが最もエリアが広い。1ヶ月無制限で約10ドル。パスポートが必要です。',
    country_name: 'ベトナム',
    category: 'sim',
    author_email: 'sato@example.com',
    view_count: 750,
    featured: false
  },
  # マレーシア 🇲🇾
  {
    title: 'クアラルンプールの格安ホステルおすすめ',
    content: 'KLで安く泊まるなら、チャイナタウン周辺のホステルがおすすめ。1泊8-12リンギット（約2-3ドル）で泊まれます。WiFi、エアコン、ロッカー完備。バスルームは共有ですが清潔です。',
    country_name: 'マレーシア',
    category: '宿',
    author_email: 'tanaka@example.com',
    view_count: 890,
    featured: false
  },
  {
    title: 'マレーシアのローカルフード完全ガイド',
    content: 'ナシレマ（ココナッツライス）、ラクサ（麺料理）、サテー（串焼き）、ロティチャナイ（パン）は必食。ローカルレストランで1食5-8リンギット。観光地のレストランは2倍以上するので注意。',
    country_name: 'マレーシア',
    category: 'レストラン',
    author_email: 'yamada@example.com',
    view_count: 650,
    featured: false
  },
  # タイ 🇹🇭
  {
    title: 'バンコクの安い宿泊先完全ガイド',
    content: 'カオサン通り周辺がバックパッカーには最適。1泊200-400バーツ（約6-12ドル）で泊まれます。エアコン、WiFi、プール付きのホステルもあります。予約は前日までに済ませましょう。',
    country_name: 'タイ',
    category: '宿',
    author_email: 'emma@example.com',
    view_count: 2100,
    featured: true
  },
  {
    title: 'タイの屋台で食べるべき料理トップ10',
    content: 'パッタイ、トムヤムクン、ソムタム、ガパオライス、マンゴースティッキーライス、グリーンカレー、パドタイ、カオマンガイ、バミー、ロティ。どの屋台でも1食50-100バーツ（約1.5-3ドル）で食べられます。',
    country_name: 'タイ',
    category: 'レストラン',
    author_email: 'emma@example.com',
    view_count: 1850,
    featured: true
  },
  {
    title: 'タイのSIMカード購入方法と料金',
    content: '空港でAIS、True、dtacの3社から選べます。1ヶ月無制限で約300バーツ（約9ドル）。パスポート提示が必要。街のショップでも買えますが、空港の方が英語対応が良いです。',
    country_name: 'タイ',
    category: 'sim',
    author_email: 'sato@example.com',
    view_count: 1200,
    featured: false
  },
  {
    title: 'タイの治安と安全に過ごすコツ',
    content: 'タイは比較的安全ですが、スリや詐欺に注意。観光地では値段交渉が必須。タクシーはメーター使用を確認。夜間の一人歩きは避け、貴重品は分散して保管しましょう。',
    country_name: 'タイ',
    category: '治安',
    author_email: 'suzuki@example.com',
    view_count: 950,
    featured: false
  },
  # ラオス 🇱🇦
  {
    title: 'ルアンパバーンの安い宿とゲストハウス',
    content: 'ルアンパバーンは小さな街なので、どこに泊まっても中心部から近い。1泊5-10ドルで泊まれます。メコン川沿いのゲストハウスがおすすめ。朝の托鉢を見るなら早朝5時起きが必要。',
    country_name: 'ラオス',
    category: '宿',
    author_email: 'tanaka@example.com',
    view_count: 580,
    featured: false
  },
  {
    title: 'ラオスのローカルフード体験記',
    content: 'ラープ（肉のサラダ）、カオピアック（ラオス風フォー）、タママークン（パパイヤサラダ）が美味しい。ローカルレストランで1食2-4ドル。観光客向けレストランは高めなので注意。',
    country_name: 'ラオス',
    category: 'レストラン',
    author_email: 'yamada@example.com',
    view_count: 420,
    featured: false
  },
  # インド 🇮🇳
  {
    title: 'インドの電車で快適に移動する方法',
    content: 'インドの電車は予約が必須。ACクラス（エアコン付き）を選ぶと快適です。食事は車内販売もありますが、駅の屋台の方が美味しいです。荷物は必ずロックし、貴重品は肌身離さず持参してください。',
    country_name: 'インド',
    category: '交通',
    author_email: 'li@example.com',
    view_count: 1100,
    featured: false
  },
  {
    title: 'インドのSIMカード購入とビザ情報',
    content: 'インドのSIMカードは取得に時間がかかります。パスポート、ビザ、写真2枚が必要。空港で買うのが一番簡単。ビザは事前にe-Visaを取得するのがおすすめ。観光ビザで90日間滞在可能。',
    country_name: 'インド',
    category: 'ビザ',
    author_email: 'sato@example.com',
    view_count: 850,
    featured: false
  },
  {
    title: 'インドの決済方法と現金の持ち方',
    content: 'インドは現金社会。クレジットカードは大都市の高級レストランやホテルでしか使えません。ATMは多いですが、手数料がかかります。現金は分散して保管し、小額紙幣を多めに持参しましょう。',
    country_name: 'インド',
    category: '決済',
    author_email: 'tanaka@example.com',
    view_count: 720,
    featured: false
  },
  # ネパール 🇳🇵
  {
    title: 'カトマンズの安い宿とトレッキング準備',
    content: 'カトマンズのタメル地区がバックパッカーの中心地。1泊5-10ドルで泊まれます。トレッキング用品のレンタルも可能。エベレストベースキャンプトレッキングは事前にガイドを手配しましょう。',
    country_name: 'ネパール',
    category: '宿',
    author_email: 'tanaka@example.com',
    view_count: 680,
    featured: false
  },
  {
    title: 'ネパールのモモとダルバート完全ガイド',
    content: 'モモ（餃子）とダルバート（定食）はネパールの定番料理。ローカルレストランで1食200-400ルピー（約2-4ドル）。トレッキング中は山小屋で食事を取りますが、標高が高いほど高くなります。',
    country_name: 'ネパール',
    category: 'レストラン',
    author_email: 'yamada@example.com',
    view_count: 550,
    featured: false
  },
  # ケニア 🇰🇪
  {
    title: 'ナイロビの安全な宿泊先選び',
    content: 'ナイロビは治安に注意が必要。中心部のホステルを選びましょう。1泊15-25ドル。夜間の外出は避け、タクシーを使うのが安全です。サファリツアーは事前に予約するのがおすすめ。',
    country_name: 'ケニア',
    category: '宿',
    author_email: 'sarah@example.com',
    view_count: 780,
    featured: false
  },
  {
    title: 'ケニアのサファリ完全ガイド',
    content: 'マサイマラ国立保護区が最も人気。ビッグ5（ライオン、ゾウ、バッファロー、ヒョウ、サイ）を見るチャンスが高い。サファリツアーは2泊3日で約300-500ドル。雨季は安いですが、動物を見るのは乾季がベスト。',
    country_name: 'ケニア',
    category: '観光地',
    author_email: 'sarah@example.com',
    view_count: 1450,
    featured: true
  },
  # ジンバブエ 🇿🇼
  {
    title: 'ビクトリアの滝への行き方と宿泊',
    content: 'ビクトリアの滝はジンバブエ側とザンビア側から見られます。ジンバブエ側の方が見晴らしが良いです。ビクトリアフォールズの町に宿泊。1泊20-40ドル。雨季（11-3月）は水量が多く迫力満点。',
    country_name: 'ジンバブエ',
    category: '観光地',
    author_email: 'sarah@example.com',
    view_count: 920,
    featured: false
  },
  # ザンビア 🇿🇲
  {
    title: 'ザンビアのサファリとルサカの宿',
    content: 'ザンビアはサウスルアングワ国立公園が有名。ルサカのホステルは1泊15-25ドル。ビクトリアの滝はザンビア側からもアクセス可能。両国をまたぐビザが必要な場合があります。',
    country_name: 'ザンビア',
    category: '宿',
    author_email: 'sarah@example.com',
    view_count: 480,
    featured: false
  },
  # ボツワナ 🇧🇼
  {
    title: 'オカバンゴデルタのサファリ体験',
    content: 'オカバンゴデルタは世界最大の内陸デルタ。モコロ（伝統的なカヌー）でのサファリが人気。マウンに宿泊し、ツアーに参加。2泊3日で約400-600ドル。野生動物が多く、特に鳥類が豊富です。',
    country_name: 'ボツワナ',
    category: '観光地',
    author_email: 'sarah@example.com',
    view_count: 650,
    featured: false
  },
  # ナミビア 🇳🇦
  {
    title: 'ナミビアの砂漠と星空観測',
    content: 'ナミブ砂漠のデッドフレイは世界遺産。ソススフレイに宿泊し、早朝の砂丘ツアーに参加。星空観測も素晴らしい。ウィンドフークからレンタカーでアクセス可能。ガソリンスタンドが少ないので注意。',
    country_name: 'ナミビア',
    category: '観光地',
    author_email: 'sarah@example.com',
    view_count: 720,
    featured: false
  },
  # 南アフリカ 🇿🇦
  {
    title: 'ケープタウンのおすすめホステル',
    content: 'ケープタウンは南アフリカの観光の中心地。ウォーターフロント周辺のホステルがおすすめ。1泊15-30ドル。テーブルマウンテン、ケープポイント、ペンギンビーチは必見。',
    country_name: '南アフリカ',
    category: '宿',
    author_email: 'sarah@example.com',
    view_count: 1100,
    featured: false
  },
  {
    title: '南アフリカの治安と安全対策',
    content: 'ケープタウンは比較的安全ですが、スラムエリアには近づかないこと。夜間の一人歩きは避け、タクシーを使いましょう。ヨハネスブルクは特に注意が必要。貴重品は分散して保管してください。',
    country_name: '南アフリカ',
    category: '治安',
    author_email: 'suzuki@example.com',
    view_count: 890,
    featured: false
  },
  # アルゼンチン 🇦🇷
  {
    title: 'ブエノスアイレスのタンゴと宿泊',
    content: 'ブエノスアイレスはタンゴの街。サンテルモ地区のホステルがおすすめ。1泊20-35ドル。タンゴショーは高級ですが、路上のタンゴは無料で見られます。ステーキハウスも必食。',
    country_name: 'アルゼンチン',
    category: '宿',
    author_email: 'marco@example.com',
    view_count: 980,
    featured: false
  },
  {
    title: 'アルゼンチンのペソ両替と決済',
    content: 'アルゼンチンはインフレが激しく、為替レートが変動します。両替は街の両替所（cueva）で行うと良いレート。クレジットカードは使えますが、現金の方がお得な場合があります。',
    country_name: 'アルゼンチン',
    category: '決済',
    author_email: 'tanaka@example.com',
    view_count: 750,
    featured: false
  },
  {
    title: 'イグアスの滝への行き方',
    content: 'イグアスの滝はアルゼンチン側とブラジル側から見られます。アルゼンチン側の方が見どころが多いです。プエルトイグアスからアクセス。1日で十分見られますが、2日あると余裕を持って楽しめます。',
    country_name: 'アルゼンチン',
    category: '観光地',
    author_email: 'sarah@example.com',
    view_count: 1200,
    featured: true
  },
  # ボリビア 🇧🇴
  {
    title: 'ウユニ塩湖への行き方とツアー',
    content: 'ウユニ塩湖は世界最大の塩湖。ラパスからバスでウユニへ。1泊2日のツアーが人気。朝日の反射が美しい。標高が高いので高山病に注意。酸素ボンベを持参するのがおすすめ。',
    country_name: 'ボリビア',
    category: '観光地',
    author_email: 'sarah@example.com',
    view_count: 1650,
    featured: true
  },
  {
    title: 'ボリビアのビザと入国情報',
    content: '日本人はビザ不要で90日間滞在可能。ただし、黄熱病の予防接種証明書が必要な場合があります。入国時に滞在期間を確認されます。パスポートの有効期限は6ヶ月以上必要です。',
    country_name: 'ボリビア',
    category: 'ビザ',
    author_email: 'sato@example.com',
    view_count: 680,
    featured: false
  },
  # チリ 🇨🇱
  {
    title: 'サンティアゴの宿とアタカマ砂漠',
    content: 'サンティアゴはチリの首都。中心部のホステルは1泊20-35ドル。アタカマ砂漠へのツアーはサンペドロデアタカマから出発。星空観測が素晴らしい。標高が高いので高山病に注意。',
    country_name: 'チリ',
    category: '宿',
    author_email: 'sarah@example.com',
    view_count: 850,
    featured: false
  },
  {
    title: 'チリのパタゴニア完全ガイド',
    content: 'パタゴニアはチリとアルゼンチンにまたがる自然の宝庫。トーレスデルパイネ国立公園が人気。トレッキングは3-5日かかります。装備はしっかりと。天候が変わりやすいので注意。',
    country_name: 'チリ',
    category: '観光地',
    author_email: 'tanaka@example.com',
    view_count: 1100,
    featured: false
  },
  # ペルー 🇵🇪
  {
    title: 'マチュピチュへの行き方完全ガイド',
    content: 'マチュピチュはクスコからアクセス。インカトレイルか電車で行けます。電車はアグアスカリエンテスまで。そこからバスで遺跡へ。チケットは事前予約必須。早朝が空いていておすすめ。',
    country_name: 'ペルー',
    category: '観光地',
    author_email: 'tanaka@example.com',
    view_count: 2100,
    featured: true
  },
  {
    title: 'クスコの安い宿と高山病対策',
    content: 'クスコは標高3400m。高山病に注意が必要です。コカ茶を飲む、ゆっくり行動する、酸素ボンベを用意するのが対策。ホステルは1泊15-25ドル。中心部のプラサデアルマス周辺が便利。',
    country_name: 'ペルー',
    category: '宿',
    author_email: 'tanaka@example.com',
    view_count: 1200,
    featured: false
  },
  {
    title: 'ペルーのローカルフード完全ガイド',
    content: 'セビーチェ（魚のマリネ）、ロモサルタード（牛肉炒め）、アロスコンコン（チキンライス）、クイ（モルモット）が有名。ローカルレストランで1食15-30ソル（約4-8ドル）。',
    country_name: 'ペルー',
    category: 'レストラン',
    author_email: 'yamada@example.com',
    view_count: 950,
    featured: false
  },
  # メキシコ 🇲🇽
  {
    title: 'メキシコシティの安全な宿泊先',
    content: 'メキシコシティは治安に注意が必要。ローマ地区やコンドesa地区のホステルがおすすめ。1泊20-35ドル。夜間の外出は避け、タクシーを使いましょう。Uberも安全です。',
    country_name: 'メキシコ',
    category: '宿',
    author_email: 'sarah@example.com',
    view_count: 980,
    featured: false
  },
  {
    title: 'チチェンイツァとカンクンへの行き方',
    content: 'チチェンイツァはユカタン半島にあるマヤ遺跡。カンクンから日帰りツアーで行けます。早朝が空いていておすすめ。カンクンはリゾート地なので宿泊費が高いです。',
    country_name: 'メキシコ',
    category: '観光地',
    author_email: 'sarah@example.com',
    view_count: 1100,
    featured: false
  },
  {
    title: 'メキシコのタコスとストリートフード',
    content: 'タコス、ケサディーヤ、エルテ、トルタが有名。ストリートフードは1食50-100ペソ（約2.5-5ドル）。衛生面に注意が必要ですが、人気の屋台なら安全です。',
    country_name: 'メキシコ',
    category: 'レストラン',
    author_email: 'yamada@example.com',
    view_count: 850,
    featured: false
  },
  # アメリカ 🇺🇸
  {
    title: 'ニューヨークの格安ホステル選び',
    content: 'NYCのホステルは高いですが、マンハッタン以外を選ぶと安いです。ブルックリンやクイーンズのホステルは1泊30-50ドル。マンハッタンは1泊50-80ドル。予約は早めに。',
    country_name: 'アメリカ合衆国',
    category: '宿',
    author_email: 'sarah@example.com',
    view_count: 1450,
    featured: false
  },
  {
    title: 'アメリカのチップ文化完全ガイド',
    content: 'アメリカではチップが必須。レストランは15-20%、タクシーは10-15%、ホテルは1-2ドル/泊。チップを払わないと失礼になります。現金で払うのが一般的です。',
    country_name: 'アメリカ合衆国',
    category: '文化',
    author_email: 'tanaka@example.com',
    view_count: 1200,
    featured: false
  },
  # 中国 🇨🇳
  {
    title: '北京の宿と万里の長城への行き方',
    content: '北京のホステルは1泊15-30ドル。中心部のホステルが便利。万里の長城はバスでアクセス可能。バダリンと慕田峪が人気。早朝が空いていておすすめ。',
    country_name: '中国',
    category: '宿',
    author_email: 'li@example.com',
    view_count: 1100,
    featured: false
  },
  {
    title: '中国の決済方法とWeChat Pay',
    content: '中国は現金社会からキャッシュレス社会へ。WeChat PayとAlipayが主流。外国人は現金かクレジットカードを使います。両替は銀行で行います。',
    country_name: '中国',
    category: '決済',
    author_email: 'tanaka@example.com',
    view_count: 850,
    featured: false
  },
  # バングラデシュ 🇧🇩
  {
    title: 'ダッカの宿と交通手段',
    content: 'ダッカは世界で最も人口密度が高い都市の一つ。ホステルは1泊10-20ドル。交通はリキシャ（人力車）とバスが主流。渋滞が激しいので時間に余裕を持ちましょう。',
    country_name: 'バングラデシュ',
    category: '宿',
    author_email: 'tanaka@example.com',
    view_count: 420,
    featured: false
  },
  {
    title: 'バングラデシュのローカルフード',
    content: 'ビリヤニ（スパイスライス）、カレー、サモサが有名。ローカルレストランで1食200-500タカ（約2-5ドル）。衛生面に注意が必要ですが、人気のレストランなら安全です。',
    country_name: 'バングラデシュ',
    category: 'レストラン',
    author_email: 'yamada@example.com',
    view_count: 380,
    featured: false
  },
  # ヨーロッパ（ランダム4カ国）
  {
    title: 'パリの格安ホステルと観光スポット',
    content: 'パリのホステルは高いですが、郊外を選ぶと安いです。1泊30-50ユーロ。中心部は1泊50-80ユーロ。ルーブル、エッフェル塔、ノートルダム大聖堂は必見。',
    country_name: 'フランス',
    category: '宿',
    author_email: 'pierre@example.com',
    view_count: 1800,
    featured: true
  },
  {
    title: 'ローマの観光とピザ完全ガイド',
    content: 'ローマは歴史の街。コロッセオ、フォロロマーノ、バチカンは必見。ピザは1枚5-10ユーロ。ジェラートも必食。観光地のレストランは高めなので、路地裏のレストランがおすすめ。',
    country_name: 'イタリア',
    category: '観光地',
    author_email: 'marco@example.com',
    view_count: 1650,
    featured: true
  },
  {
    title: 'バルセロナのタパスとサグラダファミリア',
    content: 'バルセロナはガウディの街。サグラダファミリアは事前予約必須。タパスは1皿3-8ユーロ。ランブラス通りが有名ですが、路地裏のバルが本格的。',
    country_name: 'スペイン',
    category: 'レストラン',
    author_email: 'pierre@example.com',
    view_count: 1200,
    featured: false
  },
  {
    title: 'ベルリンの壁とビール文化',
    content: 'ベルリンは歴史と文化の街。ベルリンの壁、ブランデンブルク門、博物館島は必見。ビールは1杯3-5ユーロ。ビアガーデンで地元の人と交流できます。',
    country_name: 'ドイツ',
    category: '文化',
    author_email: 'tanaka@example.com',
    view_count: 950,
    featured: false
  }
]

dummy_posts.each do |post_data|
  country = Country.find_by(name: post_data[:country_name])
  author = User.find_by(email: post_data[:author_email])
  
  if country && author
    post = Post.find_or_create_by(
      title: post_data[:title],
      user: author,
      country: country
    ) do |p|
      p.content = post_data[:content]
      p.category = post_data[:category]
      p.likes_count = rand(0..50)
      p.view_count = post_data[:view_count] || rand(10..500)
      p.featured = post_data[:featured] || false
    end
    
    # 既存の投稿も更新
    if post.persisted? && !post.new_record?
      post.update(
        view_count: post_data[:view_count] || post.view_count || rand(10..500),
        featured: post_data[:featured] || false
      )
    end
  else
    puts "⚠️  Could not find country: #{post_data[:country_name]} or author: #{post_data[:author_email]}"
  end
end

puts "ダミーデータの作成が完了しました！"
puts "- ユーザー: #{User.count}人"
puts "- 投稿: #{Post.count}件"
puts "- 国: #{Country.count}カ国"
puts "- エリア: #{Area.count}エリア"
