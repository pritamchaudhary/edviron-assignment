import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import useAuth from './hooks/useAuth';
import { Toaster } from 'react-hot-toast';
import Sidebar from './components/layout/Sidebar';
import Header from './components/layout/Header';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegistePage';
import Dashboard from './pages/Dashboard';
import NotFound from './pages/NotFound';
import PaymentSuccess from './pages/PaymentSuccess';

// ... (ProtectedRoute and AppLayout components remain the same) ...
function ProtectedRoute({ children }) {
  const { token, loading } = useAuth();
  if (loading) {
    return <div>Loading...</div>; // Or a spinner component
  }
  return token ? children : <LoginPage />;
}

function AppLayout({ children }) {
  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-200">
          <div className="container mx-auto px-6 py-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}


function App() {
  return (
    <Router>
      <AuthProvider>
        <Toaster position="top-center" reverseOrder={false} />
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} /> {/* <-- ADD THIS ROUTE */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <AppLayout>
                  <Dashboard />
                </AppLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/payment-success"
            element={
              <ProtectedRoute>
                <AppLayout>
                  <PaymentSuccess />
                </AppLayout>
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;