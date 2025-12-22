import { Link } from 'react-router-dom';
import { Search, Menu, Globe, Wifi, Plane, Utensils, Bed, Lightbulb, Eye } from 'lucide-react';

// --- モックデータ (実際のアプリではAPIから取得する想定) ---
const categories = [
  { name: '準備', icon: <Globe size={20} /> },
  { name: '通信', icon: <Wifi size={20} /> },
  { name: '移動', icon: <Plane size={20} /> },
  { name: '食', icon: <Utensils size={20} /> },
  { name: '宿泊', icon: <Bed size={20} /> },
  { name: '裏ワザ', icon: <Lightbulb size={20} /> },
];

const countries = [
  { name: 'アルゼンチン', count: '120 Posts', img: 'https://images.unsplash.com/photo-1589909202802-8f4aadce1849?auto=format&fit=crop&w=300&q=80' },
  { name: '南アフリカ', count: '90 Posts', img: 'https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?auto=format&fit=crop&w=300&q=80' },
  { name: 'タイ', count: '55 Posts', img: 'https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?auto=format&fit=crop&w=300&q=80' },
];

const areas = [
  { name: 'アジア', img: 'https://images.unsplash.com/photo-1535139262971-c51845709a48?auto=format&fit=crop&w=300&q=80' },
  { name: 'ヨーロッパ', img: 'https://images.unsplash.com/photo-1467269204594-9661b134dd2b?auto=format&fit=crop&w=300&q=80' },
  { name: 'アフリカ', img: 'https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?auto=format&fit=crop&w=300&q=80' },
  { name: '北米', img: 'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?auto=format&fit=crop&w=300&q=80' },
  { name: '南米', img: 'https://images.unsplash.com/photo-1587595431973-160d0d94add1?auto=format&fit=crop&w=300&q=80' },
  { name: 'オセアニア', img: 'https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?auto=format&fit=crop&w=300&q=80' },
];

const articles = [
  { title: 'イタリアの秘境が...', views: '1.4K', user: 'ami_12', img: 'https://images.unsplash.com/photo-1498522544924-8fcd7e24b7bf?auto=format&fit=crop&w=300&q=80' },
  { title: 'ギリシャの本気の...', views: '1.4K', user: 'ami_12', img: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=300&q=80' },
  { title: 'イタリアの秘境が...', views: '1.4K', user: 'ami_12', img: 'https://images.unsplash.com/photo-1498522544924-8fcd7e24b7bf?auto=format&fit=crop&w=300&q=80' },
  { title: 'ギリシャの本気の...', views: '1.4K', user: 'ami_12', img: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=300&q=80' },
];

// --- コンポーネント本体 ---
export const BappaNaviPage = () => {
  return (
    <div className="bg-white min-h-screen pb-20 font-sans relative overflow-hidden max-w-md mx-auto border-x border-gray-100 shadow-xl">
      
      {/* 背景の装飾 (青いウェーブ) */}
      <div className="absolute top-0 left-0 w-full h-64 bg-blue-50 rounded-b-[40%] -z-10 transform scale-x-150 translate-y-[-20%]"></div>

      {/* コンテンツエリア */}
      <main className="px-5 mt-4 space-y-8">

        {/* 国で探す (横スクロール) */}
        <section>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold text-gray-800">国で探す</h2>
            <span className="text-xs text-blue-500 font-bold">一覧を見る</span>
          </div>
          <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar">
            {countries.map((country, index) => (
              <div key={index} className="flex-shrink-0 w-36 bg-white rounded-2xl shadow-md overflow-hidden relative group">
                <img src={country.img} alt={country.name} className="w-full h-32 object-cover" />
                <div className="p-3">
                  <h3 className="font-bold text-sm text-gray-800">{country.name}</h3>
                  <div className="flex items-center mt-1">
                    <div className="flex -space-x-2 mr-2">
                        {[1,2].map(i => (
                           <div key={i} className="w-5 h-5 rounded-full bg-gray-200 border border-white"></div> 
                        ))}
                    </div>
                    <span className="text-[10px] text-gray-500">{country.count}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* エリアで探す */}
        <section>
          <h2 className="text-lg font-bold text-gray-800 mb-4">エリアで探す</h2>
          <div className="grid grid-cols-2 gap-3">
            {areas.map((area, index) => (
              <div key={index} className="relative rounded-xl overflow-hidden shadow-sm h-24">
                <img src={area.img} alt={area.name} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                  <span className="text-white font-bold text-sm drop-shadow-md">{area.name}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 特集記事 */}
        <section>
          <h2 className="text-lg font-bold text-gray-800 mb-4">特集記事</h2>
          <div className="grid grid-cols-2 gap-4">
            {articles.map((article, index) => (
              <div key={index} className="bg-white rounded-xl shadow-md overflow-hidden">
                <div className="h-32 overflow-hidden">
                    <img src={article.img} alt={article.title} className="w-full h-full object-cover transform hover:scale-105 transition duration-300" />
                </div>
                <div className="p-3">
                  <h3 className="text-xs font-bold text-gray-800 mb-2 line-clamp-2">{article.title}</h3>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-1">
                      <div className="w-4 h-4 rounded-full bg-gray-300">
                          <img src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=50&q=80" className="rounded-full" alt="user" />
                      </div>
                      <span className="text-[10px] text-gray-500">{article.user}</span>
                    </div>
                    <div className="flex items-center gap-0.5 text-gray-400">
                      <Eye size={10} />
                      <span className="text-[10px]">{article.views}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

      </main>
    </div>
  );
};

