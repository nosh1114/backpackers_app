import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Search, TrendingUp, Globe, Users, Plus } from 'lucide-react'
import { CountryCard } from '../components/CountryCard'
import { mockApi } from '../lib/mockData'
import { COUNTRIES } from '../lib/constants'

interface CountryStats {
  country: string
  tipCount: number
  lastPostDate: string
  recentTips: Array<{
    title: string
    category: string
  }>
}

export function HomePage() {
  const [countries, setCountries] = useState<CountryStats[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    fetchCountryStats()
  }, [])

  const fetchCountryStats = async () => {
    try {
      const { data } = await mockApi.getCountryStats()
      
      if (data) {
        // すべての国を含むように調整
        const allCountries = COUNTRIES.map(country => {
          const existingData = data.find((d: any) => d.country === country)
          return existingData || {
            country,
            tipCount: 0,
            lastPostDate: new Date().toISOString(),
            recentTips: []
          }
        })
        
        const sortedCountries = allCountries.sort((a, b) => b.tipCount - a.tipCount)
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

  const totalTips = countries.reduce((sum, country) => sum + country.tipCount, 0)
  const activeCountries = countries.filter(country => country.tipCount > 0).length

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-600 via-primary-700 to-secondary-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
          <div className="text-center">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 animate-fade-in">
              バックパッカーTIPS
            </h1>
            <p className="text-xl sm:text-2xl mb-8 text-primary-100 max-w-3xl mx-auto leading-relaxed animate-slide-up">
              世界中の旅人が集まる情報共有プラットフォーム
              <br />
              リアルな体験と知恵を共有して、より良い旅を創造しよう
            </p>
            
            {/* Search Bar */}
            <div className="max-w-lg mx-auto mb-8 animate-slide-up">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  placeholder="国名で検索..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 text-gray-900 rounded-full border-0 focus:ring-4 focus:ring-white/20 text-lg"
                />
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto animate-fade-in">
              <div className="text-center">
                <div className="text-3xl sm:text-4xl font-bold mb-2">{totalTips}</div>
                <div className="text-primary-200">総TIPS数</div>
              </div>
              <div className="text-center">
                <div className="text-3xl sm:text-4xl font-bold mb-2">{activeCountries}</div>
                <div className="text-primary-200">対応国数</div>
              </div>
              <div className="text-center">
                <div className="text-3xl sm:text-4xl font-bold mb-2"></div>
                <div className="text-primary-200">ユーザー数</div>
              </div>
              <div className="text-center">
                <div className="text-3xl sm:text-4xl font-bold mb-2">24h</div>
                <div className="text-primary-200">リアルタイム</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">なぜバックパッカーTIPSなのか？</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              実際に現地を体験した旅人たちが投稿する、信頼できる情報プラットフォーム
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6 rounded-xl bg-gradient-to-br from-primary-50 to-secondary-50">
              <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-3">リアルタイム情報</h3>
              <p className="text-gray-600">
                現地にいる旅人からの最新情報で、常に更新される生きた情報を取得
              </p>
            </div>
            
            <div className="text-center p-6 rounded-xl bg-gradient-to-br from-secondary-50 to-primary-50">
              <div className="w-16 h-16 bg-gradient-to-br from-secondary-500 to-primary-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Globe className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-3">網羅的なカバレッジ</h3>
              <p className="text-gray-600">
                アジアを中心とした人気のバックパッカー destinations を幅広くカバー
              </p>
            </div>
            
            <div className="text-center p-6 rounded-xl bg-gradient-to-br from-accent-50 to-primary-50">
              <div className="w-16 h-16 bg-gradient-to-br from-accent-500 to-primary-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-3">信頼できるコミュニティ</h3>
              <p className="text-gray-600">
                信頼スコアシステムと実体験に基づく投稿で、質の高い情報を保証
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Countries Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4 sm:mb-0">国別TIPS</h2>
            <Link
              to="/posts"
              className="flex items-center space-x-2 bg-gradient-to-r from-primary-500 to-secondary-500 text-white px-6 py-3 rounded-full hover:from-primary-600 hover:to-secondary-600 transition-all transform hover:scale-105"
            >
              <Plus className="h-5 w-5" />
              <span>投稿一覧</span>
            </Link>
          </div>

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
                  tipCount={country.tipCount}
                  lastPostDate={country.lastPostDate}
                  recentTips={country.recentTips}
                />
              ))}
            </div>
          )}

          {filteredCountries.length === 0 && !loading && (
            <div className="text-center py-12">
              <Globe className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {searchQuery ? '検索結果が見つかりません' : '国データを読み込み中...'}
              </h3>
              <p className="text-gray-600">
                {searchQuery ? '別のキーワードで検索してみてください' : 'しばらくお待ちください'}
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}