import { Link } from 'react-router-dom';

interface Area {
  name: string;
  img: string;
}

interface AreaSectionProps {
  areas: Area[];
  title?: string;
}

// エリア名に基づいてUnsplash画像URLを生成
const getAreaImageUrl = (areaName: string): string => {
  const areaImageMap: { [key: string]: string } = {
    'アジア': 'photo-1535139262971-c51845709a48',
    'ヨーロッパ': 'photo-1467269204594-9661b134dd2b',
    'アフリカ': 'photo-1516026672322-bc52d61a55d5',
    '北米': 'photo-1501594907352-04cda38ebc29',
    '南米': 'photo-1587595431973-160d0d94add1',
    'オセアニア': 'photo-1506973035872-a4ec16b8e8d9',
    '中東': 'photo-1535139262971-c51845709a48',
    '中央アジア': 'photo-1535139262971-c51845709a48',
  };

  const imageId = areaImageMap[areaName];
  
  if (imageId) {
    return `https://images.unsplash.com/${imageId}?auto=format&fit=crop&w=600&q=80`;
  }
  
  // デフォルト画像
  return `https://images.unsplash.com/photo-1535139262971-c51845709a48?auto=format&fit=crop&w=600&q=80`;
};

export function AreaSection({ areas, title = 'エリアで探す' }: AreaSectionProps) {
  return (
    <section className="bg-white border-b border-gray-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h2 className="text-lg font-bold text-gray-800 mb-4">{title}</h2>
        <div className="grid grid-cols-2 gap-3">
          {areas.map((area, index) => (
            <Link
              key={area.name}
              to={`/area/${encodeURIComponent(area.name)}`}
              className="relative rounded-xl overflow-hidden shadow-sm h-24 hover:shadow-md transition-shadow group"
            >
              <img 
                src={area.img || getAreaImageUrl(area.name)} 
                alt={area.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors flex items-center justify-center">
                <span className="text-white font-bold text-sm drop-shadow-md">{area.name}</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

