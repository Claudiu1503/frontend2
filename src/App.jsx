import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { CookiesProvider } from 'react-cookie';
import { AuthProvider } from './contexts/AuthContext';
import UserType from './utils/userTypes';

// Components
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import Login from './pages/Login';

// Employee Pages
import EmployeeDashboard from './pages/employee/Dashboard';

// Manager Pages
import ManagerDashboard from './pages/manager/Dashboard';
import ManagerMovieList from './pages/manager/MovieList';

// Movie Pages
import MovieList from './pages/movies/MovieList';
import MovieForm from './pages/movies/MovieForm';
import MovieDetails from './pages/movies/MovieDetails';
import ExportMovies from './pages/movies/ExportMovies';
import MovieStats from './pages/movies/MovieStats';

// Member Pages
import MemberList from './pages/members/MemberList';
import MemberForm from './pages/members/MemberForm';
import MemberDetails from './pages/members/MemberDetails';

// Styles
import './App.css';

function App() {
  return (
    <CookiesProvider>
      <AuthProvider>
        <Router>
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<Navigate to="/login" replace />} />

            {/* Protected Routes */}
            <Route element={<Layout />}>
              {/* Employee Routes */}
              <Route element={<ProtectedRoute allowedRoles={[UserType.EMPLOYEE, UserType.ADMIN]} />}>
                <Route path="/employee" element={<EmployeeDashboard />} />
                <Route path="/movies" element={<MovieList />} />
                <Route path="/movies/new" element={<MovieForm />} />
                <Route path="/movies/edit/:id" element={<MovieForm />} />
              </Route>

              {/* Common Routes (accessible by all authenticated users) */}
              <Route element={<ProtectedRoute allowedRoles={[UserType.EMPLOYEE, UserType.MANAGER, UserType.ADMIN]} />}>
                <Route path="/movies/view/:id" element={<MovieDetails />} />
                <Route path="/movies/export" element={<ExportMovies />} />
              </Route>

              {/* Manager Routes */}
              <Route element={<ProtectedRoute allowedRoles={[UserType.MANAGER]} />}>
                <Route path="/manager" element={<ManagerDashboard />} />
                <Route path="/manager/movies" element={<ManagerMovieList />} />
                <Route path="/manager/stats" element={<MovieStats />} />
                {/* Member Management Routes */}
                <Route path="/members" element={<MemberList />} />
                <Route path="/members/new" element={<MemberForm />} />
                <Route path="/members/edit/:id" element={<MemberForm />} />
                <Route path="/members/view/:id" element={<MemberDetails />} />
              </Route>

              {/* Admin Routes */}
              <Route element={<ProtectedRoute allowedRoles={[UserType.ADMIN]} />}>
                <Route path="/admin" element={<Navigate to="/employee" replace />} />
                {/* Add admin-specific routes here */}
              </Route>
            </Route>

            {/* Catch-all route */}
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </Router>
      </AuthProvider>
    </CookiesProvider>
  );
}

export default App;
