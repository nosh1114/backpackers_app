import { useState, useEffect } from 'react'
import { Search, MessageCircle } from 'lucide-react'
import { CountryCard } from '../components/CountryCard'
import { PostCard } from '../components/PostCard'
import { PostForm } from '../components/PostForm'
import { CategorySection } from '../components/CategorySection'
import { apiClient } from '../lib/api'
// COUNTRIESのimportを削除
// import { COUNTRIES } from '../lib/constants'

interface CountryStats {
  country: string
  flagEmoji: string
  tipCount: number
  lastPostDate: string
  recentTips: Array<{
    id: number
    title: string
    category: string
    author_name: string
    created_at: string
  }>
}

interface Post {
  id: number
  title: string
  content: string
  category?: string
  country: {
    id: number
    code: string
    name: string
    flag_emoji: string
  }
  user: {
    id: number
    name: string
    avatar_url?: string
  }
  created_at: string
  updated_at: string
  likes_count?: number
  comments_count?: number
  is_liked?: boolean
}

export function HomePage() {
  const [countries, setCountries] = useState<CountryStats[]>([])
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [postsLoading, setPostsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [showAllPosts, setShowAllPosts] = useState(false)

  useEffect(() => {
    fetchCountryStats()
    fetchRecentPosts()
  }, [])

  const fetchCountryStats = async () => {
    try {
      setLoading(true)
      
      // データベースから全197カ国の統計情報を取得
      const response = await apiClient.getCountryStats()
      
      if (response.data) {
        const countryStats = response.data.countries.map((country, index) => ({
          country: country.name,
          flagEmoji: country.flag_emoji,
          tipCount: country.tip_count,
          lastPostDate: country.last_post_date,
          recentTips: country.recent_tips?.map((tip: { title: string; category: string }, tipIndex: number) => ({
            id: index * 1000 + tipIndex,
            title: tip.title,
            category: tip.category,
            author_name: 'ユーザー',
            created_at: new Date().toISOString()
          })) || []
        }))
        
        // TIPS数でソート（投稿数が多い順）
        const sortedCountries = countryStats.sort((a, b) => b.tipCount - a.tipCount)
        setCountries(sortedCountries)
      }
    } catch (error) {
      console.error('Error fetching country stats:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredCountries = countries.filter(country =>
    country.country.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const fetchRecentPosts = async () => {
    try {
      setPostsLoading(true)
      const response = await apiClient.getPosts({ per_page: 10 })
      
      if (response.data) {
        setPosts(response.data.posts)
      }
    } catch (error) {
      console.error('Error fetching recent posts:', error)
    } finally {
      setPostsLoading(false)
    }
  }

  const handlePostCreated = () => {
    // 統計情報と投稿を再取得
    fetchCountryStats()
    fetchRecentPosts()
  }


  return (
    <div className="min-h-screen">
      {/* Post Form Section - Always visible for logged in users */}
      <div id="post-form-section" className="bg-gray-50 border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">旅の体験を共有しよう</h2>
            <p className="text-gray-600">世界中のバックパッカーとあなたのTIPSを共有してください</p>
          </div>
          <PostForm 
            onPostCreated={handlePostCreated}
            placeholder="旅の体験やTIPSを共有しましょう..."
          />
        </div>
      </div>

      {/* Category Section */}
      <CategorySection />

      {/* Recent Posts Section */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">最新の投稿</h2>
            <p className="text-gray-600">世界中のバックパッカーからの最新TIPS</p>
          </div>

          {postsLoading ? (
            <div className="space-y-6">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="bg-white rounded-xl shadow-sm p-6 animate-pulse">
                  <div className="h-6 bg-gray-200 rounded mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          ) : posts.length > 0 ? (
            <div className="space-y-6">
              {(showAllPosts ? posts : posts.slice(0, 5)).map(post => (
                <PostCard
                  key={post.id}
                  post={post}
                />
              ))}
              
              {posts.length > 5 && (
                <div className="text-center pt-6">
                  <button
                    onClick={() => setShowAllPosts(!showAllPosts)}
                    className="bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition-colors"
                  >
                    {showAllPosts ? '最新5件を表示' : `すべての投稿を表示 (${posts.length}件)`}
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-12">
              <MessageCircle className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-medium text-gray-900 mb-2">
                まだ投稿がありません
              </h3>
              <p className="text-gray-600">
                最初の投稿をしてみませんか？
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Search Section */}
      <div id="search-section" className="bg-gray-50 border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="国名で検索... (例: 日本、タイ、アメリカ)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 text-gray-900 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
            <div className="text-sm text-gray-500 flex items-center">
              {filteredCountries.length} / {countries.length} カ国
            </div>
          </div>
        </div>
      </div>

      {/* Countries Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white rounded-xl shadow-sm p-6 animate-pulse">
                <div className="h-6 bg-gray-200 rounded mb-4"></div>
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCountries.map(country => (
              <CountryCard
                key={country.country}
                country={country.country}
                flagEmoji={country.flagEmoji}
                tipCount={country.tipCount}
                lastPostDate={country.lastPostDate}
                recentTips={country.recentTips}
              />
            ))}
          </div>
        )}

        {filteredCountries.length === 0 && !loading && (
          <div className="text-center py-12">
            <Search className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-gray-900 mb-2">
              検索結果が見つかりませんでした
            </h3>
            <p className="text-gray-600">
              「{searchQuery}」に一致する国が見つかりませんでした
            </p>
            <button 
              onClick={() => setSearchQuery('')}
              className="mt-4 text-primary-600 hover:text-primary-700 font-medium"
            >
              検索をクリア
            </button>
          </div>
        )}
      </div>
    </div>
  )
}