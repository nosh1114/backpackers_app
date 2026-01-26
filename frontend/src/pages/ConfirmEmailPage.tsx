import React, { useState, useEffect } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { CheckCircle, XCircle, Loader2, Mail, ArrowRight } from 'lucide-react'
import { apiClient } from '../lib/api'

export function ConfirmEmailPage() {
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token')
  
  const [status, setStatus] = useState<'loading' | 'success' | 'error' | 'no-token'>('loading')
  const [message, setMessage] = useState('')
  const [email, setEmail] = useState('')
  const [resendLoading, setResendLoading] = useState(false)
  const [resendMessage, setResendMessage] = useState('')

  useEffect(() => {
    if (!token) {
      setStatus('no-token')
      return
    }

    confirmEmail()
  }, [token])

  const confirmEmail = async () => {
    if (!token) return

    try {
      const response = await apiClient.confirmEmail(token)
      if (response.data) {
        setStatus('success')
        setMessage(response.data.message)
      } else {
        setStatus('error')
        setMessage(response.error || 'メールアドレスの確認に失敗しました')
      }
    } catch (error) {
      setStatus('error')
      setMessage('エラーが発生しました。もう一度お試しください。')
    }
  }

  const handleResendConfirmation = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) {
      setResendMessage('メールアドレスを入力してください')
      return
    }

    setResendLoading(true)
    setResendMessage('')

    try {
      const response = await apiClient.resendConfirmation(email)
      if (response.data) {
        setResendMessage(response.data.message)
      } else {
        setResendMessage(response.error || 'エラーが発生しました')
      }
    } catch (error) {
      setResendMessage('エラーが発生しました。もう一度お試しください。')
    } finally {
      setResendLoading(false)
    }
  }

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">メールアドレスを確認中...</p>
        </div>
      </div>
    )
  }

  if (status === 'success') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8 text-center">
          <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            メール確認完了！
          </h1>
          <p className="text-gray-600 mb-6">{message}</p>
          <Link
            to="/auth"
            className="inline-flex items-center justify-center w-full py-3 px-4 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
          >
            ログインする
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </div>
      </div>
    )
  }

  if (status === 'error') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8">
          <div className="text-center mb-6">
            <XCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              確認に失敗しました
            </h1>
            <p className="text-gray-600">{message}</p>
          </div>

          <div className="border-t border-gray-200 pt-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">
              確認メールを再送する
            </h2>
            <form onSubmit={handleResendConfirmation} className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  メールアドレス
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="example@email.com"
                />
              </div>
              <button
                type="submit"
                disabled={resendLoading}
                className="w-full py-2 px-4 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {resendLoading ? (
                  <span className="flex items-center justify-center">
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    送信中...
                  </span>
                ) : (
                  '確認メールを再送'
                )}
              </button>
              {resendMessage && (
                <p className={`text-sm text-center ${resendMessage.includes('エラー') ? 'text-red-600' : 'text-green-600'}`}>
                  {resendMessage}
                </p>
              )}
            </form>
          </div>

          <div className="mt-6 text-center">
            <Link to="/auth" className="text-blue-600 hover:text-blue-800 text-sm font-medium">
              ログイン画面に戻る
            </Link>
          </div>
        </div>
      </div>
    )
  }

  // no-token
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8">
        <div className="text-center mb-6">
          <Mail className="h-16 w-16 text-blue-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            メール確認が必要です
          </h1>
          <p className="text-gray-600">
            登録時に送信された確認メールのリンクをクリックしてください。
          </p>
        </div>

        <div className="border-t border-gray-200 pt-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">
            確認メールを再送する
          </h2>
          <form onSubmit={handleResendConfirmation} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                メールアドレス
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="example@email.com"
              />
            </div>
            <button
              type="submit"
              disabled={resendLoading}
              className="w-full py-2 px-4 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {resendLoading ? (
                <span className="flex items-center justify-center">
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  送信中...
                </span>
              ) : (
                '確認メールを再送'
              )}
            </button>
            {resendMessage && (
              <p className={`text-sm text-center ${resendMessage.includes('エラー') ? 'text-red-600' : 'text-green-600'}`}>
                {resendMessage}
              </p>
            )}
          </form>
        </div>

        <div className="mt-6 text-center">
          <Link to="/auth" className="text-blue-600 hover:text-blue-800 text-sm font-medium">
            ログイン画面に戻る
          </Link>
        </div>
      </div>
    </div>
  )
}


