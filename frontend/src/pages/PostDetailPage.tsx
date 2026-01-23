import { useState, useEffect, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Heart, Eye, MessageCircle, Send, MoreHorizontal, Pencil, Trash2, Loader2, X, Check } from 'lucide-react';
import { apiClient } from '../lib/api';
import { useAuth } from '../contexts/AuthContext';
import { getAvatarUrl } from '../lib/gravatar';

interface Comment {
  id: number;
  content: string;
  user: {
    id: number;
    name: string;
    avatar_url?: string;
    email?: string;
  };
  created_at: string;
}

interface Post {
  id: number;
  title: string;
  content: string;
  category?: string;
  featured?: boolean;
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
    email?: string;
  };
  view_count?: number;
  likes_count?: number;
  comments_count?: number;
  created_at: string;
  updated_at: string;
}

export const PostDetailPage = () => {
  const { postId } = useParams<{ postId: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [relatedPosts, setRelatedPosts] = useState<Post[]>([]);
  
  // コメント関連
  const [comments, setComments] = useState<Comment[]>([]);
  const [commentsLoading, setCommentsLoading] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [submittingComment, setSubmittingComment] = useState(false);
  const [showAllComments, setShowAllComments] = useState(false);
  
  // コメント編集関連
  const [editingCommentId, setEditingCommentId] = useState<number | null>(null);
  const [editingContent, setEditingContent] = useState('');
  const [menuOpenCommentId, setMenuOpenCommentId] = useState<number | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const viewCountedRef = useRef<string | null>(null);

  // メニューの外をクリックしたら閉じる
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpenCommentId(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (postId) {
      // view_countの重複カウントを防ぐ（StrictMode対策）
      const shouldCountView = viewCountedRef.current !== postId;
      fetchPost(shouldCountView);
      if (shouldCountView) {
        viewCountedRef.current = postId;
      }
      fetchComments();
    }
  }, [postId]);

  // userが変更されたときにいいね状態を取得
  useEffect(() => {
    if (postId && user) {
      fetchLikeStatus();
    }
  }, [postId, user]);

  const fetchPost = async (countView: boolean = true) => {
    try {
      setLoading(true);
      const response = await apiClient.getPost(postId!, countView);
      
      if (response.data) {
        setPost(response.data.post);
        setLikesCount(response.data.post.likes_count || 0);
      }
    } catch (error) {
      console.error('Error fetching post:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchComments = async () => {
    try {
      setCommentsLoading(true);
      const response = await apiClient.getComments(postId!);
      
      if (response.data?.comments) {
        setComments(response.data.comments);
      }
    } catch (error) {
      console.error('Error fetching comments:', error);
    } finally {
      setCommentsLoading(false);
    }
  };

  const fetchLikeStatus = async () => {
    try {
      const response = await apiClient.getLikeStatus(postId!);
      if (response.data) {
        setIsLiked(response.data.liked);
        setLikesCount(response.data.likes_count);
      }
    } catch (error) {
      console.error('Error fetching like status:', error);
    }
  };

  const handleToggleLike = async () => {
    if (!user) {
      navigate('/auth');
      return;
    }

    try {
      const response = await apiClient.toggleLike(postId!);
      if (response.data) {
        setIsLiked(response.data.liked);
        setLikesCount(response.data.likes_count);
      }
    } catch (error) {
      console.error('Error toggling like:', error);
    }
  };

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      navigate('/auth');
      return;
    }

    if (!newComment.trim()) return;

    try {
      setSubmittingComment(true);
      const response = await apiClient.createComment(postId!, newComment.trim());
      
      if (response.data?.comment) {
        setComments([response.data.comment, ...comments]);
        setNewComment('');
      } else if (response.error) {
        alert('コメントの投稿に失敗しました: ' + response.error);
      }
    } catch (error) {
      console.error('Error submitting comment:', error);
      alert('コメントの投稿に失敗しました');
    } finally {
      setSubmittingComment(false);
    }
  };

  const handleEditComment = (comment: Comment) => {
    setEditingCommentId(comment.id);
    setEditingContent(comment.content);
    setMenuOpenCommentId(null);
  };

  const handleCancelEdit = () => {
    setEditingCommentId(null);
    setEditingContent('');
  };

  const handleSaveEdit = async (commentId: number) => {
    if (!editingContent.trim()) return;

    try {
      const response = await apiClient.updateComment(postId!, commentId, editingContent.trim());
      
      if (response.data?.comment) {
        setComments(comments.map(c => 
          c.id === commentId ? { ...c, content: response.data!.comment.content } : c
        ));
        setEditingCommentId(null);
        setEditingContent('');
      } else if (response.error) {
        alert('編集に失敗しました: ' + response.error);
      }
    } catch (error) {
      console.error('Error updating comment:', error);
      alert('編集に失敗しました');
    }
  };

  const handleDeleteComment = async (commentId: number) => {
    if (!confirm('コメントを削除しますか？')) return;

    try {
      const response = await apiClient.deleteComment(postId!, commentId);
      if (response.data) {
        setComments(comments.filter(c => c.id !== commentId));
      } else if (response.error) {
        alert('削除に失敗しました: ' + response.error);
      }
    } catch (error) {
      console.error('Error deleting comment:', error);
      alert('削除に失敗しました');
    }
    setMenuOpenCommentId(null);
  };

  const canEditOrDeleteComment = (comment: Comment) => {
    if (!user) return false;
    return String(user.id) === String(comment.user.id) || user.admin;
  };

  useEffect(() => {
    const fetchRelatedPosts = async () => {
      try {
        if (post?.country?.id) {
          const response = await apiClient.getPostsByCountry(post.country.id, {
            per_page: 5,
            sort: 'popular'
          });
          
          if (response.data) {
            const filtered = response.data.posts.filter((p: Post) => p.id.toString() !== postId).slice(0, 4);
            setRelatedPosts(filtered);
          }
        }
      } catch (error) {
        console.error('Error fetching related posts:', error);
      }
    };

    if (post?.country?.id) {
      fetchRelatedPosts();
    }
  }, [post?.country?.id, postId]);

  const getArticleImageUrl = (title: string): string => {
    const lowerTitle = title.toLowerCase();
    if (lowerTitle.includes('イタリア')) return 'https://images.unsplash.com/photo-1498522544924-8fcd7e24b7bf?auto=format&fit=crop&w=1200&q=80';
    if (lowerTitle.includes('ギリシャ')) return 'https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=1200&q=80';
    if (lowerTitle.includes('日本')) return 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1200&q=80';
    if (lowerTitle.includes('タイ')) return 'https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?auto=format&fit=crop&w=1200&q=80';
    if (lowerTitle.includes('シンガポール')) return 'https://images.unsplash.com/photo-1565963036838-a79638f67464?auto=format&fit=crop&w=1200&q=80';
    
    return 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=1200&q=80';
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatDateShort = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'たった今';
    if (diffMins < 60) return `${diffMins}分前`;
    if (diffHours < 24) return `${diffHours}時間前`;
    if (diffDays < 7) return `${diffDays}日前`;
    
    return date.toLocaleDateString('ja-JP', {
      month: 'short',
      day: 'numeric'
    });
  };

  const formatViews = (views?: number): string => {
    if (!views) return '0';
    if (views >= 1000) {
      return `${(views / 1000).toFixed(1)}K`;
    }
    return views.toString();
  };

  const images = post ? [getArticleImageUrl(post.title)] : [];
  const displayedComments = showAllComments ? comments : comments.slice(0, 5);

  if (loading) {
    return (
      <div className="min-h-screen bg-white pb-20 font-sans">
        <div className="max-w-2xl mx-auto px-5 py-6">
          <div className="animate-pulse">
            <div className="h-64 bg-gray-200 rounded mb-6"></div>
            <div className="h-8 bg-gray-200 rounded mb-4"></div>
            <div className="h-4 bg-gray-200 rounded mb-2"></div>
            <div className="h-4 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-white pb-20 font-sans">
        <div className="max-w-2xl mx-auto px-5 py-6">
          <div className="text-center py-16">
            <h2 className="text-xl font-medium text-gray-900 mb-2">投稿が見つかりませんでした</h2>
            <button
              onClick={() => navigate(-1)}
              className="text-blue-600 hover:text-blue-700"
            >
              戻る
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white pb-20 font-sans">
      <main className="max-w-2xl mx-auto">
        {/* メイン画像 */}
        <div className="w-full h-64 md:h-80 overflow-hidden relative">
          <div 
            className="flex transition-transform duration-300 ease-in-out h-full"
            style={{ transform: `translateX(-${currentImageIndex * 100}%)` }}
          >
            {images.map((image, index) => (
              <div key={index} className="w-full h-full flex-shrink-0">
                <img 
                  src={image} 
                  alt={`${post.title} - ${index + 1}`} 
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
            ))}
          </div>
          {images.length > 1 && (
          <div className="absolute bottom-4 flex justify-center w-full gap-2">
            {images.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentImageIndex(i)}
                className={`w-2 h-2 rounded-full transition-colors ${
                  i === currentImageIndex ? 'bg-blue-500' : 'bg-gray-300 hover:bg-gray-400'
                }`}
                aria-label={`画像 ${i + 1} に移動`}
              />
            ))}
          </div>
          )}
        </div>

        <div className="px-5 py-6">
          {/* ヘッダー情報 */}
          <div className="flex items-center gap-3 mb-4 text-sm text-gray-600">
            <Link 
              to={`/country/${encodeURIComponent(post.country.name)}`}
              className="flex items-center gap-1 hover:text-blue-600"
            >
              <span>{post.country.flag_emoji}</span>
              <span>{post.country.name}</span>
            </Link>
            {post.category && (
              <>
                <span>•</span>
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
                  {post.category}
                </span>
              </>
            )}
            <span>•</span>
            <span>{formatDate(post.created_at)}</span>
          </div>

          {/* タイトル */}
          <h1 className="text-xl font-bold text-gray-900 mb-4 leading-relaxed">
            {post.title}
          </h1>

          {/* 著者情報 */}
          <div className="flex items-center gap-3 mb-6 pb-6 border-b border-gray-100">
            <Link to={`/user/${post.user.id}`} className="flex items-center gap-3">
              <img
                src={getAvatarUrl(post.user.avatar_url, post.user.email, 40)}
                alt={post.user.name}
                className="w-10 h-10 rounded-full object-cover"
              />
              <span className="font-medium text-gray-900">{post.user.name}</span>
            </Link>
          </div>

          {/* 本文 */}
          <div className="prose prose-sm max-w-none text-gray-700 mb-8 whitespace-pre-wrap leading-relaxed">
            {post.content}
          </div>

          {/* アクションバー */}
          <div className="flex items-center justify-between py-4 border-y border-gray-100 mb-8">
            <div className="flex items-center gap-6">
              <button 
                onClick={handleToggleLike} 
                className={`flex items-center gap-2 transition-colors ${
                  isLiked ? 'text-red-500' : 'text-gray-500 hover:text-red-500'
                }`}
              >
                <Heart 
                  size={22} 
                  className={isLiked ? "fill-current" : ""} 
                />
                <span className="text-sm font-medium">{likesCount}</span>
              </button>
              <div className="flex items-center gap-2 text-gray-500">
                <Eye size={22} />
                <span className="text-sm">{formatViews(post.view_count)}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-500">
                <MessageCircle size={22} />
                <span className="text-sm">{comments.length}</span>
            </div>
            </div>
          </div>

          {/* コメントセクション */}
          <section className="mb-10">
            <h3 className="text-lg font-bold text-gray-900 mb-4">
              コメント ({comments.length}件)
            </h3>

            {/* コメント投稿フォーム */}
            <form onSubmit={handleSubmitComment} className="mb-6">
              <div className="flex gap-3">
                {user ? (
                  <>
                    <img 
                      src={getAvatarUrl(user.avatar_url, user.email, 40)} 
                      alt={user.name} 
                      className="w-10 h-10 rounded-full object-cover flex-shrink-0"
                    />
                    <div className="flex-1 flex gap-2">
                      <input
                        type="text"
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder="コメントを入力..."
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                        disabled={submittingComment}
                      />
                      <button
                        type="submit"
                        disabled={!newComment.trim() || submittingComment}
                        className="px-4 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        {submittingComment ? (
                          <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                          <Send className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                  </>
                ) : (
                  <div className="w-full text-center py-4 bg-gray-50 rounded-lg">
                    <p className="text-gray-600 text-sm mb-2">コメントするにはログインが必要です</p>
                    <Link to="/auth" className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                      ログイン / 新規登録
                    </Link>
                  </div>
                )}
              </div>
            </form>

            {/* コメント一覧 */}
            {commentsLoading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
              </div>
            ) : comments.length > 0 ? (
              <div className="space-y-4">
                {displayedComments.map((comment) => (
                  <div key={comment.id} className="flex gap-3 p-4 bg-gray-50 rounded-lg">
                    <Link to={`/user/${comment.user.id}`} className="flex-shrink-0">
                      <img
                        src={getAvatarUrl(comment.user.avatar_url, comment.user.email, 40)}
                        alt={comment.user.name}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                    </Link>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2">
                          <Link to={`/user/${comment.user.id}`} className="font-medium text-gray-900 text-sm hover:text-blue-600">
                            {comment.user.name}
                          </Link>
                          <span className="text-xs text-gray-400">{formatDateShort(comment.created_at)}</span>
                        </div>
                        {canEditOrDeleteComment(comment) && (
                          <div className="relative" ref={menuOpenCommentId === comment.id ? menuRef : null}>
                            <button
                              onClick={() => setMenuOpenCommentId(menuOpenCommentId === comment.id ? null : comment.id)}
                              className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-full hover:bg-gray-200"
                            >
                              <MoreHorizontal className="w-4 h-4" />
                            </button>
                            
                            {/* ドロップダウンメニュー */}
                            {menuOpenCommentId === comment.id && (
                              <div className="absolute right-0 top-8 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-10 min-w-[120px]">
                                {/* 本人のみ編集可能 */}
                                {user && String(user.id) === String(comment.user.id) && (
                                  <button
                                    onClick={() => handleEditComment(comment)}
                                    className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                                  >
                                    <Pencil className="w-4 h-4" />
                                    編集
                                  </button>
                                )}
                                <button
                                  onClick={() => handleDeleteComment(comment.id)}
                                  className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                                >
                                  <Trash2 className="w-4 h-4" />
                                  削除
                                </button>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                      
                      {/* コメント内容（編集モード / 表示モード） */}
                      {editingCommentId === comment.id ? (
                        <div className="mt-2">
                          <textarea
                            value={editingContent}
                            onChange={(e) => setEditingContent(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm resize-none"
                            rows={3}
                            autoFocus
                          />
                          <div className="flex justify-end gap-2 mt-2">
                            <button
                              onClick={handleCancelEdit}
                              className="px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-100 rounded-lg flex items-center gap-1"
                            >
                              <X className="w-4 h-4" />
                              キャンセル
                            </button>
                            <button
                              onClick={() => handleSaveEdit(comment.id)}
                              disabled={!editingContent.trim()}
                              className="px-3 py-1.5 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center gap-1"
                            >
                              <Check className="w-4 h-4" />
                              保存
                            </button>
                          </div>
                        </div>
                      ) : (
                        <p className="text-gray-700 text-sm whitespace-pre-wrap">{comment.content}</p>
                      )}
                  </div>
                </div>
              ))}
                
                {comments.length > 5 && !showAllComments && (
                  <div className="text-center pt-2">
                    <button 
                      onClick={() => setShowAllComments(true)}
                      className="px-6 py-2 text-blue-600 text-sm font-medium hover:bg-blue-50 rounded-full transition-colors"
                    >
                      すべてのコメントを表示 ({comments.length - 5}件)
              </button>
            </div>
                )}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                まだコメントはありません
              </div>
            )}
          </section>

          {/* 関連記事 */}
          {relatedPosts.length > 0 && (
          <section>
              <h3 className="text-lg font-bold text-gray-900 mb-4">関連記事</h3>
            <div className="grid grid-cols-2 gap-4">
                {relatedPosts.map((related) => {
                  const getRelatedImageUrl = (title: string): string => {
                    const lowerTitle = title.toLowerCase();
                    if (lowerTitle.includes('イタリア')) return 'https://images.unsplash.com/photo-1498522544924-8fcd7e24b7bf?auto=format&fit=crop&w=400&q=80';
                    if (lowerTitle.includes('ギリシャ')) return 'https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=400&q=80';
                    return 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=400&q=80';
                  };

                  return (
                <Link 
                  key={related.id} 
                  to={`/posts/${related.id}`}
                  className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100 hover:shadow-md transition-shadow"
                >
                  <div className="h-32 overflow-hidden">
                        <img src={getRelatedImageUrl(related.title)} alt={related.title} className="w-full h-full object-cover" />
                  </div>
                  <div className="p-3">
                    <h4 className="text-xs font-bold text-gray-800 mb-2 line-clamp-2">{related.title}</h4>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-1">
                            <img 
                              src={getAvatarUrl(related.user.avatar_url, related.user.email, 16)} 
                              alt={related.user.name} 
                              className="w-4 h-4 rounded-full object-cover"
                            />
                            <span className="text-[10px] text-gray-500">{related.user.name}</span>
                      </div>
                      <div className="flex items-center gap-0.5 text-gray-400">
                        <Eye size={10} />
                            <span className="text-[10px]">{formatViews(related.view_count)}</span>
                      </div>
                    </div>
                  </div>
                </Link>
                  );
                })}
            </div>
          </section>
          )}
        </div>
      </main>
    </div>
  );
};
