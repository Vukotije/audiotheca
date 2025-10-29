import { Route, Routes, Navigate } from 'react-router-dom'
import { Layout } from './components/Layout'
import { LoginPage } from './pages/auth/LoginPage'
import { RegisterPage } from './pages/auth/RegisterPage'
import { WorksListPage } from './pages/works/WorksListPage'
import { WorkDetailsPage } from './pages/works/WorkDetailsPage'
import { GenresPage } from './pages/genres/GenresPage'
import { ArtistsPage } from './pages/artists/ArtistsPage'
import { ArtistDetailsPage } from './pages/artists/ArtistDetailsPage'
import { WorksCrudPage } from './pages/works/WorksCrudPage'
import { ReviewsPage } from './pages/reviews/ReviewsPage'
import { PendingReviewsPage } from './pages/reviews/PendingReviewsPage'
import { AdminUsersPage } from './pages/admin/AdminUsersPage'
import { SearchPage } from './pages/search/SearchPage'
import { ProtectedRoute } from './components/ProtectedRoute'
import { RoleGuard } from './components/RoleGuard'
import { ProfilePage } from './pages/profile/ProfilePage'

export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Navigate to="/works" replace />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/search" element={<SearchPage />} />

        <Route path="/works" element={<WorksListPage />} />
        <Route path="/works/:id" element={<WorkDetailsPage />} />
        <Route path="/artists/:id" element={<ArtistDetailsPage />} />

        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/reviews"
          element={
            <ProtectedRoute>
              <ReviewsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/reviews/pending"
          element={
            <RoleGuard allowed={["editor"]}>
              <PendingReviewsPage />
            </RoleGuard>
          }
        />

        <Route
          path="/manage/genres"
          element={
            <RoleGuard allowed={["editor"]}>
              <GenresPage />
            </RoleGuard>
          }
        />
        <Route
          path="/manage/artists"
          element={
            <RoleGuard allowed={["editor"]}>
              <ArtistsPage />
            </RoleGuard>
          }
        />
        <Route
          path="/manage/works"
          element={
            <RoleGuard allowed={["editor"]}>
              <WorksCrudPage />
            </RoleGuard>
          }
        />

        <Route
          path="/admin/users"
          element={
            <RoleGuard allowed={["admin"]}>
              <AdminUsersPage />
            </RoleGuard>
          }
        />

        <Route path="*" element={<div style={{ padding: 24 }}>Not Found</div>} />
      </Routes>
    </Layout>
  )
}

