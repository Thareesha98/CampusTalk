import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Navbar from './components/Navbar.jsx'
import Footer from './components/Footer.jsx'
import Home from './pages/Home.jsx'
import Login from './pages/auth/Login.jsx'
import Register from './pages/auth/Register.jsx'
import PostsList from './pages/posts/PostsList.jsx'
import PostDetail from './pages/posts/PostDetail.jsx'
import CreatePost from './pages/posts/CreatePost.jsx'
import ClubsList from './pages/clubs/ClubsList.jsx'
import ClubDetail from './pages/clubs/ClubDetail.jsx'
import EventsList from './pages/events/EventsList.jsx'
import EventDetail from './pages/events/EventDetail.jsx'
import Profile from './pages/profile/Profile.jsx'
import AdminDashboard from './pages/admin/AdminDashboard.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'

export default function App(){
  return (
    <div className="app-root">
      <Navbar />
      <main className="container">
        <Routes>
          <Route path="/" element={<Home />} />

          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route path="/posts" element={<PostsList />} />
          <Route path="/posts/new" element={<ProtectedRoute><CreatePost /></ProtectedRoute>} />
          <Route path="/posts/:id" element={<PostDetail />} />

          <Route path="/clubs" element={<ClubsList />} />
          <Route path="/clubs/:id" element={<ClubDetail />} />

          <Route path="/events" element={<EventsList />} />
          <Route path="/events/:id" element={<EventDetail />} />

          <Route path="/profile/:id" element={<ProtectedRoute><Profile /></ProtectedRoute>} />

          <Route path="/admin/*" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}
