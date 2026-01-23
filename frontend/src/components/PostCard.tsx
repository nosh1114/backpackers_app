import { Heart, MessageCircle, User, Eye } from 'lucide-react';
import { Link } from 'react-router-dom';

interface Post {
  id: number;
  title: string;
  content: string;
  category?: string;
  featured?: boolean;
  img?: string;
  country: {
    id: number;
    code: string;
    name: string;
    flag_emoji: string;
  };
  user: {
    id: number;
    name: string;
    avatar_url?: string;
  };
  created_at: string;
  updated_at: string;
  view_count?: number;
  likes_count?: number;
  comments_count?: number;
  is_liked?: boolean;
}

interface PostCardProps {
  post: Post;
}

export function PostCard({ post }: PostCardProps) {

  const truncateContent = (content: string, maxLength: number = 200) => {
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength) + '...';
  };

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

  return (
    <Link 
      to={`/posts/${post.id}`}
      className="block bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow overflow-hidden"
    >
      <div className="flex h-40 min-h-[160px]">
        {/* 画像セクション */}
        <div className="w-1/3 relative flex-shrink-0 overflow-hidden">
          <img 
            src={getArticleImageUrl(post.title, post.img)} 
            alt={post.title} 
            className="w-full h-full object-cover"
            loading="lazy"
          />
          {post.featured && (
            <span className="absolute top-2 left-2 inline-flex items-center px-2 py-1 rounded-full text-xs bg-yellow-100 text-yellow-800 font-semibold z-10">
              特集
            </span>
          )}
        </div>

        {/* コンテンツセクション */}
        <div className="w-2/3 p-4 flex flex-col justify-between min-w-0">
          <div className="flex-1 min-h-0 overflow-hidden">
            {/* タイトルとカテゴリー */}
            <div className="flex items-start gap-2 mb-2">
              <h2 className="font-bold text-gray-900 text-base line-clamp-2 flex-1 min-w-0">
                {post.title}
              </h2>
              {post.category && (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800 flex-shrink-0">
                  {post.category}
                </span>
              )}
            </div>

            {/* 記事の抜粋 */}
            <p className="text-sm text-gray-600 line-clamp-2 mb-3 overflow-hidden">
              {truncateContent(post.content, 100)}
            </p>
          </div>

          {/* フッター（ユーザー情報と統計） */}
          <div className="flex items-center justify-between pt-3 border-t border-gray-100 flex-shrink-0">
            <div className="flex items-center gap-2 min-w-0 flex-shrink">
              {post.user.avatar_url ? (
                <img
                  src={post.user.avatar_url}
                  alt={post.user.name}
                  className="w-6 h-6 rounded-full object-cover flex-shrink-0"
                />
              ) : (
                <div className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0">
                  <User className="h-3 w-3 text-gray-500" />
                </div>
              )}
              <span className="text-xs text-gray-600 truncate">{post.user.name}</span>
            </div>

            {/* 統計情報 */}
            <div className="flex items-center gap-3 text-xs text-gray-500 flex-shrink-0">
              <div className="flex items-center gap-1">
                <Eye className="h-3.5 w-3.5 flex-shrink-0" />
                <span className="whitespace-nowrap">{formatViews(post.view_count)}</span>
              </div>
              <div className="flex items-center gap-1">
                <Heart className={`h-3.5 w-3.5 flex-shrink-0 ${post.is_liked ? 'fill-current text-red-600' : ''}`} />
                <span className="whitespace-nowrap">{post.likes_count || 0}</span>
              </div>
              <div className="flex items-center gap-1">
                <MessageCircle className="h-3.5 w-3.5 flex-shrink-0" />
                <span className="whitespace-nowrap">{post.comments_count || 0}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
