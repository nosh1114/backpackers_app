import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { Search, MapPin } from 'lucide-react'
import { PostCard } from '../components/PostCard'
import { PostForm } from '../components/PostForm'
import { apiClient } from '../lib/api'
import { useAuth } from '../contexts/AuthContext'

interface Post {
  id: number
  title: string
  content: string
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

interface Country {
  id: number
  code: string
  name: string
  flag_emoji: string
}

export function CountryPage() {
  const { country } = useParams<{ country: string }>()
  const { user } = useAuth()
  const [posts, setPosts] = useState<Post[]>([])
  const [countryData, setCountryData] = useState<Country | null>(null)
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')

  // decodedとは？
  // decodedはエンコードされた文字列をデコードするための関数
  const decodedCountry = country ? decodeURIComponent(country) : ''

  useEffect(() => {
    if (decodedCountry) {
      fetchCountryData()
    }
  }, [decodedCountry])

  useEffect(() => {
    if (countryData) {
      fetchPosts()
    }
  }, [countryData])

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

  const fetchPosts = async () => {
    if (!countryData) return
    
    try {
      setLoading(true)
      const response = await apiClient.getPostsByCountry(countryData.id)
      
      if (response.data) {
        setPosts(response.data.posts)
      }
    } catch (error) {
      console.error('Error fetching posts:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleLike = async (postId: number) => {
    if (!user) return

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

  const handlePostCreated = () => {
    // 投稿を再取得
    fetchPosts()
  }

  const filteredPosts = posts.filter(post => {
    const matchesSearch = !searchQuery || 
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.content.toLowerCase().includes(searchQuery.toLowerCase())
    
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
                  {filteredPosts.length}件の投稿
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
        ) : filteredPosts.length > 0 ? (
          <div className="space-y-6">
            {filteredPosts.map(post => (
              <PostCard
                key={post.id}
                post={post}
                onLike={handleLike}
                onComment={handleComment}
                onShare={handleShare}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <MapPin className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-gray-900 mb-2">
              {searchQuery ? '投稿が見つかりませんでした' : 'まだ投稿がありません'}
            </h3>
            <p className="text-gray-600 mb-6">
              {searchQuery 
                ? '検索条件を変更して再度お試しください'
                : `${decodedCountry}の最初の投稿をしてみませんか？`
              }
            </p>
          </div>
        )}
      </div>
    </div>
  )
}