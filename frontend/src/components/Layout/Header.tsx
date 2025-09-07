import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Backpack, Search, User, LogOut, Plus, Menu, X, Settings, Globe } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'

const Header: React.FC = () => {
  const { user, signOut, isAuthenticated } = useAuth()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const navigate = useNavigate()

  const handleSignOut = async () => {
    await signOut()
    navigate('/auth')
  }

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* ロゴ */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <Globe className="h-8 w-8 text-primary-600" />
              <span className="text-xl font-bold text-gray-900">Backpackers</span>
            </Link>
          </div>

          {/* デスクトップナビゲーション */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link
              to="/posts"
              className="text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
            >
              投稿一覧
            </Link>
            {isAuthenticated ? (
              <>
                <Link
                  to="/"
                  className="text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  ホーム
                </Link>
                <Link
                  to="/profile"
                  className="text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  プロフィール
                </Link>
              </>
            ) : (
              <Link
                to="/auth"
                className="text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                ログイン
              </Link>
            )}
          </nav>

          {/* ユーザーメニュー */}
          {isAuthenticated && (
            <div className="hidden md:flex items-center space-x-4">
              <Link
                to="/create-post"
                className="flex items-center space-x-1 bg-primary-600 text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-primary-700 transition-colors"
              >
                <Plus className="h-4 w-4" />
                <span>投稿作成</span>
              </Link>
              <div className="flex items-center space-x-2">
                <Link
                  to="/profile"
                  className="flex items-center space-x-2 hover:bg-gray-50 px-2 py-1 rounded-md transition-colors"
                >
                  <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                    <User className="h-4 w-4 text-primary-600" />
                  </div>
                  <span className="text-sm font-medium text-gray-700">{user?.name}</span>
                </Link>
              </div>
              <button
                onClick={handleSignOut}
                className="flex items-center space-x-1 text-gray-700 hover:text-red-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                <LogOut className="h-4 w-4" />
                <span>ログアウト</span>
              </button>
            </div>
          )}

          {/* モバイルメニューボタン */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-700 hover:text-primary-600 focus:outline-none focus:text-primary-600"
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* モバイルメニュー */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 border-t border-gray-200">
              <Link
                to="/posts"
                className="text-gray-700 hover:text-primary-600 block px-3 py-2 rounded-md text-base font-medium transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                投稿一覧
              </Link>
              {isAuthenticated ? (
                <>
                  <Link
                    to="/create-post"
                    className="text-gray-700 hover:text-primary-600 block px-3 py-2 rounded-md text-base font-medium transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    投稿作成
                  </Link>
                  <Link
                    to="/"
                    className="text-gray-700 hover:text-primary-600 block px-3 py-2 rounded-md text-base font-medium transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    ホーム
                  </Link>
                  <Link
                    to="/profile"
                    className="text-gray-700 hover:text-primary-600 block px-3 py-2 rounded-md text-base font-medium transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    プロフィール
                  </Link>
                  <div className="border-t border-gray-200 pt-4 mt-4">
                    <Link
                      to="/profile"
                      className="flex items-center space-x-2 px-3 py-2 hover:bg-gray-50 rounded-md transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                        <User className="h-4 w-4 text-primary-600" />
                      </div>
                      <span className="text-sm font-medium text-gray-700">{user?.name}</span>
                    </Link>
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
                  className="text-gray-700 hover:text-primary-600 block px-3 py-2 rounded-md text-base font-medium transition-colors"
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