import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import { HomePage } from './pages/HomePage'
import { AuthPage } from './pages/AuthPage'
import ProfilePage from './pages/ProfilePage'
import PasswordResetPage from './pages/PasswordResetPage'
import { ProtectedRoute } from './components/ProtectedRoute'
import './index.css'
import { Layout } from './components/Layout/Layout'
import { CountryPage } from './pages/CountryPage'
import TestField from './components/TestField'
import UserList from './components/UserList'
import CreateUser from './components/CreateUser'
import { PostsPage } from './pages/PostsPage'
import { CreatePostPage } from './pages/CreatePostPage'
import { UserPage } from './pages/UserPage'
import { BappaNaviPage } from './pages/BappaNaviPage'
import { SearchPage } from './pages/SearchPage'
import { PostDetailPage } from './pages/PostDetailPage'

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={
            <Layout>
              <HomePage />
            </Layout>
          } />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/password-reset" element={<PasswordResetPage />} />
          <Route path="/posts" element={
            <Layout>
              <PostsPage />
            </Layout>
          } />
          <Route path="/create-post" element={
            <ProtectedRoute>
              <Layout>
                <CreatePostPage />
              </Layout>
            </ProtectedRoute>
          } />
          <Route path="/country/:country" element={
            <Layout>
              <CountryPage />
            </Layout>
          } />
          <Route path="/user/:userId" element={
            <Layout>
              <UserPage />
            </Layout>
          } />
          <Route path="/graphql-test" element={
            <ProtectedRoute>
              <Layout>
                <TestField />
              </Layout>
            </ProtectedRoute>
          } />
          <Route path="/users" element={
            <ProtectedRoute>
              <Layout>
                <UserList />
              </Layout>
            </ProtectedRoute>
          } />
          <Route path="/create-user" element={
            <ProtectedRoute>
              <Layout>
                <CreateUser />
              </Layout>
            </ProtectedRoute>
          } />
          <Route 
            path="/profile" 
            element={
              <ProtectedRoute>
                <Layout>
                  <ProfilePage />
                </Layout>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/bappanavi" 
            element={
              <BappaNaviPage />
            } 
          />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/posts/:postId" element={<PostDetailPage />} />
        </Routes>
      </Router>
    </AuthProvider>
  )
}

export default App
