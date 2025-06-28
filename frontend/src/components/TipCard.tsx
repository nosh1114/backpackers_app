import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { Heart, MessageCircle, MapPin, Calendar, User, Flag, ExternalLink } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'

interface TipCardProps {
  tip: {
    id: string
    country: string
    city?: string
    category: string
    title: string
    content: string
    image_url?: string
    tags?: string[]
    location?: string
    author_id: string
    author_name: string
    author_trust_score: number
    likes_count: number
    comments_count: number
    is_verified: boolean
    created_at: string
    is_liked?: boolean
  }
  onLike?: (tipId: string) => void
  onReport?: (tipId: string) => void
}

export function TipCard({ tip, onLike, onReport }: TipCardProps) {
  const { user } = useAuth()
  const [showReportMenu, setShowReportMenu] = useState(false)

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffTime = Math.abs(now.getTime() - date.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    
    if (diffDays <= 7) return '🔥 新着'
    if (diffDays <= 30) return `${Math.floor(diffDays / 7)}週間前`
    return `${Math.floor(diffDays / 30)}ヶ月前`
  }

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      '交通': 'bg-blue-100 text-blue-800',
      '宿': 'bg-green-100 text-green-800',
      '食事': 'bg-orange-100 text-orange-800',
      'SIM': 'bg-purple-100 text-purple-800',
      'ビザ': 'bg-red-100 text-red-800',
      '両替': 'bg-yellow-100 text-yellow-800',
      '注意点': 'bg-pink-100 text-pink-800',
      'その他': 'bg-gray-100 text-gray-800',
    }
    return colors[category] || 'bg-gray-100 text-gray-800'
  }

  const getTrustScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600'
    if (score >= 70) return 'text-yellow-600'
    return 'text-red-600'
  }

  const isRecent = () => {
    const date = new Date(tip.created_at)
    const now = new Date()
    const diffTime = Math.abs(now.getTime() - date.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays <= 7
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all duration-300 animate-fade-in">
      {/* Image */}
      {tip.image_url && (
        <div className="aspect-w-16 aspect-h-9 relative">
          <img
            src={tip.image_url}
            alt={tip.title}
            className="w-full h-48 object-cover"
          />
          {isRecent() && (
            <div className="absolute top-3 left-3 bg-accent-500 text-white px-2 py-1 rounded-full text-xs font-medium">
              🔥 NEW
            </div>
          )}
        </div>
      )}

      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center space-x-2">
            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(tip.category)}`}>
              {tip.category}
            </span>
            {isRecent() && !tip.image_url && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-accent-100 text-accent-800">
                🔥 NEW
              </span>
            )}
            {tip.is_verified && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                ✓ 認証済み
              </span>
            )}
          </div>
          
          {/* Report button */}
          <div className="relative">
            <button
              onClick={() => setShowReportMenu(!showReportMenu)}
              className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <Flag className="h-4 w-4" />
            </button>
            
            {showReportMenu && (
              <div className="absolute right-0 mt-1 w-32 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-10">
                <button
                  onClick={() => {
                    onReport?.(tip.id)
                    setShowReportMenu(false)
                  }}
                  className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                >
                  通報する
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Location */}
        <div className="flex items-center space-x-1 text-sm text-gray-600 mb-3">
          <MapPin className="h-4 w-4" />
          <span>{tip.country}</span>
          {tip.city && <span>・{tip.city}</span>}
        </div>

        {/* Title and Content */}
        <Link to={`/tips/${tip.id}`}>
          <h3 className="text-lg font-semibold text-gray-900 mb-2 hover:text-primary-600 transition-colors line-clamp-2">
            {tip.title}
          </h3>
        </Link>
        
        <p className="text-gray-600 text-sm mb-4 line-clamp-3">
          {tip.content}
        </p>

        {/* Tags */}
        {tip.tags && tip.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-4">
            {tip.tags.slice(0, 3).map((tag, index) => (
              <span
                key={index}
                className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-600"
              >
                #{tag}
              </span>
            ))}
            {tip.tags.length > 3 && (
              <span className="text-xs text-gray-500">+{tip.tags.length - 3}</span>
            )}
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          {/* Author info */}
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full flex items-center justify-center">
              <User className="h-4 w-4 text-white" />
            </div>
            <div>
              <div className="text-sm font-medium text-gray-900">{tip.author_name}</div>
              <div className="flex items-center space-x-2 text-xs text-gray-500">
                <span>信頼度:</span>
                <span className={`font-medium ${getTrustScoreColor(tip.author_trust_score)}`}>
                  {tip.author_trust_score}
                </span>
                <span>・{formatDate(tip.created_at)}</span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-4">
            <button
              onClick={() => onLike?.(tip.id)}
              disabled={!user}
              className={`flex items-center space-x-1 text-sm transition-colors ${
                tip.is_liked
                  ? 'text-red-600 hover:text-red-700'
                  : 'text-gray-600 hover:text-red-600'
              } ${!user ? 'cursor-not-allowed opacity-50' : ''}`}
            >
              <Heart className={`h-4 w-4 ${tip.is_liked ? 'fill-current' : ''}`} />
              <span>{tip.likes_count}</span>
            </button>
            
            <Link
              to={`/tips/${tip.id}`}
              className="flex items-center space-x-1 text-sm text-gray-600 hover:text-primary-600 transition-colors"
            >
              <MessageCircle className="h-4 w-4" />
              <span>{tip.comments_count}</span>
            </Link>

            <Link
              to={`/tips/${tip.id}`}
              className="text-sm text-primary-600 hover:text-primary-700 transition-colors"
            >
              <ExternalLink className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}