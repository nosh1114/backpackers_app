import { Link } from 'react-router-dom';
import { getAvatarUrl } from '../lib/gravatar';
import { getCountryImageUrl } from '../lib/countryImages';

interface CountryStats {
  code: string;
  country: string;
  flagEmoji: string;
  imageUrl?: string;  // APIから取得した画像URL
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
        {countries.map((country) => (
          <Link 
            key={country.code} 
            to={`/country/${country.code.toLowerCase()}`}
            className="flex-shrink-0 w-36 bg-white rounded-2xl shadow-md overflow-hidden relative group hover:shadow-lg transition-shadow"
          >
            {/* 国の代表画像（APIからの画像を優先、なければフォールバック） */}
            <div className="w-full h-32 relative overflow-hidden bg-gradient-to-br from-blue-50 to-cyan-50">
              <img 
                src={country.imageUrl || getCountryImageUrl(country.country)} 
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

