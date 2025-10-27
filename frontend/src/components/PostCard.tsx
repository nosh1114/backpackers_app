import { Heart, MessageCircle, Share2, Flag, User, Calendar } from 'lucide-react';

interface Post {
  id: number;
  title: string;
  content: string;
  category?: string;
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
  likes_count?: number;
  comments_count?: number;
  is_liked?: boolean;
}

interface PostCardProps {
  post: Post;
  onLike?: (postId: number) => void;
  onComment?: (postId: number) => void;
  onShare?: (postId: number) => void;
  compact?: boolean;
}

export function PostCard({ 
  post, 
  onLike, 
  onComment, 
  onShare, 
  compact = false 
}: PostCardProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) {
      return 'たった今';
    } else if (diffInHours < 24) {
      return `${diffInHours}時間前`;
    } else if (diffInHours < 48) {
      return '昨日';
    } else {
      return date.toLocaleDateString('ja-JP', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    }
  };

  const truncateContent = (content: string, maxLength: number = 200) => {
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength) + '...';
  };

  return (
    <div className={`bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow ${
      compact ? 'p-4' : 'p-6'
    }`}>
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="flex-shrink-0">
            {post.user.avatar_url ? (
              <img
                src={post.user.avatar_url}
                alt={post.user.name}
                className="w-10 h-10 rounded-full object-cover"
              />
            ) : (
              <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                <User className="h-5 w-5 text-gray-500" />
              </div>
            )}
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">{post.user.name}</h3>
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <Flag className="h-4 w-4" />
              <span>{post.country.flag_emoji} {post.country.name}</span>
              <span>•</span>
              <div className="flex items-center space-x-1">
                <Calendar className="h-4 w-4" />
                <span>{formatDate(post.created_at)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <h2 className={`font-bold text-gray-900 ${
            compact ? 'text-lg' : 'text-xl'
          }`}>
            {post.title}
          </h2>
          {post.category && (
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
              {post.category}
            </span>
          )}
        </div>
        <p className={`text-gray-700 leading-relaxed ${
          compact ? 'text-sm' : 'text-base'
        }`}>
          {compact ? truncateContent(post.content, 150) : post.content}
        </p>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
        <div className="flex items-center space-x-6">
          <button
            onClick={() => onLike?.(post.id)}
            className={`flex items-center space-x-2 text-sm transition-colors ${
              post.is_liked 
                ? 'text-red-600 hover:text-red-700' 
                : 'text-gray-500 hover:text-red-600'
            }`}
          >
            <Heart className={`h-5 w-5 ${post.is_liked ? 'fill-current' : ''}`} />
            <span>{post.likes_count || 0}</span>
          </button>
          
          <button
            onClick={() => onComment?.(post.id)}
            className="flex items-center space-x-2 text-sm text-gray-500 hover:text-blue-600 transition-colors"
          >
            <MessageCircle className="h-5 w-5" />
            <span>{post.comments_count || 0}</span>
          </button>
          
          <button
            onClick={() => onShare?.(post.id)}
            className="flex items-center space-x-2 text-sm text-gray-500 hover:text-green-600 transition-colors"
          >
            <Share2 className="h-5 w-5" />
            <span>共有</span>
          </button>
        </div>
      </div>
    </div>
  );
}
