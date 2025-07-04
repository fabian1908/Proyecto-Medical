import { Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import AdminPage from './pages/AdminPage';
import HomePage from './pages/HomePage';
import ChatbotPage from './pages/ChatbotPage';
import AboutPage from './pages/AboutPage';
import DoctorSignUpPage from './pages/DoctorSignUpPage';
import DoctorDashboardPage from './pages/DoctorDashboardPage';
import ProfilePage from './pages/ProfilePage';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        {/* Rutas Públicas */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/doctor-signup" element={<DoctorSignUpPage />} />

        {/* Rutas Protegidas */}
        <Route path="/" element={<ProtectedRoute><HomePage /></ProtectedRoute>} />
        <Route path="/chatbot" element={<ProtectedRoute><ChatbotPage /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />

        {/* Rutas de Admin */}
        <Route path="/admin" element={<ProtectedRoute allowedRoles={['admin']}><AdminPage /></ProtectedRoute>} />
        
        {/* Rutas de Doctor */}
        <Route path="/doctor/dashboard" element={<ProtectedRoute allowedRoles={['doctor']}><DoctorDashboardPage /></ProtectedRoute>} />

      </Routes>
    </>
  );
}

export default App;
