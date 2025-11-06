import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { User, LogOut, Menu, X, Search } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'

const Header: React.FC = () => {
  const { user, signOut, isAuthenticated } = useAuth()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const navigate = useNavigate()

  const handleSignOut = async () => {
    await signOut()
    navigate('/auth')
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      // 検索機能の実装（後で拡張可能）
      // 今は国名検索として処理
      navigate(`/country/${encodeURIComponent(searchQuery)}`)
    }
  }

  return (
    <header className="bg-purple-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* 左側：ロゴ */}
          <div className="flex items-center flex-shrink-0">
            <Link to="/" className="flex flex-col">
              <span className="text-2xl font-bold">
                <span className="text-orange-500">B</span>
                <span className="text-gray-900">appa</span>
                <span className="text-blue-600">Navi</span>
              </span>
              <span className="text-xs text-gray-900 mt-0.5">バックパッカーのための情報サイト</span>
            </Link>
          </div>

          {/* 中央：検索バー */}
          <div className="flex-1 max-w-2xl mx-8 hidden md:block">
            <form onSubmit={handleSearch} className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="国や悩みを検索"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 text-gray-900 rounded-lg border-0 focus:ring-2 focus:ring-purple-300 bg-white shadow-sm"
              />
            </form>
          </div>

          {/* 右側：ユーザープロフィールとメニュー */}
          <div className="flex items-center space-x-4 flex-shrink-0">
            {isAuthenticated && user && (
              <>
                {/* プロフィール画像 */}
                <Link to="/profile" className="hidden md:block">
                  {user.avatar_url ? (
                    <img
                      src={user.avatar_url}
                      alt={user.name}
                      className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-sm"
                    />
                  ) : (
                    <div className="w-10 h-10 bg-purple-200 rounded-full flex items-center justify-center border-2 border-white shadow-sm">
                      <User className="h-5 w-5 text-purple-600" />
                    </div>
                  )}
                </Link>
              </>
            )}
            
            {/* ハンバーガーメニュー */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-700 hover:text-purple-600 focus:outline-none focus:text-purple-600"
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* モバイル検索バー */}
        <div className="md:hidden pb-4">
          <form onSubmit={handleSearch} className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="国や悩みを検索"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 text-gray-900 rounded-lg border-0 focus:ring-2 focus:ring-purple-300 bg-white shadow-sm"
            />
          </form>
        </div>

        {/* モバイルメニュー */}
        {isMenuOpen && (
          <div className="md:hidden pb-4">
            <div className="px-2 pt-2 pb-3 space-y-1 bg-white rounded-lg shadow-lg mt-2">
              <Link
                to="/"
                className="text-gray-700 hover:text-purple-600 block px-3 py-2 rounded-md text-base font-medium transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                ホーム
              </Link>
              <Link
                to="/posts"
                className="text-gray-700 hover:text-purple-600 block px-3 py-2 rounded-md text-base font-medium transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                投稿一覧
              </Link>
              {isAuthenticated ? (
                <>
                  <Link
                    to="/create-post"
                    className="text-gray-700 hover:text-purple-600 block px-3 py-2 rounded-md text-base font-medium transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    投稿作成
                  </Link>
                  <Link
                    to="/profile"
                    className="text-gray-700 hover:text-purple-600 block px-3 py-2 rounded-md text-base font-medium transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    プロフィール
                  </Link>
                  <div className="border-t border-gray-200 pt-4 mt-4">
                    <div className="flex items-center space-x-2 px-3 py-2">
                      {user?.avatar_url ? (
                        <img
                          src={user.avatar_url}
                          alt={user.name}
                          className="w-8 h-8 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-8 h-8 bg-purple-200 rounded-full flex items-center justify-center">
                          <User className="h-4 w-4 text-purple-600" />
                        </div>
                      )}
                      <span className="text-sm font-medium text-gray-700">{user?.name}</span>
                    </div>
                    <button
                      onClick={() => {
                        handleSignOut()
                        setIsMenuOpen(false)
                      }}
                      className="flex items-center space-x-2 text-gray-700 hover:text-red-600 px-3 py-2 rounded-md text-base font-medium transition-colors w-full"
                    >
                      <LogOut className="h-4 w-4" />
                      <span>ログアウト</span>
                    </button>
                  </div>
                </>
              ) : (
                <Link
                  to="/auth"
                  className="text-gray-700 hover:text-purple-600 block px-3 py-2 rounded-md text-base font-medium transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  ログイン
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  )
}

export default Header