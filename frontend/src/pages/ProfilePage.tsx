import React, { useState } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { GET_CURRENT_USER_PROFILE, GET_POSTS } from '../graphql/queries';
import { UPDATE_PROFILE } from '../graphql/mutations';
import { useAuth } from '../contexts/AuthContext';
import { User, Edit, Save, X, Globe, MapPin, Camera, Plus, Calendar, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';

interface UserProfile {
  id: string;
  name: string;
  email: string;
  createdAt: string;
  updatedAt: string;
  bio: string;
  location: string;
  website: string;
  avatarUrl: string;
}

interface Post {
  id: string;
  title: string;
  content: string;
  countryCode: string;
  createdAt: string;
}

const ProfilePage: React.FC = () => {
  const { user, refreshUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // フォーム状態
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    bio: '',
    location: '',
    website: '',
    avatarUrl: ''
  });

  const { data, loading: queryLoading, refetch } = useQuery<{ currentUserProfile: UserProfile }>(GET_CURRENT_USER_PROFILE, {
    onCompleted: (data) => {
      if (data?.currentUserProfile) {
        const profile = data.currentUserProfile;
        setFormData({
          name: profile.name || '',
          email: profile.email || '',
          bio: profile.bio || '',
          location: profile.location || '',
          website: profile.website || '',
          avatarUrl: profile.avatarUrl || ''
        });
      }
    }
  });

  // ユーザーの投稿を取得
  const { data: postsData, loading: postsLoading } = useQuery<{ posts: Post[] }>(GET_POSTS, {
    variables: { page: 1, items: 10 }
  });

  const [updateProfile] = useMutation(UPDATE_PROFILE);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = async () => {
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const { data } = await updateProfile({
        variables: {
          name: formData.name,
          email: formData.email,
          bio: formData.bio,
          location: formData.location,
          website: formData.website,
          avatarUrl: formData.avatarUrl
        }
      });

      if (data?.updateProfile?.errors && data.updateProfile.errors.length > 0) {
        setError(data.updateProfile.errors.join(', '));
      } else {
        setSuccess('プロフィールが更新されました');
        setIsEditing(false);
        await refreshUser();
        refetch();
      }
    } catch (err: any) {
      setError(err.message || 'プロフィールの更新に失敗しました');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    if (data?.currentUserProfile) {
      const profile = data.currentUserProfile;
      setFormData({
        name: profile.name || '',
        email: profile.email || '',
        bio: profile.bio || '',
        location: profile.location || '',
        website: profile.website || '',
        avatarUrl: profile.avatarUrl || ''
      });
    }
    setIsEditing(false);
    setError('');
    setSuccess('');
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (queryLoading) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="flex justify-center items-center min-h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  const profile = data?.currentUserProfile;
  const userPosts = postsData?.posts?.filter(post => post.user?.id === profile?.id) || [];

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* ヘッダー */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">マイページ</h1>
          <p className="text-gray-600">プロフィールと投稿を管理できます</p>
        </div>
        <Link
          to="/create-post"
          className="mt-4 sm:mt-0 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          新しい投稿
        </Link>
      </div>

      {/* エラー・成功メッセージ */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <p className="text-red-600">{error}</p>
        </div>
      )}
      {success && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
          <p className="text-green-600">{success}</p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* プロフィール情報 */}
        <div className="lg:col-span-1">
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">プロフィール</h2>
              {!isEditing && (
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex items-center space-x-1 text-blue-600 hover:text-blue-800 transition-colors"
                >
                  <Edit className="h-4 w-4" />
                  <span>編集</span>
                </button>
              )}
            </div>

            {isEditing ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">名前</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">メールアドレス</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">自己紹介</label>
                  <textarea
                    name="bio"
                    value={formData.bio}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="自己紹介を入力してください"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">所在地</label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="例: 東京, 日本"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">ウェブサイト</label>
                  <input
                    type="url"
                    name="website"
                    value={formData.website}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="https://example.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">アバターURL</label>
                  <input
                    type="url"
                    name="avatarUrl"
                    value={formData.avatarUrl}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="https://example.com/avatar.jpg"
                  />
                </div>
                <div className="flex space-x-3">
                  <button
                    onClick={handleSave}
                    disabled={loading}
                    className="flex items-center space-x-1 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50 transition-colors"
                  >
                    <Save className="h-4 w-4" />
                    <span>{loading ? '保存中...' : '保存'}</span>
                  </button>
                  <button
                    onClick={handleCancel}
                    className="flex items-center space-x-1 bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 transition-colors"
                  >
                    <X className="h-4 w-4" />
                    <span>キャンセル</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                    {profile?.avatarUrl ? (
                      <img
                        src={profile.avatarUrl}
                        alt={profile.name}
                        className="w-16 h-16 rounded-full object-cover"
                      />
                    ) : (
                      <User className="h-8 w-8 text-blue-600" />
                    )}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{profile?.name}</h3>
                    <p className="text-gray-600">{profile?.email}</p>
                  </div>
                </div>

                {profile?.bio && (
                  <div>
                    <p className="text-gray-700">{profile.bio}</p>
                  </div>
                )}

                <div className="space-y-2">
                  {profile?.location && (
                    <div className="flex items-center space-x-2 text-gray-600">
                      <MapPin className="h-4 w-4" />
                      <span>{profile.location}</span>
                    </div>
                  )}
                  {profile?.website && (
                    <div className="flex items-center space-x-2 text-gray-600">
                      <Globe className="h-4 w-4" />
                      <a
                        href={profile.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800"
                      >
                        {profile.website}
                      </a>
                    </div>
                  )}
                  <div className="flex items-center space-x-2 text-gray-600">
                    <Calendar className="h-4 w-4" />
                    <span>登録日: {formatDate(profile?.createdAt || '')}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* 投稿一覧 */}
        <div className="lg:col-span-2">
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">投稿一覧</h2>
            {postsLoading ? (
              <div className="flex justify-center items-center py-8">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
              </div>
            ) : userPosts.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500 mb-4">まだ投稿がありません</p>
                <Link
                  to="/create-post"
                  className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  最初の投稿を作成する
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {userPosts.map((post) => (
                  <div key={post.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{post.title}</h3>
                    <p className="text-gray-600 mb-3">
                      {post.content.length > 150 
                        ? `${post.content.substring(0, 150)}...` 
                        : post.content
                      }
                    </p>
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <span>{formatDate(post.createdAt)}</span>
                      <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                        {post.countryCode}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage; 