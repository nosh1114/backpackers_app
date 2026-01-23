import { Shield } from 'lucide-react';

export function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center gap-3 mb-2">
            <Shield className="h-8 w-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-900">プライバシーポリシー</h1>
          </div>
          <p className="text-gray-600">最終更新日: 2026年1月24日</p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 md:p-8 space-y-8">
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">1. はじめに</h2>
            <p className="text-gray-700 leading-relaxed">
              BappaNavi（以下「当サービス」）は、ユーザーのプライバシーを尊重し、個人情報の保護に努めています。
              本プライバシーポリシーでは、当サービスが収集する情報とその利用方法について説明します。
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">2. 収集する情報</h2>
            <p className="text-gray-700 leading-relaxed mb-3">当サービスでは、以下の情報を収集する場合があります：</p>
            <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
              <li>アカウント登録時に提供いただく情報（メールアドレス、ユーザー名）</li>
              <li>投稿やコメントなど、ユーザーが作成したコンテンツ</li>
              <li>サービス利用に関する情報（アクセスログ、閲覧履歴）</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">3. 情報の利用目的</h2>
            <p className="text-gray-700 leading-relaxed mb-3">収集した情報は、以下の目的で利用します：</p>
            <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
              <li>サービスの提供・運営・改善</li>
              <li>ユーザーサポートの提供</li>
              <li>不正利用の防止</li>
              <li>サービスに関する重要なお知らせの送信</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">4. 情報の共有</h2>
            <p className="text-gray-700 leading-relaxed">
              当サービスは、法律で要求される場合、またはユーザーの同意がある場合を除き、
              個人情報を第三者に販売、貸与、または共有することはありません。
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">5. データの保護</h2>
            <p className="text-gray-700 leading-relaxed">
              当サービスは、ユーザーの個人情報を保護するために適切なセキュリティ対策を講じています。
              ただし、インターネット上での完全なセキュリティを保証することはできません。
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">6. お問い合わせ</h2>
            <p className="text-gray-700 leading-relaxed">
              プライバシーポリシーに関するご質問は、
              <a href="/contact" className="text-blue-600 hover:underline">お問い合わせフォーム</a>
              よりご連絡ください。
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}

