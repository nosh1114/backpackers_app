import { Link } from 'react-router-dom';
import { Eye } from 'lucide-react';
import { getCountryImageUrl } from '../lib/countryImages';
import { getFullImageUrl } from '../lib/api';

interface SearchResultCardProps {
  post: {
    id: number;
    title: string;
    content: string;
    images?: string[];
    country?: {
      id: number;
      code: string;
      name: string;
      flag_emoji: string;
      image_url?: string;
    };
    user: {
      name: string;
      avatar_url?: string;
    };
    view_count?: number;
  };
}

// 記事の画像URLを取得（優先順位: 記事の画像 > 国の画像 > デフォルト）
const getPostImageUrl = (post: SearchResultCardProps['post']): string => {
  // 1. 記事に添付された画像があればそれを使う
  if (post.images && post.images.length > 0 && post.images[0]) {
    // 相対パスの場合はフルURLに変換
    return getFullImageUrl(post.images[0]) || post.images[0];
  }
  
  // 2. 国の画像（DBから）を使う
  if (post.country?.image_url) {
    return post.country.image_url;
  }
  
  // 3. 国名からフォールバック画像を取得
  if (post.country?.name) {
    return getCountryImageUrl(post.country.name);
  }
  
  // 4. デフォルト画像
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
            src={getPostImageUrl(post)} 
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

