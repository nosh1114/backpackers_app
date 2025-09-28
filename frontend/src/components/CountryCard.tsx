import React from 'react'
import { Link } from 'react-router-dom'
import { MapPin, Calendar, MessageCircle } from 'lucide-react'

interface CountryCardProps {
  country: string
  flagEmoji?: string
  tipCount: number
  lastPostDate: string
  recentTips: Array<{
    title: string
    category: string
  }>
}

export function CountryCard({ country, flagEmoji, tipCount, lastPostDate, recentTips }: CountryCardProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffTime = Math.abs(now.getTime() - date.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    
    if (diffDays === 1) return '今日'
    if (diffDays <= 7) return `${diffDays}日前`
    if (diffDays <= 30) return `${Math.floor(diffDays / 7)}週間前`
    return `${Math.floor(diffDays / 30)}ヶ月前`
  }

  return (
    <Link to={`/country/${encodeURIComponent(country)}`}>
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md hover:border-primary-200 transition-all duration-300 transform hover:-translate-y-1 group">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <span className="text-3xl">{flagEmoji || ''}</span>
            <h3 className="text-xl font-semibold text-gray-900 group-hover:text-primary-600 transition-colors">
              {country}
            </h3>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-primary-600">{tipCount}</div>
            <div className="text-sm text-gray-500">TIPS</div>
          </div>
        </div>

        {/* Stats */}
        <div className="flex items-center space-x-4 mb-4 text-sm text-gray-600">
          <div className="flex items-center space-x-1">
            <Calendar className="h-4 w-4" />
            <span>最新: {formatDate(lastPostDate)}</span>
          </div>
        </div>

        {/* Recent Tips Preview */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-gray-700 mb-2">最近のTIPS</h4>
          {recentTips.slice(0, 2).map((tip, index) => (
            <div key={index} className="flex items-center space-x-2 text-sm">
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-secondary-100 text-secondary-800">
                {tip.category}
              </span>
              <span className="text-gray-600 truncate flex-1">{tip.title}</span>
            </div>
          ))}
        </div>

        {/* View More Button */}
        <div className="mt-4 pt-4 border-t border-gray-100">
          <div className="text-center">
            <span className="text-sm text-primary-600 font-medium group-hover:text-primary-700 transition-colors">
              詳細を見る →
            </span>
          </div>
        </div>
      </div>
    </Link>
  )
}