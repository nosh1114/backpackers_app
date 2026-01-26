import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { User, LogOut, Menu, X, Search, Globe, FolderOpen, PenSquare, Shield } from 'lucide-react'
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
    <header className="shadow-sm">
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
            </Link>
          </div>

          {/* 中央：検索バー */}
        <div className="flex-1 mx-4">
          <div 
            className="relative cursor-pointer"
            onClick={() => navigate('/search')}
          >
            <input 
              type="text" 
              placeholder="国や悩みを検索" 
              readOnly
              className="w-full bg-white border border-gray-200 rounded-full py-2 pl-10 pr-4 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-200 cursor-pointer"
            />
            <Search className="absolute left-3 top-2.5 text-gray-400 pointer-events-none" size={16} />
          </div>
        </div>

        <div className="flex items-center gap-3">
            {/* プロフィール画像 - スマホ・PC両方で表示 */}
            <Link to="/profile" className="flex items-center">
              {isAuthenticated && user ? (
                user.avatar_url ? (
                  <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-gray-300 overflow-hidden border-2 border-white shadow-sm">
                    <img
                      src={user.avatar_url}
                      alt={user.name || 'profile'}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="w-8 h-8 md:w-10 md:h-10 bg-gray-300 rounded-full flex items-center justify-center border-2 border-white shadow-sm">
                    {/* 今後userのアイコンを表示する */}
                    <User className="h-4 w-4 md:h-5 md:w-5 text-gray-600" />
                  </div>
                )
              ) : (
                <div className="w-8 h-8 md:w-10 md:h-10 bg-gray-300 rounded-full flex items-center justify-center border-2 border-white shadow-sm">
                  <User className="h-4 w-4 md:h-5 md:w-5 text-gray-600" />
                </div>
              )}
            </Link>
            
            {/* ハンバーガーメニュー */}
            <div className="flex items-center flex-shrink-0">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-gray-700 hover:text-gray-600 focus:outline-none focus:text-gray-600"
              >
                {isMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </button>
            </div>
        </div>

          {/* 右側：ユーザープロフィールとメニュー */}

        </div>

        {/* モバイル検索バー */}
        {/* <div className="md:hidden pb-4">
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
        </div> */}

        {/* モバイルメニュー */}
        {isMenuOpen && (
          <div className="pb-4">
            <div className="px-2 pt-2 pb-3 bg-white rounded-lg shadow-lg mt-2 border border-gray-100">
              {/* 探す */}
              <div className="px-3 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                探す
              </div>
              <Link
                to="/countries"
                className="flex items-center gap-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 px-3 py-3 rounded-md text-base font-medium transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                <Globe className="h-5 w-5" />
                <span>国で探す</span>
              </Link>
              <Link
                to="/#categories"
                className="flex items-center gap-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 px-3 py-3 rounded-md text-base font-medium transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                <FolderOpen className="h-5 w-5" />
                <span>カテゴリで探す</span>
              </Link>

              {/* 投稿 */}
              <div className="border-t border-gray-100 mt-2 pt-2">
                <div className="px-3 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  投稿
                </div>
                {isAuthenticated ? (
                  <Link
                    to="/create-post"
                    className="flex items-center gap-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 px-3 py-3 rounded-md text-base font-medium transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <PenSquare className="h-5 w-5" />
                    <span>情報を投稿する</span>
                  </Link>
                ) : (
                  <Link
                    to="/auth"
                    className="flex items-center gap-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 px-3 py-3 rounded-md text-base font-medium transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <PenSquare className="h-5 w-5" />
                    <span>情報を投稿する</span>
                    <span className="text-xs text-gray-400">(要ログイン)</span>
                  </Link>
                )}
              </div>

              {/* アカウント */}
              <div className="border-t border-gray-100 mt-2 pt-2">
                <div className="px-3 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  アカウント
                </div>
                {isAuthenticated ? (
                  <>
                    <Link
                      to="/profile"
                      className="flex items-center gap-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 px-3 py-3 rounded-md text-base font-medium transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <User className="h-5 w-5" />
                      <span>マイページ</span>
                    </Link>
                    {user?.admin && (
                      <Link
                        to="/admin"
                        className="flex items-center gap-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 px-3 py-3 rounded-md text-base font-medium transition-colors"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <Shield className="h-5 w-5" />
                        <span>管理画面</span>
                      </Link>
                    )}
                    <button
                      onClick={() => {
                        handleSignOut()
                        setIsMenuOpen(false)
                      }}
                      className="flex items-center gap-3 text-gray-700 hover:bg-red-50 hover:text-red-600 px-3 py-3 rounded-md text-base font-medium transition-colors w-full"
                    >
                      <LogOut className="h-5 w-5" />
                      <span>ログアウト</span>
                    </button>
                  </>
                ) : (
                  <Link
                    to="/auth"
                    className="flex items-center gap-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 px-3 py-3 rounded-md text-base font-medium transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <User className="h-5 w-5" />
                    <span>ログイン / 新規登録</span>
                  </Link>
                )}
              </div>

              {/* その他 */}
              <div className="border-t border-gray-100 mt-2 pt-2">
                <div className="px-3 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  その他
                </div>
                <Link
                  to="/about"
                  className="flex items-center gap-3 text-gray-500 hover:bg-gray-50 hover:text-gray-700 px-3 py-2 rounded-md text-sm transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <span>サイトについて</span>
                </Link>
                <Link
                  to="/contact"
                  className="flex items-center gap-3 text-gray-500 hover:bg-gray-50 hover:text-gray-700 px-3 py-2 rounded-md text-sm transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <span>お問い合わせ</span>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}

export default Header