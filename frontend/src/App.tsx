import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import AuthProvider from './context/AuthProvider';
import ProtectedRoute from './routes/ProtectedRoute'; 

import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import CreatorDashboard from './pages/CreatorDashboard';
import Contact from './pages/Contact';
import CreatorLogin from './pages/CreatorLogin';

function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <BrowserRouter>
          <div className="min-h-screen flex flex-col bg-background">
            <Navbar />
            
            <main className="flex-grow">
              <Routes>
                {/* Public Route */}
                <Route path="/" element={<Home />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/creator-login" element={<CreatorLogin />} />

                {/* Protected Route - Only creators can see this */}
                <Route path="/dashboard" element={
                  <ProtectedRoute>
                    <CreatorDashboard />
                  </ProtectedRoute>
                } />
              </Routes>
            </main>

            <Footer />
          </div>
        </BrowserRouter>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;