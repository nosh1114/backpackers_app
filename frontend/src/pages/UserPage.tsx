import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { User, Edit, Plus } from 'lucide-react';
import { PostCard } from '../components/PostCard';
import { apiClient } from '../lib/api';
import { useAuth } from '../contexts/AuthContext';
import { getAvatarUrl } from '../lib/gravatar';

interface UserData {
  id: number;
  name: string;
  email: string;
  bio?: string;
  avatar_url?: string;
  posts_count?: number;
}

interface Post {
  id: number;
  title: string;
  content: string;
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

export function UserPage() {
  const { userId } = useParams<{ userId: string }>();
  const { user: currentUser } = useAuth();
  const navigate = useNavigate();
  const [user, setUser] = useState<UserData | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [postsLoading, setPostsLoading] = useState(true);
  const [editingPostId, setEditingPostId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState({
    title: '',
    content: '',
  });

  useEffect(() => {
    if (userId) {
      fetchUserData();
      fetchUserPosts();
    }
  }, [userId]);

  const fetchUserData = async () => {
    try {
      setLoading(true);
      const response = await apiClient.getUser(userId!);
      
      if (response.data) {
        setUser(response.data.user);
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserPosts = async () => {
    try {
      setPostsLoading(true);
      const response = await apiClient.getUserPosts(userId!);
      
      if (response.data) {
        setPosts(response.data.posts);
      }
    } catch (error) {
      console.error('Error fetching user posts:', error);
    } finally {
      setPostsLoading(false);
    }
  };

  const handleEditPost = (post: Post) => {
    setEditingPostId(post.id);
    setEditForm({
      title: post.title,
      content: post.content,
    });
  };

  const handleSavePost = async (postId: number) => {
    try {
      const response = await apiClient.updatePost(postId.toString(), {
        title: editForm.title,
        content: editForm.content,
      });

      if (response.data) {
        setEditingPostId(null);
        fetchUserPosts();
      } else {
        alert('更新に失敗しました: ' + (response.error || 'Unknown error'));
      }
    } catch (error) {
      console.error('Error updating post:', error);
      alert('更新に失敗しました');
    }
  };

  const handleCancelEdit = () => {
    setEditingPostId(null);
    setEditForm({ title: '', content: '' });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <User className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-xl font-medium text-gray-900 mb-2">ユーザーが見つかりません</h2>
          <p className="text-gray-600">このユーザーは存在しないか、削除された可能性があります。</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* User Profile Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-6">
            {/* Avatar */}
            <div className="flex-shrink-0">
              <img
                src={getAvatarUrl(user.avatar_url, user.email, 96)}
                alt={user.name}
                className="w-24 h-24 rounded-full object-cover"
              />
            </div>

            {/* User Info */}
            <div className="flex-1 min-w-0">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{user.name}</h1>
              
              {user.bio && (
                <p className="text-gray-600 mb-4">{user.bio}</p>
              )}

              <div className="flex items-center space-x-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">{posts.length}</div>
                  <div className="text-sm text-gray-500">投稿</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">
                    {posts.reduce((sum, post) => sum + (post.likes_count || 0), 0)}
                  </div>
                  <div className="text-sm text-gray-500">いいね</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Posts Section */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">投稿一覧</h2>
            <p className="text-gray-600">{user.name}さんの投稿</p>
          </div>
          {currentUser && currentUser.id.toString() === userId && (
            <Link
              to="/create-post"
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 text-sm"
            >
              <Plus className="w-4 h-4" />
              新しい投稿
            </Link>
          )}
        </div>

        {postsLoading ? (
          <div className="space-y-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-white rounded-xl shadow-sm p-6 animate-pulse">
                <div className="h-6 bg-gray-200 rounded mb-4"></div>
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        ) : posts.length > 0 ? (
          <div className="space-y-6">
            {posts.map(post => (
              <div key={post.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                {editingPostId === post.id ? (
                  <div className="p-6">
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">タイトル</label>
                        <input
                          type="text"
                          value={editForm.title}
                          onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">内容</label>
                        <textarea
                          value={editForm.content}
                          onChange={(e) => setEditForm({ ...editForm, content: e.target.value })}
                          rows={8}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleSavePost(post.id)}
                          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                          保存
                        </button>
                        <button
                          onClick={handleCancelEdit}
                          className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                        >
                          キャンセル
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <>
                    <PostCard
                      post={post}
                    />
                    {currentUser && currentUser.id.toString() === userId && (
                      <div className="px-6 py-3 border-t border-gray-200 flex justify-end">
                        <button
                          onClick={() => handleEditPost(post)}
                          className="flex items-center gap-2 px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        >
                          <Edit className="w-4 h-4" />
                          <span>編集</span>
                        </button>
                      </div>
                    )}
                  </>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <User className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-gray-900 mb-2">
              まだ投稿がありません
            </h3>
            <p className="text-gray-600">
              {user.name}さんはまだ投稿していません。
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
