import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import { ThemeProvider } from './contexts/ThemeContext';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import DashboardPage from './pages/DashboardPage';
import ProfilePage from './pages/ProfilePage';
import SettingsPage from './pages/SettingsPage';
import AppliedJobsPage from './pages/AppliedJobsPage';
import BrowseJobsPage from './pages/BrowseJobsPage';
import ExploreJobsPage from './pages/ExploreJobsPage';
import CreateCVPage from './pages/CreateCVPage';
import MyCVsPage from './pages/MyCVsPage';
import AboutPage from './pages/AboutPage';
import DashboardLayout from './layouts/DashboardLayout';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <ThemeProvider>
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardLayout>
                  <DashboardPage />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <DashboardLayout>
                  <ProfilePage />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/settings"
            element={
              <ProtectedRoute>
                <DashboardLayout>
                  <SettingsPage />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/applied-jobs"
            element={
              <ProtectedRoute>
                <DashboardLayout>
                  <AppliedJobsPage />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/view-jobs"
            element={
              <ProtectedRoute>
                <DashboardLayout>
                  <BrowseJobsPage />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/explore-jobs"
            element={
              <ProtectedRoute>
                <DashboardLayout>
                  <ExploreJobsPage />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/create-cv"
            element={
              <ProtectedRoute>
                <DashboardLayout>
                  <CreateCVPage />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/my-cvs"
            element={
              <ProtectedRoute>
                <DashboardLayout>
                  <MyCVsPage />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
          <Route path="/about" element={<AboutPage />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
