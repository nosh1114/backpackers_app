import { Link } from 'react-router-dom';
import { Eye } from 'lucide-react';

interface SearchResultCardProps {
  post: {
    id: number;
    title: string;
    content: string;
    user: {
      name: string;
      avatar_url?: string;
    };
    view_count?: number;
    img?: string; // 画像URL（オプション）
  };
}

// 記事に画像がない場合のデフォルト画像を生成
const getArticleImageUrl = (title: string, img?: string): string => {
  if (img) return img;
  
  const lowerTitle = title.toLowerCase();
  if (lowerTitle.includes('イタリア')) return 'https://images.unsplash.com/photo-1498522544924-8fcd7e24b7bf?auto=format&fit=crop&w=400&q=80';
  if (lowerTitle.includes('ギリシャ')) return 'https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=400&q=80';
  if (lowerTitle.includes('日本')) return 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=400&q=80';
  if (lowerTitle.includes('タイ')) return 'https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?auto=format&fit=crop&w=400&q=80';
  if (lowerTitle.includes('シンガポール')) return 'https://images.unsplash.com/photo-1565963036838-a79638f67464?auto=format&fit=crop&w=400&q=80';
  
  return 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=400&q=80';
};

// ビュー数をフォーマット
const formatViews = (views?: number): string => {
  if (!views) return '0';
  if (views >= 1000) {
    return `${(views / 1000).toFixed(1)}K`;
  }
  return views.toString();
};

export function SearchResultCard({ post }: SearchResultCardProps) {
  return (
    <Link to={`/posts/${post.id}`} className="block bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100 hover:shadow-md transition-shadow">
      <div className="flex h-32">
        <div className="w-1/3 relative">
          <img 
            src={getArticleImageUrl(post.title, post.img)} 
            alt={post.title} 
            className="w-full h-full object-cover absolute inset-0"
          />
        </div>
        <div className="w-2/3 p-3 flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-gray-900 line-clamp-2 mb-1">{post.title}</h3>
            <p className="text-xs text-gray-500 line-clamp-2">{post.content}</p>
          </div>
          <div className="flex justify-between items-center mt-2">
            <div className="flex items-center gap-1.5">
              {post.user.avatar_url ? (
                <div className="w-5 h-5 rounded-full bg-gray-200 overflow-hidden">
                  <img src={post.user.avatar_url} alt={post.user.name} className="w-full h-full object-cover" />
                </div>
              ) : (
                <div className="w-5 h-5 rounded-full bg-gray-200"></div>
              )}
              <span className="text-xs text-gray-500">{post.user.name}</span>
            </div>
            <div className="flex items-center gap-1 text-gray-400">
              <Eye size={12} />
              <span className="text-xs">{formatViews(post.view_count)}</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}

