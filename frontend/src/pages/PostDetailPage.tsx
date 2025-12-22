import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ThumbsUp, MoreHorizontal, Eye } from 'lucide-react';
import Header from '../components/Layout/Header';

export const PostDetailPage = () => {
  const { postId } = useParams();
  const [isLiked, setIsLiked] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // 4枚のUnsplash画像
  const images = [
    'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?auto=format&fit=crop&w=1200&q=80', // シンガポール街並み
    'https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?auto=format&fit=crop&w=1200&q=80', // アジアの夜景
    'https://images.unsplash.com/photo-1535139262971-c51845709a48?auto=format&fit=crop&w=1200&q=80'  // アジアの街
  ];

  // モックデータ
  const post = {
    id: postId,
    title: 'シンガポールの夜ガイド〜夜はこのように過ごすのがおすすめ',
    content: `はじめに

昼間の観光を終えたあとも、シンガポールの夜はまだまだこれから。
治安が良く、ナイトライフも充実しているこの国では、夜の時間こそが旅のハイライトになることも。
バックパッカー目線で、安くて面白くてローカル感のある夜の過ごし方を紹介します。

1. マリーナベイ・サンズ周辺で夜景を満喫

夜の定番といえばここ。
マリーナベイ・サンズのライトショーは毎晩20時と21時に開催され、無料で楽しめます。
ベイエリアをぐるっと歩きながら、マーライオン公園から眺める景色もおすすめ。
ショーのあとは、ラオパサの屋台でローカル飯を楽しもう。

予算目安: 10〜20 SGD
アクセス: MRT Downtown駅から徒歩5分

2. クラーク・キーでバー巡り

リバーサイドに並ぶバーやクラブが光り輝く"クラーク・キー(Clarke Quay)"は、ナイトライフの中心地。
音楽好きならライブバー、ゆっくり飲みたいならテラスバーが◎。
一杯だけでもOKな雰囲気なので、ソロ旅でも安心。

予算目安: 1杯10〜15 SGD
ポイント: 川沿いを少し歩くだけでも気持ちいい`,
    likes: 18,
    author: {
      name: 'ami_12',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&q=80'
    },
    likedUsers: [
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80',
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=100&q=80',
      'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=100&q=80'
    ],
    comments: [
      {
        id: 1,
        user: 'David_heinemeier',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=100&q=80',
        text: '素敵なレビューありがとう',
        date: '2025/08/04'
      },
      {
        id: 2,
        user: 'David_heinemeier',
        avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=100&q=80',
        text: '素敵なレビューありがとう',
        date: '2025/08/04'
      },
      {
        id: 3,
        user: 'David_heinemeier',
        avatar: 'https://images.unsplash.com/photo-1527980965255-d3b416303d12?auto=format&fit=crop&w=100&q=80',
        text: '素敵なレビューありがとう',
        date: '2025/08/04'
      },
      {
        id: 4,
        user: 'David_heinemeier',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&q=80',
        text: '素敵なレビューありがとう',
        date: '2025/08/04'
      }
    ],
    relatedPosts: [
      {
        id: 101,
        title: 'イタリアの秘境が...',
        image: 'https://images.unsplash.com/photo-1498522544924-8fcd7e24b7bf?auto=format&fit=crop&w=400&q=80',
        views: '1.4K',
        author: 'ami_12',
        authorAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=50&q=80'
      },
      {
        id: 102,
        title: 'ギリシャの本気の...',
        image: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=400&q=80',
        views: '1.4K',
        author: 'ami_12',
        authorAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=50&q=80'
      },
      {
        id: 103,
        title: 'イタリアの秘境が...',
        image: 'https://images.unsplash.com/photo-1498522544924-8fcd7e24b7bf?auto=format&fit=crop&w=400&q=80',
        views: '1.4K',
        author: 'ami_12',
        authorAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=50&q=80'
      },
      {
        id: 104,
        title: 'ギリシャの本気の...',
        image: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=400&q=80',
        views: '1.4K',
        author: 'ami_12',
        authorAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=50&q=80'
      }
    ]
  };

  return (
    <div className="min-h-screen bg-white pb-20 font-sans">
      <Header />

      {/* メインコンテンツ */}
      <main className="max-w-2xl mx-auto">
        {/* メイン画像カルーセル */}
        <div className="w-full h-64 md:h-80 overflow-hidden relative">
          <div 
            className="flex transition-transform duration-300 ease-in-out h-full"
            style={{ transform: `translateX(-${currentImageIndex * 100}%)` }}
          >
            {images.map((image, index) => (
              <div key={index} className="w-full h-full flex-shrink-0">
                <img 
                  src={image} 
                  alt={`${post.title} - ${index + 1}`} 
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
            ))}
          </div>
          {/* インジケーター */}
          <div className="absolute bottom-4 flex justify-center w-full gap-2">
            {images.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentImageIndex(i)}
                className={`w-2 h-2 rounded-full transition-colors ${
                  i === currentImageIndex ? 'bg-blue-500' : 'bg-gray-300 hover:bg-gray-400'
                }`}
                aria-label={`画像 ${i + 1} に移動`}
              />
            ))}
          </div>
        </div>

        <div className="px-5 py-6">
          {/* タイトル */}
          <h1 className="text-xl font-bold text-gray-900 mb-4 leading-relaxed">
            {post.title}
          </h1>

          {/* 本文 */}
          <div className="prose prose-sm max-w-none text-gray-700 mb-8 whitespace-pre-wrap leading-relaxed">
            {post.content}
          </div>

          {/* アクションバー */}
          <div className="flex items-center justify-between py-4 border-y border-gray-100 mb-8">
            <div className="flex items-center gap-4">
              <button onClick={() => setIsLiked(!isLiked)} className="flex items-center gap-1">
                <ThumbsUp size={24} className={isLiked ? "text-blue-500 fill-blue-500" : "text-gray-500"} />
              </button>
              <div className="flex -space-x-2">
                {post.likedUsers.map((avatar, i) => (
                  <div key={i} className="w-8 h-8 rounded-full border-2 border-white overflow-hidden bg-gray-200">
                    <img src={avatar} alt="user" className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
              <button className="text-gray-500">
                <MoreHorizontal size={24} />
              </button>
            </div>
            <div className="text-sm text-gray-500">
              {post.likes}人 がよき！しました
            </div>
          </div>

          {/* コメントセクション */}
          <section className="mb-10">
            <h3 className="text-sm font-bold text-gray-500 mb-4">{post.comments.length}件のコメント</h3>
            <div className="space-y-6">
              {post.comments.map((comment) => (
                <div key={comment.id} className="flex gap-3">
                  <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden flex-shrink-0">
                    <img src={comment.avatar} alt={comment.user} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-sm font-bold text-gray-800 mb-0.5">{comment.text}</p>
                        <p className="text-xs text-gray-400">@{comment.user}</p>
                      </div>
                      <span className="text-xs text-gray-400">{comment.date}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-6 text-center">
              <button className="px-6 py-2 border border-orange-200 text-orange-400 text-xs rounded-full hover:bg-orange-50 transition-colors">
                すべて表示
              </button>
            </div>
          </section>

          {/* 関連記事 */}
          <section>
            <h3 className="text-sm font-bold text-gray-500 mb-4">関連記事</h3>
            <div className="grid grid-cols-2 gap-4">
              {post.relatedPosts.map((related) => (
                <Link 
                  key={related.id} 
                  to={`/posts/${related.id}`}
                  className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100 hover:shadow-md transition-shadow"
                >
                  <div className="h-32 overflow-hidden">
                    <img src={related.image} alt={related.title} className="w-full h-full object-cover" />
                  </div>
                  <div className="p-3">
                    <h4 className="text-xs font-bold text-gray-800 mb-2 line-clamp-2">{related.title}</h4>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-1">
                        <div className="w-4 h-4 rounded-full bg-gray-200 overflow-hidden">
                          <img src={related.authorAvatar} alt={related.author} className="w-full h-full object-cover" />
                        </div>
                        <span className="text-[10px] text-gray-500">{related.author}</span>
                      </div>
                      <div className="flex items-center gap-0.5 text-gray-400">
                        <Eye size={10} />
                        <span className="text-[10px]">{related.views}</span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

