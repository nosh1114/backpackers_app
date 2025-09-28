import React, { useState } from 'react'
import { useNavigate, useSearchParams, useLocation, Link } from 'react-router-dom'
import { Backpack, Eye, EyeOff, Mail, User, Lock, ArrowRight } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'

export function AuthPage() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const location = useLocation()
  const { signIn, signUp } = useAuth()
  
  const [mode, setMode] = useState(searchParams.get('mode') === 'signup' ? 'signup' : 'signin')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [passwordConfirmation, setPasswordConfirmation] = useState('')
  const [name, setName] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showPasswordConfirmation, setShowPasswordConfirmation] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  // ログイン後にリダイレクトするページを取得
  const from = location.state?.from?.pathname || '/'

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')

    // デバッグログを追加
    console.log('=== FORM DEBUG ===')
    console.log('Name:', name)
    console.log('Email:', email)
    console.log('Password:', password)
    console.log('Password Confirmation:', passwordConfirmation)
    console.log('==================')

    try {
      if (mode === 'signup') {
        if (!validateSignup()) return
        
        await signUp(name, email, password)
        setSuccess('アカウントが作成されました！')
        setTimeout(() => {
          navigate(from, { replace: true })
        }, 1000)
      } else {
        if (!validateSignin()) return
        
        await signIn(email, password)
        setSuccess('ログインしました！')
        setTimeout(() => {
          navigate(from, { replace: true })
        }, 1000)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'エラーが発生しました')
    } finally {
      setLoading(false)
    }
  }

  const validateSignup = () => {
    if (!name.trim()) {
      setError('名前を入力してください')
      return false
    }
    if (!email.trim()) {
      setError('メールアドレスを入力してください')
      return false
    }
    if (!password) {
      setError('パスワードを入力してください')
      return false
    }
    if (password.length < 8) {
      setError('パスワードは8文字以上で入力してください')
      return false
    }
    if (password !== passwordConfirmation) {
      setError('パスワードが一致しません')
      return false
    }
    return true
  }

  const validateSignin = () => {
    if (!email.trim()) {
      setError('メールアドレスを入力してください')
      return false
    }
    if (!password) {
      setError('パスワードを入力してください')
      return false
    }
    return true
  }

  const toggleMode = () => {
    setMode(mode === 'signin' ? 'signup' : 'signin')
    setError('')
    setSuccess('')
    setEmail('')
    setPassword('')
    setPasswordConfirmation('')
    setName('')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* ヘッダー */}
        <div className="text-center">
          <div className="flex justify-center">
            <div className="bg-blue-600 p-3 rounded-full">
              <Backpack className="h-8 w-8 text-white" />
            </div>
          </div>
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            {mode === 'signin' ? 'ログイン' : 'アカウント作成'}
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            {mode === 'signin' 
              ? 'アカウントにログインして旅の情報を共有しましょう' 
              : '新しいアカウントを作成して旅の情報を共有しましょう'
            }
          </p>
        </div>

        {/* フォーム */}
        <div className="bg-white py-8 px-6 shadow-xl rounded-lg">
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}
          
          {success && (
            <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-md">
              <p className="text-sm text-green-600">{success}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} autoComplete="off" className="space-y-6">
            {mode === 'signup' && (
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  名前
                </label>
                <div className="mt-1 relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    autoComplete="off"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="appearance-none relative block w-full pl-10 pr-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                    placeholder="お名前"
                  />
                </div>
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                メールアドレス
              </label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="off"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="appearance-none relative block w-full pl-10 pr-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                  placeholder="メールアドレス"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                パスワード
              </label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="off"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="appearance-none relative block w-full pl-10 pr-10 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                  placeholder="パスワード"
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>
            </div>

            {mode === 'signup' && (
              <div>
                <label htmlFor="passwordConfirmation" className="block text-sm font-medium text-gray-700">
                  パスワード確認
                </label>
                <div className="mt-1 relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="passwordConfirmation"
                    name="passwordConfirmation"
                    type={showPasswordConfirmation ? 'text' : 'password'}
                    autoComplete="off"
                    required
                    value={passwordConfirmation}
                    onChange={(e) => setPasswordConfirmation(e.target.value)}
                    className="appearance-none relative block w-full pl-10 pr-10 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                    placeholder="パスワード確認"
                  />
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                    <button
                      type="button"
                      onClick={() => setShowPasswordConfirmation(!showPasswordConfirmation)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      {showPasswordConfirmation ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                </div>
              </div>
            )}

            <div>
              <button
                type="submit"
                disabled={loading}
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    {mode === 'signin' ? 'ログイン中...' : '作成中...'}
                  </div>
                ) : (
                  <div className="flex items-center">
                    {mode === 'signin' ? 'ログイン' : 'アカウント作成'}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </div>
                )}
              </button>
            </div>

            <div className="text-center">
              <button
                type="button"
                onClick={toggleMode}
                className="text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors"
              >
                {mode === 'signin' 
                  ? 'アカウントをお持ちでない方はこちら' 
                  : 'すでにアカウントをお持ちの方はこちら'
                }
              </button>
            </div>
          </form>
        </div>

        {/* フッター */}
        <div className="text-center">
          <p className="text-xs text-gray-500">
            アカウントを作成することで、
            <Link to="/terms" className="text-blue-600 hover:text-blue-800">
              利用規約
            </Link>
            および
            <Link to="/privacy" className="text-blue-600 hover:text-blue-800">
              プライバシーポリシー
            </Link>
            に同意したものとみなされます。
          </p>
        </div>
      </div>
    </div>
  )
}
