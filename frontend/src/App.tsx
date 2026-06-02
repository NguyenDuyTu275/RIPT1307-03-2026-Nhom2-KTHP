import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { WishlistProvider } from './context/WishlistContext';

// ── Auth Pages
import LoginPage from './pages/LoginPage';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';

// ── Core Flow
import HomePage from './pages/HomePage';
import SearchResults from './pages/SearchResults';
import HotelDetailPage from './pages/HotelDetailPage';
import HotelReviewAndChatPage from './pages/HotelReviewAndChatPage';
import GuestInfoPage from './pages/GuestInfoPage';
import BookingConfirmation from './pages/BookingConfirmation';

// ── Account
import MyBookingsPage from './pages/MyBookingsPage';
import Profile from './pages/Profile';

// ── UX Extras
import Wishlist from './pages/Wishlist';
import Deals from './pages/Deals';

// ── Admin
import AdminDashboard from './pages/AdminDashboard';

import './App.css';

function App() {
  return (
    <WishlistProvider>
      <Router>
        <Routes>
          {/* ── Root redirect */}
          <Route path="/" element={<HomePage />} />

          {/* ── Auth */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />

          {/* ── Core Search & Hotel Flow */}
          <Route path="/search" element={<SearchResults />} />
          <Route path="/hotels/:id" element={<HotelDetailPage />} />
          <Route path="/hotels/:id/reviews" element={<HotelReviewAndChatPage />} />
          <Route path="/booking/:hotelId/guest" element={<GuestInfoPage />} />
          <Route path="/booking/confirmation" element={<BookingConfirmation />} />

          {/* ── Account */}
          <Route path="/my-bookings" element={<MyBookingsPage />} />
          <Route path="/profile" element={<Profile />} />

          {/* ── UX Extras */}
          <Route path="/wishlist" element={<Wishlist />} />
          <Route path="/deals" element={<Deals />} />

          {/* ── Admin */}
          <Route path="/admin" element={<AdminDashboard />} />

          {/* ── Fallback */}
          <Route path="/dashboard" element={<Navigate to="/" replace />} />
          <Route path="/welcome" element={<Navigate to="/" replace />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </WishlistProvider>
  );
}

export default App;
