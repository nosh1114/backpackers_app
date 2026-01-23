import { Backpack, Users, Globe, Heart } from 'lucide-react';

export function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <div className="bg-gradient-to-br from-blue-600 to-blue-800 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Backpack className="h-16 w-16 mx-auto mb-6 opacity-90" />
          <h1 className="text-4xl font-bold mb-4">BappaNaviについて</h1>
          <p className="text-xl text-blue-100">
            バックパッカーによる、バックパッカーのための情報共有プラットフォーム
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Mission */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">私たちのミッション</h2>
          <p className="text-gray-700 leading-relaxed">
            BappaNaviは、世界中を旅するバックパッカーが「本当に役立つ情報」を共有し合える場所を目指しています。
            ガイドブックには載っていない、現地で実際に体験した生の情報。それこそが、旅人にとって最も価値ある情報だと私たちは考えます。
          </p>
        </section>

        {/* Features */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">特徴</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <Globe className="h-10 w-10 text-blue-600 mb-4" />
              <h3 className="font-bold text-lg mb-2">国別の情報</h3>
              <p className="text-gray-600 text-sm">
                各国ごとに整理された、ビザ・宿・移動手段などの実用的な情報
              </p>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <Users className="h-10 w-10 text-blue-600 mb-4" />
              <h3 className="font-bold text-lg mb-2">旅人コミュニティ</h3>
              <p className="text-gray-600 text-sm">
                経験豊富なバックパッカーから初心者まで、情報を共有し合えるコミュニティ
              </p>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <Heart className="h-10 w-10 text-blue-600 mb-4" />
              <h3 className="font-bold text-lg mb-2">リアルな体験談</h3>
              <p className="text-gray-600 text-sm">
                実際に旅した人だけが知る、本当に役立つTIPSやお得情報
              </p>
            </div>
          </div>
        </section>

        {/* How to use */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">使い方</h2>
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <ol className="space-y-4 text-gray-700">
              <li className="flex gap-4">
                <span className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">1</span>
                <div>
                  <p className="font-medium">行きたい国やカテゴリーを探す</p>
                  <p className="text-sm text-gray-500">トップページから国別、カテゴリー別に情報を検索できます</p>
                </div>
              </li>
              <li className="flex gap-4">
                <span className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">2</span>
                <div>
                  <p className="font-medium">投稿を読んで旅の参考にする</p>
                  <p className="text-sm text-gray-500">他の旅人の体験談やTIPSを参考に、旅の計画を立てましょう</p>
                </div>
              </li>
              <li className="flex gap-4">
                <span className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">3</span>
                <div>
                  <p className="font-medium">あなたの経験も共有する</p>
                  <p className="text-sm text-gray-500">旅から帰ったら、あなたの体験をシェアして次の旅人を助けましょう</p>
                </div>
              </li>
            </ol>
          </div>
        </section>

        {/* Contact */}
        <section>
          <div className="bg-blue-50 rounded-xl p-6 text-center">
            <p className="text-gray-700 mb-4">
              ご質問やフィードバックがありましたら、お気軽にお問い合わせください。
            </p>
            <a 
              href="/contact" 
              className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              お問い合わせ
            </a>
          </div>
        </section>
      </div>
    </div>
  );
}

