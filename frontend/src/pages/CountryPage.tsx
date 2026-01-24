import { useState, useEffect, useRef } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Search, MapPin, ChevronLeft, ChevronRight, X, Filter, Plus } from 'lucide-react'
import { PostCard } from '../components/PostCard'
import { apiClient } from '../lib/api'
import { useAuth } from '../contexts/AuthContext'

interface Post {
  id: number
  title: string
  content: string
  category?: string
  featured?: boolean
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
  view_count?: number
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
  const [sort, setSort] = useState<'recent' | 'popular'>('popular')
  const [selectedCategory, setSelectedCategory] = useState<string>('')
  const [categories, setCategories] = useState<string[]>([])
  const [page, setPage] = useState(1)
  const [pagination, setPagination] = useState<{
    page: number
    per_page: number
    total_count: number
    total_pages: number
  } | null>(null)
  const [isCategoryPopupOpen, setIsCategoryPopupOpen] = useState(false)
  const [categorySearchQuery, setCategorySearchQuery] = useState('')
  const categoryContainerRef = useRef<HTMLDivElement>(null)
  const categoryPopupRef = useRef<HTMLDivElement>(null)
  const categoryButtonRef = useRef<HTMLButtonElement>(null)
  const [popupPosition, setPopupPosition] = useState<{ top: number; left: number } | null>(null)

  // パスから取得した国コード
  const countryCode = country?.toLowerCase() || ''

  useEffect(() => {
    if (countryCode) {
      fetchCountryData()
    }
    fetchCategories()
  }, [countryCode])

  useEffect(() => {
    if (countryData) {
      setPage(1) // カテゴリーやソート変更時は1ページ目に戻す
      fetchPosts()
    }
  }, [countryData, sort, selectedCategory, page])

  // カテゴリーポップアップの外側クリックで閉じる
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node
      if (
        categoryPopupRef.current && 
        !categoryPopupRef.current.contains(target) &&
        categoryButtonRef.current &&
        !categoryButtonRef.current.contains(target) &&
        categoryContainerRef.current &&
        !categoryContainerRef.current.contains(target)
      ) {
        setIsCategoryPopupOpen(false)
        setPopupPosition(null)
      }
    }

    if (isCategoryPopupOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isCategoryPopupOpen])

  const fetchCategories = async () => {
    try {
      const response = await apiClient.getPostCategories()
      if (response.data) {
        setCategories(response.data.categories)
      }
    } catch (error) {
      console.error('Error fetching categories:', error)
    }
  }

  const fetchCountryData = async () => {
    try {
      const response = await apiClient.getCountries()
      if (response.data) {
        const foundCountry = response.data.countries.find(c => c.code.toLowerCase() === countryCode)
        if (foundCountry) {
          setCountryData(foundCountry)
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
      const response = await apiClient.getPostsByCountry(countryData.id, {
        page,
        per_page: 20,
        category: selectedCategory || undefined,
        sort
      })
      
      if (response.data) {
        setPosts(response.data.posts)
        if (response.data.pagination) {
          setPagination(response.data.pagination)
        }
      }
    } catch (error) {
      console.error('Error fetching posts:', error)
    } finally {
      setLoading(false)
    }
  }


  const filteredPosts = posts.filter(post => {
    const matchesSearch = !searchQuery || 
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.content.toLowerCase().includes(searchQuery.toLowerCase())
    
    return matchesSearch
  })

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category === selectedCategory ? '' : category)
    setPage(1)
    setIsCategoryPopupOpen(false)
    setCategorySearchQuery('')
    setPopupPosition(null)
  }

  const handleSortChange = (newSort: 'recent' | 'popular') => {
    setSort(newSort)
    setPage(1)
  }

  const filteredCategories = categories.filter(category =>
    category.toLowerCase().includes(categorySearchQuery.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex items-center space-x-4">
              <span className="text-4xl flex-shrink-0">{countryData?.flag_emoji || '🌍'}</span>
              <div className="min-w-0">
                <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 truncate">{countryData?.name || country}</h1>
                <p className="text-gray-600 mt-1 text-sm lg:text-base">
                  {pagination ? `${pagination.total_count}件の投稿` : '投稿を読み込み中...'}
                </p>
              </div>
            </div>
            
            {/* Search */}
            <div className="flex-shrink-0 lg:w-80">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  placeholder="キーワードやタグで検索..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 lg:py-3 text-sm lg:text-base text-gray-900 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Post Button Section - Always visible for logged in users */}
      {user && countryData && (
        <div className="bg-gray-50 border-b border-gray-200">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <Link
              to={`/create-post?country_id=${countryData.id}`}
              className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-5 h-5" />
              <span>{countryData.name}にTIPSを投稿</span>
            </Link>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
            {/* カテゴリーフィルター（ポップアップ形式） */}
            <div className="relative" ref={categoryContainerRef}>
              <button
                ref={categoryButtonRef}
                onClick={() => {
                  if (categoryButtonRef.current) {
                    const rect = categoryButtonRef.current.getBoundingClientRect()
                    setPopupPosition({
                      top: rect.bottom + window.scrollY + 8,
                      left: rect.left + window.scrollX
                    })
                  }
                  setIsCategoryPopupOpen(!isCategoryPopupOpen)
                }}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  selectedCategory
                    ? 'bg-blue-600 text-white hover:bg-blue-700'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <Filter className="h-4 w-4" />
                <span>{selectedCategory || 'カテゴリー'}</span>
                {selectedCategory && (
                  <div
                    onClick={(e) => {
                      e.stopPropagation()
                      handleCategoryChange('')
                    }}
                    className="ml-1 hover:bg-blue-700 rounded-full p-0.5 cursor-pointer"
                  >
                    <X className="h-3 w-3" />
                  </div>
                )}
              </button>

              {/* ポップアップ */}
              {isCategoryPopupOpen && popupPosition && (
                <div 
                  ref={categoryPopupRef}
                  className="fixed w-64 bg-white rounded-lg shadow-lg border border-gray-200 z-50"
                  style={{
                    top: `${popupPosition.top}px`,
                    left: `${popupPosition.left}px`
                  }}
                >
                  {/* 検索ボックス */}
                  <div className="p-3 border-b border-gray-200">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <input
                        type="text"
                        placeholder="カテゴリーを検索..."
                        value={categorySearchQuery}
                        onChange={(e) => setCategorySearchQuery(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        autoFocus
                      />
                    </div>
                  </div>

                  {/* カテゴリーリスト */}
                  <div className="max-h-64 overflow-y-auto">
                    <button
                      onClick={() => handleCategoryChange('')}
                      className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 transition-colors ${
                        selectedCategory === '' ? 'bg-blue-50 text-blue-600 font-medium' : 'text-gray-700'
                      }`}
                    >
                      すべて
                    </button>
                    {filteredCategories.length > 0 ? (
                      filteredCategories.map((category) => (
                        <button
                          key={category}
                          onClick={() => handleCategoryChange(category)}
                          className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 transition-colors ${
                            selectedCategory === category ? 'bg-blue-50 text-blue-600 font-medium' : 'text-gray-700'
                          }`}
                        >
                          {category}
                        </button>
                      ))
                    ) : (
                      <div className="px-4 py-8 text-center text-sm text-gray-500">
                        カテゴリーが見つかりませんでした
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* ソート */}
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">並び替え:</span>
              <button
                onClick={() => handleSortChange('popular')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  sort === 'popular'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                人気順
              </button>
              <button
                onClick={() => handleSortChange('recent')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  sort === 'recent'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                新着順
              </button>
            </div>
          </div>
        </div>
      </div>

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
          <>
            <div className="space-y-6">
              {filteredPosts.map(post => (
                <PostCard
                  key={post.id}
                  post={post}
                />
              ))}
            </div>

            {/* ページネーション */}
            {pagination && pagination.total_pages > 1 && (
              <div className="mt-8 flex items-center justify-center gap-2">
                <button
                  onClick={() => setPage(page - 1)}
                  disabled={page === 1}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    page === 1
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
                  }`}
                >
                  <ChevronLeft className="h-4 w-4 inline" />
                  前へ
                </button>
                
                <div className="flex items-center gap-1">
                  {[...Array(pagination.total_pages)].map((_, i) => {
                    const pageNum = i + 1
                    // 現在のページ周辺のみ表示
                    if (
                      pageNum === 1 ||
                      pageNum === pagination.total_pages ||
                      (pageNum >= page - 1 && pageNum <= page + 1)
                    ) {
                      return (
                        <button
                          key={pageNum}
                          onClick={() => setPage(pageNum)}
                          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                            page === pageNum
                              ? 'bg-blue-600 text-white'
                              : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
                          }`}
                        >
                          {pageNum}
                        </button>
                      )
                    } else if (pageNum === page - 2 || pageNum === page + 2) {
                      return <span key={pageNum} className="px-2 text-gray-400">...</span>
                    }
                    return null
                  })}
                </div>

                <button
                  onClick={() => setPage(page + 1)}
                  disabled={page === pagination.total_pages}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    page === pagination.total_pages
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
                  }`}
                >
                  次へ
                  <ChevronRight className="h-4 w-4 inline" />
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-16">
            <MapPin className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-gray-900 mb-2">
              {searchQuery || selectedCategory ? '投稿が見つかりませんでした' : 'まだ投稿がありません'}
            </h3>
            <p className="text-gray-600 mb-6">
              {searchQuery || selectedCategory
                ? '検索条件やフィルターを変更して再度お試しください'
                : `${countryData?.name || country}の最初の投稿をしてみませんか？`
              }
            </p>
          </div>
        )}
      </div>
    </div>
  )
}