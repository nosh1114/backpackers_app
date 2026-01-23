import { FileText } from 'lucide-react';

export function TermsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center gap-3 mb-2">
            <FileText className="h-8 w-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-900">利用規約</h1>
          </div>
          <p className="text-gray-600">最終更新日: 2026年1月24日</p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 md:p-8 space-y-8">
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">第1条（適用）</h2>
            <p className="text-gray-700 leading-relaxed">
              本規約は、BappaNavi（以下「当サービス」）の利用に関する条件を定めるものです。
              ユーザーは、本規約に同意した上で当サービスを利用するものとします。
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">第2条（アカウント）</h2>
            <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
              <li>ユーザーは正確な情報を提供してアカウントを作成する必要があります</li>
              <li>アカウント情報の管理はユーザー自身の責任で行うものとします</li>
              <li>アカウントの譲渡・貸与は禁止します</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">第3条（投稿コンテンツ）</h2>
            <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
              <li>ユーザーは自身が投稿するコンテンツに責任を持つものとします</li>
              <li>投稿コンテンツの著作権はユーザーに帰属しますが、当サービスは掲載・編集の権利を有します</li>
              <li>虚偽の情報、誹謗中傷、違法なコンテンツの投稿は禁止します</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">第4条（禁止事項）</h2>
            <p className="text-gray-700 leading-relaxed mb-3">ユーザーは以下の行為を行ってはなりません：</p>
            <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
              <li>法令または公序良俗に違反する行為</li>
              <li>他のユーザーまたは第三者の権利を侵害する行為</li>
              <li>当サービスの運営を妨げる行為</li>
              <li>商業目的での無断利用</li>
              <li>スパム行為や不正アクセス</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">第5条（免責事項）</h2>
            <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
              <li>当サービスは投稿情報の正確性・完全性を保証しません</li>
              <li>ユーザー間のトラブルについて、当サービスは責任を負いません</li>
              <li>旅行に関する判断はユーザー自身の責任で行ってください</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">第6条（サービスの変更・終了）</h2>
            <p className="text-gray-700 leading-relaxed">
              当サービスは、事前の通知なくサービス内容の変更または終了を行う場合があります。
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">第7条（規約の変更）</h2>
            <p className="text-gray-700 leading-relaxed">
              当サービスは、必要に応じて本規約を変更できるものとします。
              変更後の規約は、当サービス上に掲載した時点で効力を生じます。
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}

