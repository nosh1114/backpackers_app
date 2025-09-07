  import React from 'react';
import { useQuery } from '@apollo/client';
import { GET_TEST_FIELD } from '../graphql/queries';

const TestField: React.FC = () => {
  const { loading, error, data } = useQuery<{ testField: string }>(GET_TEST_FIELD);

  if (loading) return <div className="text-center py-4">読み込み中...</div>;
  if (error) return <div className="text-red-500 py-4">エラー: {error.message}</div>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">GraphQL接続テスト</h2>
      <div className="bg-green-50 border border-green-200 rounded-lg p-6">
        <p className="text-green-800 font-medium">GraphQLからの応答:</p>
        <p className="text-green-600 mt-2">{data?.testField}</p>
      </div>
    </div>
  );
};

export default TestField; 