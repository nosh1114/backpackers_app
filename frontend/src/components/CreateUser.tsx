import React, { useState } from 'react';
import { useMutation, useQuery } from '@apollo/client';
import { CREATE_USER } from '../graphql/mutations';
import { GET_USERS } from '../graphql/queries';

const CreateUser: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [createUser, { loading, error }] = useMutation(CREATE_USER);
  const { refetch } = useQuery(GET_USERS);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await createUser({
        variables: { name, email }
      });
      
      // フォームをリセット
      setName('');
      setEmail('');
      
      // ユーザー一覧を更新
      refetch();
      
      alert('ユーザーが作成されました！');
    } catch (err) {
      console.error('Error creating user:', err);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">新規ユーザー作成</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
            名前
          </label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            メールアドレス
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        {error && (
          <div className="text-red-500 text-sm">
            エラー: {error.message}
          </div>
        )}
        
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? '作成中...' : 'ユーザーを作成'}
        </button>
      </form>
    </div>
  );
};

export default CreateUser; 