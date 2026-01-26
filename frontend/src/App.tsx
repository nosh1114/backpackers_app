import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import { HomePage } from './pages/HomePage'
import { AuthPage } from './pages/AuthPage'
import ProfilePage from './pages/ProfilePage'
import PasswordResetPage from './pages/PasswordResetPage'
import { ConfirmEmailPage } from './pages/ConfirmEmailPage'
import { ProtectedRoute } from './components/ProtectedRoute'
import './index.css'
import { Layout } from './components/Layout/Layout'
import { CountryPage } from './pages/CountryPage'
import TestField from './components/TestField'
import UserList from './components/UserList'
import CreateUser from './components/CreateUser'
import { PostsPage } from './pages/PostsPage'
import { CreatePostPage } from './pages/CreatePostPage'
import { PostEditPage } from './pages/PostEditPage'
import { UserPage } from './pages/UserPage'
import { BappaNaviPage } from './pages/BappaNaviPage'
import { SearchPage } from './pages/SearchPage'
import { PostDetailPage } from './pages/PostDetailPage'
import { ScrollToTop } from './components/ScrollToTop'
import { CountriesPage } from './pages/CountriesPage'
import { CategoryPage } from './pages/CategoryPage'
import { AdminPage } from './pages/AdminPage'
import { AdminPostEditPage } from './pages/AdminPostEditPage'
import { AdminUserEditPage } from './pages/AdminUserEditPage'
import { AboutPage } from './pages/AboutPage'
import { ContactPage } from './pages/ContactPage'
import { PrivacyPage } from './pages/PrivacyPage'
import { TermsPage } from './pages/TermsPage'
import { GuidelinesPage } from './pages/GuidelinesPage'
import { NotFoundPage } from './pages/NotFoundPage'

function App() {
  return (
    <AuthProvider>
      <Router>
        <ScrollToTop />
        <Routes>
          <Route path="/" element={
            <Layout>
              <HomePage />
            </Layout>
          } />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/password-reset" element={<PasswordResetPage />} />
          <Route path="/confirm-email" element={<ConfirmEmailPage />} />
          <Route path="/posts" element={
            <Layout>
              <PostsPage />
            </Layout>
          } />
          <Route path="/featured" element={
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
          <Route path="/countries" element={
            <Layout>
              <CountriesPage />
            </Layout>
          } />
          <Route path="/category/:categoryId" element={
            <Layout>
              <CategoryPage />
            </Layout>
          } />
          <Route path="/admin" element={
            <ProtectedRoute>
              <Layout>
                <AdminPage />
              </Layout>
            </ProtectedRoute>
          } />
          <Route path="/admin/posts/:id/edit" element={
            <ProtectedRoute>
              <Layout>
                <AdminPostEditPage />
              </Layout>
            </ProtectedRoute>
          } />
          <Route path="/admin/users/:id/edit" element={
            <ProtectedRoute>
              <Layout>
                <AdminUserEditPage />
              </Layout>
            </ProtectedRoute>
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
          <Route path="/posts/:postId" element={
            <Layout>
              <PostDetailPage />
            </Layout>
          } />
          <Route path="/posts/:postId/edit" element={
            <ProtectedRoute>
              <Layout>
                <PostEditPage />
              </Layout>
            </ProtectedRoute>
          } />
          <Route path="/about" element={
            <Layout>
              <AboutPage />
            </Layout>
          } />
          <Route path="/contact" element={
            <Layout>
              <ContactPage />
            </Layout>
          } />
          <Route path="/privacy" element={
            <Layout>
              <PrivacyPage />
            </Layout>
          } />
          <Route path="/terms" element={
            <Layout>
              <TermsPage />
            </Layout>
          } />
          <Route path="/guidelines" element={
            <Layout>
              <GuidelinesPage />
            </Layout>
          } />
          {/* 404ページ - すべての未定義のルートにマッチ */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Router>
    </AuthProvider>
  )
}

export default App
