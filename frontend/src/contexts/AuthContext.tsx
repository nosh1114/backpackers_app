import React, { createContext, useContext, useEffect, useState } from 'react'
import { apiClient } from '../lib/api'

interface User {
  id: string
  email: string
  name: string
  bio?: string
  location?: string
  website?: string
  avatar_url?: string
}

interface AuthContextType {
  user: User | null
  token: string | null
  signUp: (email: string, password: string, name: string) => Promise<void>
  signIn: (email: string, password: string) => Promise<void>
  signOut: () => Promise<void>
  setToken: (token: string) => void
  refreshUser: () => void
  loading: boolean
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [token, setTokenState] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // ローカルストレージからトークンを復元
    const savedToken = localStorage.getItem('token')
    if (savedToken) {
      setTokenState(savedToken)
      apiClient.setToken(savedToken)
      // トークンがある場合、ユーザー情報を取得
      fetchCurrentUser()
    } else {
      setLoading(false)
    }
  }, [])

  const fetchCurrentUser = async () => {
    try {
      const response = await apiClient.getCurrentUser()
      if (response.data) {
        setUser(response.data.user)
      } else {
        // トークンが無効な場合、ログアウト
        signOut()
      }
    } catch (error) {
      console.error('ユーザー情報の取得に失敗しました:', error)
      signOut()
    } finally {
      setLoading(false)
    }
  }

  const signUp = async (email: string, password: string, name: string) => {
    setLoading(true)
    
    try {
      // バリデーション
      if (!email || !password || !name) {
        throw new Error('すべての項目を入力してください')
      }
      
      if (password.length < 8) {
        throw new Error('パスワードは8文字以上で入力してください')
      }

      const response = await apiClient.signup({
        name,
        email,
        password,
        password_confirmation: password
      })

      if (response.data) {
        setToken(response.data.token)
        setUser(response.data.user)
      } else {
        throw new Error(response.error || 'サインアップに失敗しました')
      }
    } catch (error) {
      throw error
    } finally {
      setLoading(false)
    }
  }

  const signIn = async (email: string, password: string) => {
    setLoading(true)
    
    try {
      // バリデーション
      if (!email || !password) {
        throw new Error('メールアドレスとパスワードを入力してください')
      }

      const response = await apiClient.login(email, password)

      if (response.data) {
        setToken(response.data.token)
        setUser(response.data.user)
      } else {
        throw new Error(response.error || 'ログインに失敗しました')
      }
    } catch (error) {
      throw error
    } finally {
      setLoading(false)
    }
  }

  const signOut = async () => {
    setUser(null)
    setTokenState(null)
    apiClient.clearToken()
    localStorage.removeItem('token')
    sessionStorage.clear()
  }

  const setToken = (newToken: string) => {
    setTokenState(newToken)
    apiClient.setToken(newToken)
    // トークン設定後にユーザー情報を再取得
    fetchCurrentUser()
  }

  const refreshUser = () => {
    if (token) {
      fetchCurrentUser()
    }
  }

  const value = {
    user,
    token,
    signUp,
    signIn,
    signOut,
    setToken,
    refreshUser,
    loading,
    isAuthenticated: !!token && !!user,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
