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
import CreateCVPage from './pages/CreateCVPage';
import MyCVsPage from './pages/MyCVsPage';
import AboutPage from './pages/AboutPage';
import DashboardLayout from './layouts/DashboardLayout';

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
              <DashboardLayout>
                <DashboardPage />
              </DashboardLayout>
            }
          />
          <Route
            path="/profile"
            element={
              <DashboardLayout>
                <ProfilePage />
              </DashboardLayout>
            }
          />
          <Route
            path="/settings"
            element={
              <DashboardLayout>
                <SettingsPage />
              </DashboardLayout>
            }
          />
          <Route
            path="/applied-jobs"
            element={
              <DashboardLayout>
                <AppliedJobsPage />
              </DashboardLayout>
            }
          />
          <Route
            path="/view-jobs"
            element={
              <DashboardLayout>
                <BrowseJobsPage />
              </DashboardLayout>
            }
          />
          <Route
            path="/create-cv"
            element={
              <DashboardLayout>
                <CreateCVPage />
              </DashboardLayout>
            }
          />
          <Route
            path="/my-cvs"
            element={
              <DashboardLayout>
                <MyCVsPage />
              </DashboardLayout>
            }
          />
          <Route path="/about" element={<AboutPage />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
