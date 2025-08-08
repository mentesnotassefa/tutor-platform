import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Layout Components
import Header from './components/common/Header';
import Footer from './components/common/Footer';
import ProtectedRoute from './routes/ProtectedRoute';

// Page Components
import Home from './pages/Home';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import TutorList from './pages/student/TutorList';
import TutorProfile from './pages/student/TutorProfile';
import TutorDashboard from './pages/tutor/Dashboard';
// import Dashboard from './pages/student/Dashboard';
import CompleteProfile from './pages/tutor/CompleteProfile';
import AdminDashboard from './pages/admin/Dashboard';
import VerifyTutors from './pages/admin/VerifyTutors';
import NotFound from './pages/NotFound';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="flex flex-col min-h-screen">
          <Header />
          
          <main className="flex-grow container mx-auto px-4 py-8">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/tutors" element={<TutorList />} />
              <Route path="/tutors/:id" element={<TutorProfile />} />

              {/* Student Routes */}
              <Route element={<ProtectedRoute allowedRoles={['student']} />}>
                <Route path="pages/student/Dashboard" element={<Dashboard />} />
              </Route>

              {/* Tutor Routes */}
              <Route element={<ProtectedRoute allowedRoles={['tutor']} />}>
                <Route path="/tutor/dashboard" element={<TutorDashboard />} />
                <Route path="/tutor/profile" element={<CompleteProfile />} />
              </Route>

              {/* Admin Routes */}
              <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
                <Route path="/admin/dashboard" element={<AdminDashboard />} />
                <Route path="/admin/verify-tutors" element={<VerifyTutors />} />
              </Route>

              {/* 404 Not Found */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>

          <Footer />
          <ToastContainer 
            position="bottom-right"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
          />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;