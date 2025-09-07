import React from 'react';
import { useQuery } from '@apollo/client';
import { GET_USERS } from '../graphql/queries';

interface User {
  id: string;
  name: string;
  email: string;
  createdAt: string;
  updatedAt: string;
}

const UserList: React.FC = () => {
  const { loading, error, data } = useQuery<{ users: User[] }>(GET_USERS);

  if (loading) return <div className="text-center py-4">読み込み中...</div>;
  if (error) return <div className="text-red-500 py-4">エラー: {error.message}</div>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">ユーザー一覧</h2>
      {data?.users && data.users.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {data.users.map((user) => (
            <div key={user.id} className="bg-white rounded-lg shadow-md p-6 border">
              <h3 className="text-lg font-semibold mb-2">{user.name || '名前なし'}</h3>
              <p className="text-gray-600 mb-2">{user.email}</p>
              <div className="text-sm text-gray-500">
                <p>作成日: {new Date(user.createdAt).toLocaleDateString('ja-JP')}</p>
                <p>更新日: {new Date(user.updatedAt).toLocaleDateString('ja-JP')}</p>
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