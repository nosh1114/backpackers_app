import { useState, useEffect, useRef } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { MapPin, ChevronRight } from 'lucide-react';
import { apiClient } from '../lib/api';

interface Country {
  id: number;
  code: string;
  name: string;
  flag_emoji: string;
  tip_count: number;
  view_count: number;
}

interface Area {
  id: number;
  name: string;
  countries: Country[];
}

export function CountriesPage() {
  const [searchParams] = useSearchParams();
  const areaParam = searchParams.get('area');
  const [areas, setAreas] = useState<Area[]>([]);
  const [loading, setLoading] = useState(true);
  const areaRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  useEffect(() => {
    fetchCountriesByAreas();
  }, []);

  // エリアパラメータがある場合、そのエリアにスクロール
  useEffect(() => {
    if (!loading && areaParam && areaRefs.current[areaParam]) {
      setTimeout(() => {
        areaRefs.current[areaParam]?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    }
  }, [loading, areaParam]);

  const fetchCountriesByAreas = async () => {
    try {
      setLoading(true);
      const response = await apiClient.getCountriesByAreas();
      
      if (response.data) {
        setAreas(response.data.areas);
      }
    } catch (error) {
      console.error('Error fetching countries by areas:', error);
    } finally {
      setLoading(false);
    }
  };

  // エリア名に基づいて画像URLを取得
  const getAreaImageUrl = (areaName: string): string => {
    const areaImageMap: { [key: string]: string } = {
      'アジア': 'https://images.unsplash.com/photo-1535139262971-c51845709a48?auto=format&fit=crop&w=600&q=80',
      'ヨーロッパ': 'https://images.unsplash.com/photo-1467269204594-9661b134dd2b?auto=format&fit=crop&w=600&q=80',
      'アフリカ': 'https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?auto=format&fit=crop&w=600&q=80',
      '北米': 'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?auto=format&fit=crop&w=600&q=80',
      '南米': 'https://images.unsplash.com/photo-1587595431973-160d0d94add1?auto=format&fit=crop&w=600&q=80',
      'オセアニア': 'https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?auto=format&fit=crop&w=600&q=80',
      '中東': 'https://images.unsplash.com/photo-1535139262971-c51845709a48?auto=format&fit=crop&w=600&q=80',
      '中央アジア': 'https://images.unsplash.com/photo-1535139262971-c51845709a48?auto=format&fit=crop&w=600&q=80',
    };

    return areaImageMap[areaName] || 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=600&q=80';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="space-y-8">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white rounded-xl shadow-sm p-6 animate-pulse">
                <div className="h-6 bg-gray-200 rounded mb-4 w-32"></div>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {[...Array(8)].map((_, j) => (
                    <div key={j} className="h-20 bg-gray-200 rounded"></div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-3xl font-bold text-gray-900">人気の国一覧</h1>
          <p className="text-gray-600 mt-2">エリア別に人気の国を探す</p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-12">
          {areas.map((area) => {
            // 投稿がある国のみ表示（最大20カ国）
            const countriesWithPosts = area.countries.filter(c => c.tip_count > 0).slice(0, 20);
            
            if (countriesWithPosts.length === 0) {
              return null;
            }

            return (
              <div 
                key={area.id} 
                ref={(el) => { areaRefs.current[area.name] = el; }}
                className={`bg-white rounded-xl shadow-sm border border-gray-200 p-6 ${areaParam === area.name ? 'ring-2 ring-blue-500' : ''}`}
              >
                {/* エリアヘッダー */}
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                    <img
                      src={getAreaImageUrl(area.name)}
                      alt={area.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">{area.name}</h2>
                    <p className="text-sm text-gray-600">{countriesWithPosts.length}カ国</p>
                  </div>
                </div>

                {/* 国一覧 */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                  {countriesWithPosts.map((country) => (
                    <Link
                      key={country.id}
                      to={`/country/${encodeURIComponent(country.name)}`}
                      className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 hover:border-blue-500 hover:bg-blue-50 transition-colors group"
                    >
                      <span className="text-2xl flex-shrink-0">{country.flag_emoji}</span>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-gray-900 truncate group-hover:text-blue-600">
                          {country.name}
                        </div>
                        <div className="text-xs text-gray-500 mt-0.5">
                          {country.tip_count}件の投稿
                        </div>
                      </div>
                      <ChevronRight className="h-4 w-4 text-gray-400 group-hover:text-blue-600 flex-shrink-0" />
                    </Link>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* 空状態 */}
        {areas.length === 0 && (
          <div className="text-center py-16">
            <MapPin className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-gray-900 mb-2">
              国が見つかりませんでした
            </h3>
            <p className="text-gray-600">
              投稿がまだないようです。
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

