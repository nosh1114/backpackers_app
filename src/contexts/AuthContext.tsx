import React, { createContext, useContext, useEffect, useState } from 'react'

interface User {
  id: string
  email: string
  username: string
}

interface AuthContextType {
  user: User | null
  session: any | null
  signUp: (email: string, password: string, username: string) => Promise<void>
  signIn: (email: string, password: string) => Promise<void>
  signOut: () => Promise<void>
  loading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// モックユーザー
const mockUser: User = {
  id: 'user1',
  email: 'test@example.com',
  username: '旅人太郎'
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<any | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    // ローカルストレージから認証状態を復元
    const savedUser = localStorage.getItem('mockUser')
    if (savedUser) {
      const userData = JSON.parse(savedUser)
      setUser(userData)
      setSession({ user: userData })
    }
    setLoading(false)
  }, [])

  const signUp = async (email: string, password: string, username: string) => {
    setLoading(true)
    
    // モック実装：簡単なバリデーション
    if (!email || !password || !username) {
      throw new Error('すべての項目を入力してください')
    }
    
    if (password.length < 6) {
      throw new Error('パスワードは6文字以上で入力してください')
    }

    // モックユーザー作成
    const newUser: User = {
      id: `user_${Date.now()}`,
      email,
      username
    }

    setUser(newUser)
    setSession({ user: newUser })
    localStorage.setItem('mockUser', JSON.stringify(newUser))
    setLoading(false)
  }

  const signIn = async (email: string, password: string) => {
    setLoading(true)
    
    // モック実装：固定の認証情報でログイン
    if (email === 'test@example.com' && password === 'password') {
      setUser(mockUser)
      setSession({ user: mockUser })
      localStorage.setItem('mockUser', JSON.stringify(mockUser))
    } else {
      throw new Error('メールアドレスまたはパスワードが間違っています')
    }
    
    setLoading(false)
  }

  const signOut = async () => {
    setUser(null)
    setSession(null)
    localStorage.removeItem('mockUser')
  }

  const value = {
    user,
    session,
    signUp,
    signIn,
    signOut,
    loading,
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