import { Link } from 'react-router-dom';
import { Home } from 'lucide-react';

export function NotFoundPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-600 via-primary-700 to-secondary-600 flex items-center justify-center p-6">
      <div className="text-center max-w-md">
        <div className="mb-8">
          <h1 className="text-9xl font-bold text-white mb-4">404</h1>
          <h2 className="text-3xl font-bold text-white mb-4">お探しのページは見つかりませんでした</h2>
          <p className="text-white/90 text-lg mb-8">
            申し訳ございませんが、アクセスしようとしたページは存在しないか、移動または削除された可能性があります。
          </p>
        </div>
        <Link
          to="/"
          className="inline-flex items-center gap-2 bg-white text-primary-600 px-6 py-3 rounded-lg hover:bg-white/90 transition-colors font-medium"
        >
          <Home className="w-5 h-5" />
          ホームに戻る
        </Link>
      </div>
    </div>
  );
}

