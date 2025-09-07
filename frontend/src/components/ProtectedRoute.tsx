import React from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

interface ProtectedRouteProps {
  children: React.ReactNode
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated, loading } = useAuth()
  const location = useLocation()

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-600 via-primary-700 to-secondary-600 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-t-2 border-b-2 border-white rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white">読み込み中...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    // ログイン後に元のページにリダイレクトするため、現在のパスを保存
    return <Navigate to="/auth" state={{ from: location }} replace />
  }

  return <>{children}</>
} 