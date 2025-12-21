import { Link } from 'react-router-dom';
import { Eye } from 'lucide-react';

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
}

interface FeaturedArticlesSectionProps {
  articles: Article[];
  title?: string;
}

// 記事に画像がない場合のデフォルト画像を生成
const getArticleImageUrl = (article: Article): string => {
  if (article.img) {
    return article.img;
  }
  
  // タイトルに基づいて適切な画像を選択
  const title = article.title.toLowerCase();
  if (title.includes('イタリア')) {
    return 'https://images.unsplash.com/photo-1498522544924-8fcd7e24b7bf?auto=format&fit=crop&w=400&q=80';
  }
  if (title.includes('ギリシャ')) {
    return 'https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=400&q=80';
  }
  if (title.includes('日本')) {
    return 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=400&q=80';
  }
  if (title.includes('タイ')) {
    return 'https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?auto=format&fit=crop&w=400&q=80';
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
      <h2 className="text-lg font-bold text-gray-800 mb-4">{title}</h2>
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
              <h3 className="text-xs font-bold text-gray-800 mb-2 line-clamp-2">{article.title}</h3>
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-1">
                  {article.user?.avatar_url ? (
                    <div className="w-4 h-4 rounded-full bg-gray-300 overflow-hidden">
                      <img 
                        src={article.user.avatar_url} 
                        className="w-full h-full object-cover rounded-full" 
                        alt={article.user.name || 'user'} 
                      />
                    </div>
                  ) : (
                    <div className="w-4 h-4 rounded-full bg-gray-300"></div>
                  )}
                  <span className="text-[10px] text-gray-500">
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

