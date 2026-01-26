import { Link } from 'react-router-dom';
import { Eye } from 'lucide-react';
import { getCountryImageUrl } from '../lib/countryImages';
import { getAvatarUrl } from '../lib/gravatar';

interface Article {
  id: number;
  title: string;
  views?: string | number;
  user?: {
    name: string;
    avatar_url?: string;
  };
  img?: string;
  view_count?: number;
  country?: {
    name: string;
    image_url?: string;
  };
}

interface FeaturedArticlesSectionProps {
  articles: Article[];
  title?: string;
}

// 記事の画像URL取得（投稿画像 > 国のAPI画像 > フォールバック）
const getArticleImageUrl = (article: Article): string => {
  if (article.img) {
    return article.img;
  }
  
  // 国のAPI画像を優先
  if (article.country?.image_url) {
    return article.country.image_url;
  }
  
  // フォールバック：国名からフロントエンドの画像マッピングを使用
  if (article.country?.name) {
    return getCountryImageUrl(article.country.name, 400);
  }
  
  // デフォルト画像
  return 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=400&q=80';
};

// ビュー数をフォーマット
const formatViews = (views?: string | number): string => {
  if (!views) return '0';
  if (typeof views === 'string') return views;
  if (views >= 1000) {
    return `${(views / 1000).toFixed(1)}K`;
  }
  return views.toString();
};

export function FeaturedArticlesSection({ 
  articles, 
  title = '特集記事' 
}: FeaturedArticlesSectionProps) {
  return (
    <section>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-bold text-gray-800">{title}</h2>
        <Link 
          to="/featured"
          className="text-xs text-blue-500 font-bold hover:text-blue-700 transition-colors"
        >
          一覧を見る →
        </Link>
      </div>
      <div className="grid grid-cols-2 gap-4">
        {articles.map((article) => (
          <Link
            key={article.id}
            to={`/posts/${article.id}`}
            className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow"
          >
            <div className="h-32 overflow-hidden">
              <img 
                src={getArticleImageUrl(article)} 
                alt={article.title} 
                className="w-full h-full object-cover transform hover:scale-105 transition duration-300"
                loading="lazy"
              />
            </div>
            <div className="p-3">
              <h3 className="text-sm font-bold text-gray-800 mb-2 line-clamp-2 min-h-[2.5rem]">{article.title}</h3>
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-1">
                  <div className="w-4 h-4 rounded-full bg-gray-300 overflow-hidden">
                    <img 
                      src={getAvatarUrl(article.user?.avatar_url, undefined, 16)} 
                      className="w-full h-full object-cover rounded-full" 
                      alt={article.user?.name || 'user'} 
                    />
                  </div>
                  <span className="text-[10px] text-gray-500 truncate max-w-[60px]">
                    {article.user?.name || 'ユーザー'}
                  </span>
                </div>
                <div className="flex items-center gap-0.5 text-gray-400">
                  <Eye size={10} />
                  <span className="text-[10px]">
                    {formatViews(article.views || article.view_count)}
                  </span>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

