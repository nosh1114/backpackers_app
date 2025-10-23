import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Search, TrendingUp, Globe, Users, Clock, MessageCircle, Heart } from 'lucide-react'
import { CountryCard } from '../components/CountryCard'
import { PostCard } from '../components/PostCard'
import { PostForm } from '../components/PostForm'
import { apiClient } from '../lib/api'
// COUNTRIESのimportを削除
// import { COUNTRIES } from '../lib/constants'

interface CountryStats {
  country: string
  flagEmoji: string
  tipCount: number
  lastPostDate: string
  recentTips: Array<{
    title: string
    category: string
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
        const countryStats = response.data.countries.map(country => ({
          country: country.name,
          flagEmoji: country.flag_emoji,
          tipCount: country.tip_count,
          lastPostDate: country.last_post_date,
          recentTips: country.recent_tips
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

  const totalTips = countries.reduce((sum, country) => sum + country.tipCount, 0)
  const activeCountries = countries.filter(country => country.tipCount > 0).length

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

  const handleLike = async (postId: number) => {
    try {
      // TODO: いいね機能の実装
      console.log('Like post:', postId)
      
      // ローカル状態を更新
      setPosts(posts.map(p => 
        p.id === postId 
          ? { 
              ...p, 
              is_liked: !p.is_liked,
              likes_count: (p.likes_count || 0) + (p.is_liked ? -1 : 1)
            }
          : p
      ))
    } catch (error) {
      console.error('Error toggling like:', error)
    }
  }

  const handleComment = async (postId: number) => {
    // TODO: コメント機能の実装
    console.log('Comment on post:', postId)
  }

  const handleShare = async (postId: number) => {
    // TODO: 共有機能の実装
    console.log('Share post:', postId)
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-primary-600 to-primary-700 text-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              世界のバックパッカーと
              <br />
              旅の知恵を共有しよう
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-primary-100">
              {countries.length}カ国から集まった実体験に基づくTIPSで、
              <br />
              あなたの旅をより安全で楽しいものに
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                onClick={() => document.getElementById('recent-posts-section')?.scrollIntoView({ behavior: 'smooth' })}
                className="bg-white text-primary-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-primary-50 transition-colors"
              >
                最新投稿を見る
              </button>
              <button 
                onClick={() => document.getElementById('post-form-section')?.scrollIntoView({ behavior: 'smooth' })}
                className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-white hover:text-primary-600 transition-colors"
              >
                投稿を始める
              </button>
              <button 
                onClick={() => document.getElementById('search-section')?.scrollIntoView({ behavior: 'smooth' })}
                className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-white hover:text-primary-600 transition-colors"
              >
                国を探す
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="flex items-center justify-center w-12 h-12 bg-primary-100 rounded-lg mx-auto mb-4">
                <Globe className="h-6 w-6 text-primary-600" />
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-2">{countries.length}</div>
              <div className="text-gray-600">対応国数</div>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center w-12 h-12 bg-secondary-100 rounded-lg mx-auto mb-4">
                <TrendingUp className="h-6 w-6 text-secondary-600" />
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-2">{totalTips}</div>
              <div className="text-gray-600">総TIPS数</div>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center w-12 h-12 bg-accent-100 rounded-lg mx-auto mb-4">
                <Users className="h-6 w-6 text-accent-600" />
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-2">{activeCountries}</div>
              <div className="text-gray-600">アクティブ者数</div>
            </div>
          </div>
        </div>
      </div>

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
                  onLike={handleLike}
                  onComment={handleComment}
                  onShare={handleShare}
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