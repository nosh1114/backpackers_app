import { useState, useEffect } from 'react'
import { CategorySection } from '../components/CategorySection'
import { CountryScrollSection } from '../components/CountryScrollSection'
import { AreaSection } from '../components/AreaSection'
import { FeaturedArticlesSection } from '../components/FeaturedArticlesSection'
import { apiClient } from '../lib/api'
// COUNTRIESのimportを削除
// import { COUNTRIES } from '../lib/constants'

interface CountryStats {
  code: string
  country: string
  flagEmoji: string
  imageUrl?: string
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
    image_url?: string
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
  view_count?: number
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
          code: country.code,
          country: country.name,
          flagEmoji: country.flag_emoji,
          imageUrl: country.image_url,
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
      
      {/* Country Scroll Section */}
      {!loading && countries.length > 0 && (
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <CountryScrollSection 
              countries={countries.slice(0, 10)} 
              title="人気の国"
            />
          </div>
        </div>
      )}

      {/* Area Section */}
      <AreaSection title="エリアで探す" />

      {/* Featured Articles Section */}
      {!postsLoading && posts.length > 0 && (
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <FeaturedArticlesSection 
              articles={posts.slice(0, 4).map(post => ({
                id: post.id,
                title: post.title,
                views: post.view_count || 0,
                user: {
                  name: post.user.name,
                  avatar_url: post.user.avatar_url,
                },
                country: {
                  name: post.country.name,
                  image_url: post.country.image_url,
                },
              }))}
              title="特集記事"
            />
          </div>
        </div>
      )}

      {/* Category Section - 下に移動 */}
      <CategorySection />
    </div>
  )
}