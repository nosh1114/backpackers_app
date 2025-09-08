import React, { useState, useEffect } from 'react';
import { apiClient } from '../lib/api';

interface User {
  id: string;
  name: string;
  email: string;
  bio?: string;
  location?: string;
  website?: string;
  avatar_url?: string;
  created_at: string;
  updated_at: string;
}

const UserList: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        setError('');
        
        const response = await apiClient.getUsers();
        
        if (response.data) {
          setUsers(response.data.users);
        } else {
          setError(response.error || 'ユーザーの取得に失敗しました');
        }
      } catch (err) {
        setError('ユーザーの取得に失敗しました');
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  if (loading) return <div className="text-center py-4">読み込み中...</div>;
  if (error) return <div className="text-red-500 py-4">エラー: {error}</div>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">ユーザー一覧</h2>
      {users.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {users.map((user) => (
            <div key={user.id} className="bg-white rounded-lg shadow-md p-6 border">
              <h3 className="text-lg font-semibold mb-2">{user.name || '名前なし'}</h3>
              <p className="text-gray-600 mb-2">{user.email}</p>
              {user.bio && <p className="text-gray-600 mb-2">{user.bio}</p>}
              {user.location && <p className="text-gray-600 mb-2"> {user.location}</p>}
              {user.website && (
                <a 
                  href={user.website} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 mb-2 block"
                >
                  🌐 {user.website}
                </a>
              )}
              <div className="text-sm text-gray-500">
                <p>作成日: {new Date(user.created_at).toLocaleDateString('ja-JP')}</p>
                <p>更新日: {new Date(user.updated_at).toLocaleDateString('ja-JP')}</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500">
          ユーザーが見つかりません
        </div>
      )}
    </div>
  );
};

export default UserList; 