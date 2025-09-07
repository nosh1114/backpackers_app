import React, { useState } from 'react'
import { useMutation } from '@apollo/client'
import { useSearchParams, Link } from 'react-router-dom'
import { REQUEST_PASSWORD_RESET, RESET_PASSWORD } from '../graphql/mutations'
import { Mail, Lock, Eye, EyeOff, ArrowLeft } from 'lucide-react'

const PasswordResetPage: React.FC = () => {
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token')
  
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [passwordConfirmation, setPasswordConfirmation] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showPasswordConfirmation, setShowPasswordConfirmation] = useState(false)
  const [message, setMessage] = useState('')
  const [isSuccess, setIsSuccess] = useState(false)

  const [requestReset, { loading: requestLoading }] = useMutation(REQUEST_PASSWORD_RESET, {
    onCompleted: (data) => {
      if (data.requestPasswordReset.success) {
        setMessage(data.requestPasswordReset.message)
        setIsSuccess(true)
      } else {
        setMessage(data.requestPasswordReset.message)
        setIsSuccess(false)
      }
    },
    onError: () => {
      setMessage('エラーが発生しました。もう一度お試しください。')
      setIsSuccess(false)
    }
  })

  const [resetPassword, { loading: resetLoading }] = useMutation(RESET_PASSWORD, {
    onCompleted: (data) => {
      if (data.resetPassword.success) {
        setMessage(data.resetPassword.message)
        setIsSuccess(true)
      } else {
        setMessage(data.resetPassword.message)
        setIsSuccess(false)
      }
    },
    onError: () => {
      setMessage('エラーが発生しました。もう一度お試しください。')
      setIsSuccess(false)
    }
  })

  const handleRequestReset = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) {
      setMessage('メールアドレスを入力してください')
      setIsSuccess(false)
      return
    }
    
    await requestReset({ variables: { email } })
  }

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!password || !passwordConfirmation) {
      setMessage('すべての項目を入力してください')
      setIsSuccess(false)
      return
    }
    
    if (password !== passwordConfirmation) {
      setMessage('パスワードが一致しません')
      setIsSuccess(false)
      return
    }
    
    if (password.length < 8) {
      setMessage('パスワードは8文字以上で入力してください')
      setIsSuccess(false)
      return
    }
    
    await resetPassword({ 
      variables: { 
        token, 
        password, 
        passwordConfirmation 
      } 
    })
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <Lock className="h-12 w-12 text-primary-600" />
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          {token ? 'パスワードをリセット' : 'パスワードリセット'}
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          {token ? '新しいパスワードを設定してください' : 'メールアドレスを入力してください'}
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <Link
            to="/auth"
            className="inline-flex items-center text-sm text-primary-600 hover:text-primary-500 mb-6"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            ログイン画面に戻る
          </Link>

          {message && (
            <div className={`mb-4 p-3 rounded-lg ${
              isSuccess 
                ? 'bg-green-50 border border-green-200 text-green-700' 
                : 'bg-red-50 border border-red-200 text-red-700'
            }`}>
              {message}
            </div>
          )}

          {!token ? (
            // パスワードリセット要求フォーム
            <form onSubmit={handleRequestReset} className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  メールアドレス
                </label>
                <div className="mt-1 relative">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                    placeholder="example@email.com"
                  />
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={requestLoading}
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50"
                >
                  {requestLoading ? '送信中...' : 'リセットメールを送信'}
                </button>
              </div>
            </form>
          ) : (
            // パスワードリセット実行フォーム
            <form onSubmit={handleResetPassword} className="space-y-6">
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  新しいパスワード
                </label>
                <div className="mt-1 relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="new-password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                    placeholder="8文字以上で入力"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-400" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400" />
                    )}
                  </button>
                </div>
              </div>

              <div>
                <label htmlFor="passwordConfirmation" className="block text-sm font-medium text-gray-700">
                  パスワード確認
                </label>
                <div className="mt-1 relative">
                  <input
                    id="passwordConfirmation"
                    name="passwordConfirmation"
                    type={showPasswordConfirmation ? 'text' : 'password'}
                    autoComplete="new-password"
                    required
                    value={passwordConfirmation}
                    onChange={(e) => setPasswordConfirmation(e.target.value)}
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                    placeholder="パスワードを再入力"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowPasswordConfirmation(!showPasswordConfirmation)}
                  >
                    {showPasswordConfirmation ? (
                      <EyeOff className="h-5 w-5 text-gray-400" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400" />
                    )}
                  </button>
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={resetLoading}
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50"
                >
                  {resetLoading ? '更新中...' : 'パスワードを更新'}
                </button>
              </div>
            </form>
          )}

          {isSuccess && !token && (
            <div className="mt-4 text-center">
              <p className="text-sm text-gray-600">
                メールを確認して、リンクをクリックしてください。
              </p>
            </div>
          )}

          {isSuccess && token && (
            <div className="mt-4 text-center">
              <Link
                to="/auth"
                className="text-primary-600 hover:text-primary-500 text-sm font-medium"
              >
                ログイン画面に戻る
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default PasswordResetPage 