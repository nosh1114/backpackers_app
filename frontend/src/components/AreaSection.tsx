import { Link } from 'react-router-dom';
import { AREAS } from '../lib/areaMapping';

interface AreaSectionProps {
  title?: string;
}

export function AreaSection({ title = 'エリアで探す' }: AreaSectionProps) {
  return (
    <section className="bg-white border-b border-gray-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h2 className="text-lg font-bold text-gray-800 mb-4">{title}</h2>
        <div className="grid grid-cols-2 gap-3">
          {AREAS.map((area) => (
            <Link
              key={area.slug}
              to={`/countries?area=${area.slug}`}
              className="relative rounded-xl overflow-hidden shadow-sm h-24 hover:shadow-md transition-shadow group"
            >
              <img 
                src={area.imageUrl} 
                alt={area.nameJa}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors flex items-center justify-center">
                <span className="text-white font-bold text-sm drop-shadow-md">{area.nameJa}</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
