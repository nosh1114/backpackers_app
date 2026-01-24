import { Users, Check, X } from 'lucide-react';

export function GuidelinesPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center gap-3 mb-2">
            <Users className="h-8 w-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-900">コミュニティガイドライン</h1>
          </div>
          <p className="text-gray-600">みんなが安心して使えるコミュニティのために</p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          {/* Intro */}
          <div className="bg-blue-50 rounded-xl p-6 border border-blue-100">
            <p className="text-gray-700 leading-relaxed">
              BappaNaviは、世界中のバックパッカーが情報を共有し、助け合うためのコミュニティです。
              全てのユーザーが快適に利用できるよう、以下のガイドラインを守ってください。
            </p>
          </div>

          {/* Do's */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Check className="h-6 w-6 text-green-600" />
              推奨されること
            </h2>
            <ul className="space-y-3 text-gray-700">
              <li className="flex items-start gap-3">
                <span className="text-green-600 mt-1">✓</span>
                <span><strong>正確な情報を共有する</strong> - 実際に体験した情報を、できるだけ正確に投稿しましょう</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-green-600 mt-1">✓</span>
                <span><strong>日付を明記する</strong> - 情報はすぐに古くなります。いつの情報かを明記しましょう</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-green-600 mt-1">✓</span>
                <span><strong>具体的に書く</strong> - 金額、場所、手順など、具体的な情報は特に役立ちます</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-green-600 mt-1">✓</span>
                <span><strong>敬意を持って接する</strong> - 他のユーザーやコメントには敬意を持って対応しましょう</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-green-600 mt-1">✓</span>
                <span><strong>フィードバックを歓迎する</strong> - 情報の訂正や追加情報は歓迎されます</span>
              </li>
            </ul>
          </div>

          {/* Don'ts */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <X className="h-6 w-6 text-red-600" />
              禁止されていること
            </h2>
            <ul className="space-y-3 text-gray-700">
              <li className="flex items-start gap-3">
                <span className="text-red-600 mt-1">✗</span>
                <span><strong>虚偽の情報</strong> - 嘘や誤解を招く情報の投稿</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-red-600 mt-1">✗</span>
                <span><strong>誹謗中傷</strong> - 他のユーザー、宿、お店などへの攻撃的な批判</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-red-600 mt-1">✗</span>
                <span><strong>違法行為の助長</strong> - 違法な入国方法、ドラッグ情報など</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-red-600 mt-1">✗</span>
                <span><strong>スパム・宣伝</strong> - 無関係な宣伝や繰り返しの投稿</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-red-600 mt-1">✗</span>
                <span><strong>個人情報の公開</strong> - 他人の個人情報を無断で公開すること</span>
              </li>
            </ul>
          </div>

          {/* Violation */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-3">違反への対応</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              ガイドラインに違反する投稿やユーザーに対しては、以下の対応を行う場合があります：
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
              <li>投稿の削除</li>
              <li>警告の通知</li>
              <li>アカウントの一時停止</li>
              <li>アカウントの永久停止</li>
            </ul>
          </div>

          {/* Report */}
          <div className="bg-gray-100 rounded-xl p-6 text-center">
            <p className="text-gray-700 mb-4">
              ガイドライン違反を見つけた場合は、お問い合わせよりご報告ください。
            </p>
            <a 
              href="/contact" 
              className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              違反を報告する
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

