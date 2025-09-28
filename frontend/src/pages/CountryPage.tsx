import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { Search, Filter, MapPin } from 'lucide-react'
import { TipCard } from '../components/TipCard'
import { PostForm } from '../components/PostForm'
import { mockApi } from '../lib/mockData'
import { apiClient } from '../lib/api'
import { CATEGORIES, SORT_OPTIONS } from '../lib/constants'
import { useAuth } from '../contexts/AuthContext'

interface Tip {
  id: string
  country: string
  city: string | null
  category: string
  title: string
  content: string
  image_url: string | null
  tags: string[] | null
  location: string | null
  author_id: string
  author_name: string
  author_trust_score: number
  likes_count: number
  comments_count: number
  is_verified: boolean
  created_at: string
  is_liked?: boolean
}

interface Country {
  id: number
  code: string
  name: string
  flag_emoji: string
}

export function CountryPage() {
  const { country } = useParams<{ country: string }>()
  const { user } = useAuth()
  const [tips, setTips] = useState<Tip[]>([])
  const [countryData, setCountryData] = useState<Country | null>(null)
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [sortBy, setSortBy] = useState<string>('newest')
  const [showFilters, setShowFilters] = useState(false)

  // decodedとは？
  // decodedはエンコードされた文字列をデコードするための関数
  const decodedCountry = country ? decodeURIComponent(country) : ''

  useEffect(() => {
    if (decodedCountry) {
      fetchCountryData()
      fetchTips()
    }
  }, [decodedCountry, selectedCategory, sortBy])

  const fetchCountryData = async () => {
    try {
      const response = await apiClient.getCountries()
      if (response.data) {
        const country = response.data.countries.find(c => c.name === decodedCountry)
        if (country) {
          setCountryData(country)
        }
      }
    } catch (error) {
      console.error('Error fetching country data:', error)
    }
  }

  const fetchTips = async () => {
    try {
      setLoading(true)
      const { data } = await mockApi.getTips(decodedCountry, selectedCategory, sortBy)
      
      if (data) {
        setTips(data)
      }
    } catch (error) {
      console.error('Error fetching tips:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleLike = async (tipId: string) => {
    if (!user) return

    try {
      await mockApi.toggleLike(tipId, user.id)
      
      // ローカル状態を更新
      setTips(tips.map(t => 
        t.id === tipId 
          ? { 
              ...t, 
              is_liked: !t.is_liked,
              likes_count: t.is_liked ? t.likes_count - 1 : t.likes_count + 1
            }
          : t
      ))
    } catch (error) {
      console.error('Error toggling like:', error)
    }
  }

  const handleReport = async (tipId: string) => {
    // 通報機能の実装
    console.log('Report tip:', tipId)
    alert('通報を受け付けました。確認後、適切に対処いたします。')
  }

  const handlePostCreated = () => {
    // TIPSを再取得
    fetchTips()
  }

  const filteredTips = tips.filter(tip => {
    const matchesSearch = !searchQuery || 
      tip.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tip.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tip.tags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    
    return matchesSearch
  })

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <span className="text-4xl">{countryData?.flag_emoji || '🌍'}</span>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">{decodedCountry}</h1>
                <p className="text-gray-600 mt-1">
                  {filteredTips.length}件のTIPS • {CATEGORIES.length}カテゴリ
                </p>
              </div>
            </div>
            
            {/* Search and Filters */}
            <div className="flex flex-col lg:flex-row gap-4">
              {/* Search */}
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  placeholder="キーワードやタグで検索..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 text-gray-900 rounded-lg border-0 focus:ring-2 focus:ring-white/50"
                />
              </div>

              {/* Filter Toggle (Mobile) */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="lg:hidden flex items-center space-x-2 bg-white/20 text-white px-4 py-3 rounded-lg hover:bg-white/30 transition-colors"
              >
                <Filter className="h-5 w-5" />
                <span>フィルター</span>
              </button>
            </div>
          </div>

          {/* Filters */}
          <div className={`mt-4 ${showFilters ? 'block' : 'hidden lg:block'}`}>
            <div className="flex flex-col sm:flex-row gap-4">
              {/* Category Filter */}
              <div className="flex-1">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full px-4 py-2 text-gray-900 rounded-lg border-0 focus:ring-2 focus:ring-white/50"
                >
                  <option value="all">すべてのカテゴリ</option>
                  {CATEGORIES.map(category => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>

              {/* Sort */}
              <div className="flex-1">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full px-4 py-2 text-gray-900 rounded-lg border-0 focus:ring-2 focus:ring-white/50"
                >
                  {SORT_OPTIONS.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Post Form Section - Always visible for logged in users */}
      {user && countryData && (
        <div className="bg-gray-50 border-b border-gray-200">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              {countryData.name}にTIPSを投稿
            </h2>
            <PostForm 
              fixedCountryId={countryData.id}
              onPostCreated={handlePostCreated}
              placeholder={`${countryData.name}での体験やTIPSを共有しましょう...`}
              compact={true}
            />
          </div>
        </div>
      )}

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-white rounded-xl shadow-sm p-6 animate-pulse">
                <div className="h-6 bg-gray-200 rounded mb-4"></div>
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        ) : filteredTips.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredTips.map(tip => (
              <TipCard
                key={tip.id}
                tip={tip}
                onLike={handleLike}
                onReport={handleReport}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <MapPin className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-gray-900 mb-2">
              {searchQuery ? 'TIPSが見つかりませんでした' : 'まだTIPSが投稿されていません'}
            </h3>
            <p className="text-gray-600 mb-6">
              {searchQuery 
                ? '検索条件を変更して再度お試しください'
                : `${decodedCountry}の最初のTIPSを投稿しませんか？`
              }
            </p>
          </div>
        )}
      </div>
    </div>
  )
}