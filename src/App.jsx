import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
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

// Cast Pages
import CastList from './pages/casts/CastList';
import CastForm from './pages/casts/CastForm';
import CastDetails from './pages/casts/CastDetails';

// Admin Pages
import AdminDashboard from './pages/admin/Dashboard';
import UserList from './pages/admin/UserList';
import UserForm from './pages/admin/UserForm';
import UserDetails from './pages/admin/UserDetails';

// Styles
import './App.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Navigate to="/login" replace />} />

          {/* Protected Routes */}
          <Route element={<Layout />}>
            {/* Employee Routes */}
            <Route element={<ProtectedRoute allowedRoles={[UserType.EMPLOYEE]} />}>
              <Route path="/employee" element={<EmployeeDashboard />} />
              <Route path="/movies" element={<MovieList />} />
              <Route path="/movies/new" element={<MovieForm />} />
              <Route path="/movies/edit/:id" element={<MovieForm />} />
              {/* Cast routes with CRUD access */}
              <Route path="/casts/new" element={<CastForm />} />
              <Route path="/casts/edit/:id" element={<CastForm />} />
            </Route>

            {/* Common Routes (accessible by employees and managers) */}
            <Route element={<ProtectedRoute allowedRoles={[UserType.EMPLOYEE, UserType.MANAGER]} />}>
              <Route path="/movies/view/:id" element={<MovieDetails />} />
              <Route path="/movies/export" element={<ExportMovies />} />
              {/* Cast routes with read-only access */}
              <Route path="/casts" element={<CastList />} />
              <Route path="/casts/view/:id" element={<CastDetails />} />
            </Route>

            {/* Redirect /movies/stats to appropriate page based on user role */}
            <Route path="/movies/stats" element={<Navigate to="/manager/stats" replace />} />

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
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/admin/users" element={<UserList />} />
              <Route path="/admin/users/new" element={<UserForm />} />
              <Route path="/admin/users/edit/:id" element={<UserForm />} />
              <Route path="/admin/users/view/:id" element={<UserDetails />} />
            </Route>
          </Route>

          {/* Catch-all route */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
