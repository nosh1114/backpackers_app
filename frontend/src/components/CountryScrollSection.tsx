import { Link } from 'react-router-dom';
import { getAvatarUrl } from '../lib/gravatar';

interface CountryStats {
  country: string;
  flagEmoji: string;
  tipCount: number;
  lastPostDate: string;
  recentTips: Array<{
    id: number;
    title: string;
    category: string;
    author_name: string;
    author_avatar_url?: string;
    author_email?: string;
    created_at: string;
  }>;
}

interface CountryScrollSectionProps {
  countries: CountryStats[];
  title?: string;
  showViewAll?: boolean;
}

// 国名に基づいてUnsplash画像URLを生成
const getCountryImageUrl = (countryName: string): string => {
  // 人気国の特定画像IDマッピング
  const countryImageMap: { [key: string]: string } = {
    '日本': 'photo-1493976040374-85c8e12f0c0e',
    'タイ': 'photo-1552465011-b4e21bf6e79a',
    'フランス': 'photo-1502602898657-3e91760cbb34',
    'スペイン': 'photo-1539037116277-4b208ae96642',
    'ギリシャ': 'photo-1533105079780-92b9be482077',
    'イギリス': 'photo-1513635269975-59663e0ac1ad',
    'ドイツ': 'photo-1467269204594-9661b134dd2b',
    'オーストラリア': 'photo-1506973035872-a4ec16b8e8d9',
    'ニュージーランド': 'photo-1501594907352-04cda38ebc29',
    'アメリカ': 'photo-1501594907352-04cda38ebc29',
    'カナダ': 'photo-1501594907352-04cda38ebc29',
    'メキシコ': 'photo-1587595431973-160d0d94add1',
    'ブラジル': 'photo-1587595431973-160d0d94add1',
    'アルゼンチン': 'photo-1589909202802-8f4aadce1849',
    '南アフリカ': 'photo-1516026672322-bc52d61a55d5',
    'エジプト': 'photo-1535139262971-c51845709a48',
    'インド': 'photo-1535139262971-c51845709a48',
    '中国': 'photo-1535139262971-c51845709a48',
    '韓国': 'photo-1535139262971-c51845709a48',
    'インドネシア': 'photo-1552465011-b4e21bf6e79a',
    'ベトナム': 'photo-1552465011-b4e21bf6e79a',
    'フィリピン': 'photo-1552465011-b4e21bf6e79a',
    'シンガポール': 'photo-1552465011-b4e21bf6e79a',
    'マレーシア': 'photo-1552465011-b4e21bf6e79a',
    'トルコ': 'photo-1513635269975-59663e0ac1ad',
    'モロッコ': 'photo-1516026672322-bc52d61a55d5',
    'アイスランド': 'photo-1501594907352-04cda38ebc29',
    'ノルウェー': 'photo-1501594907352-04cda38ebc29',
    'スウェーデン': 'photo-1501594907352-04cda38ebc29',
    'フィンランド': 'photo-1501594907352-04cda38ebc29',
    'デンマーク': 'photo-1501594907352-04cda38ebc29',
    'オランダ': 'photo-1467269204594-9661b134dd2b',
    'ベルギー': 'photo-1467269204594-9661b134dd2b',
    'スイス': 'photo-1502602898657-3e91760cbb34',
    'オーストリア': 'photo-1502602898657-3e91760cbb34',
    'ポルトガル': 'photo-1539037116277-4b208ae96642',
    'チェコ': 'photo-1467269204594-9661b134dd2b',
    'ポーランド': 'photo-1467269204594-9661b134dd2b',
    'ハンガリー': 'photo-1467269204594-9661b134dd2b',
    'クロアチア': 'photo-1533105079780-92b9be482077',
  };

  const imageId = countryImageMap[countryName];
  
  if (imageId) {
    return `https://images.unsplash.com/${imageId}?auto=format&fit=crop&w=400&q=80`;
  }
  
  // マッピングにない場合は、国名をクエリとして使用
  const encodedCountry = encodeURIComponent(countryName);
  return `https://images.unsplash.com/photo-1535139262971-c51845709a48?auto=format&fit=crop&w=400&q=80&sig=${encodedCountry}`;
};

export function CountryScrollSection({ 
  countries, 
  title = '国で探す',
  showViewAll = true 
}: CountryScrollSectionProps) {
  return (
    <section>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-bold text-gray-800">{title}</h2>
        {showViewAll && (
          <Link 
            to="/countries"
            className="text-xs text-blue-500 font-bold hover:text-blue-700 transition-colors"
          >
            一覧を見る →
          </Link>
        )}
      </div>
      <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar">
        {countries.map((country, index) => (
          <Link 
            key={country.country} 
            to={`/country/${encodeURIComponent(country.country)}`}
            className="flex-shrink-0 w-36 bg-white rounded-2xl shadow-md overflow-hidden relative group hover:shadow-lg transition-shadow"
          >
            {/* Unsplash画像を背景として使用 */}
            <div className="w-full h-32 relative overflow-hidden bg-gradient-to-br from-blue-50 to-cyan-50">
              <img 
                src={getCountryImageUrl(country.country)} 
                alt={country.country}
                className="w-full h-full object-cover"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-black/10 to-transparent"></div>
            </div>
            <div className="p-3">
              <h3 className="font-bold text-sm text-gray-800 mb-1">{country.country}</h3>
              <div className="flex items-center mt-1">
                <div className="flex -space-x-2 mr-2">
                  {country.recentTips.slice(0, 2).map((tip) => (
                    <img 
                      key={tip.id}
                      src={getAvatarUrl(tip.author_avatar_url, tip.author_email, 20)}
                      alt={tip.author_name}
                      className="w-5 h-5 rounded-full border border-white object-cover"
                    />
                  ))}
                  {country.recentTips.length === 0 && (
                    <>
                      <div className="w-5 h-5 rounded-full bg-gray-200 border border-white"></div>
                      <div className="w-5 h-5 rounded-full bg-gray-200 border border-white"></div>
                    </>
                  )}
                </div>
                <span className="text-[10px] text-gray-500">{country.tipCount} Posts</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

