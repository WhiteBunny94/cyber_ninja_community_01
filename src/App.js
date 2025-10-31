import AuthOutlet from '@auth-kit/react-router';
import './App.css';
import HomePage from './pages/HomePage';
import Leaderboard from './pages/Leaderboard';
import Login from './pages/Login';
import Profile from './pages/Profile';
import Quests from './pages/Quests';
import Register from './pages/Register';
import Resources from './pages/Resources';
import { Navigate, Route, Routes } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import AdminResources from './pages/AdminResources';
import Account from './pages/Account';
import ReadResource from './pages/ReadResources';

function PrivateRoute({ children }) {
  const userData = localStorage.getItem('userData');
  return userData ? children : <Navigate to="/login" replace />;
}

function App() {
  return (
    <div >
      <Routes>
        <Route
          path="/"
          element={
            <PrivateRoute>
              <HomePage />
            </PrivateRoute>
          }
        />
        <Route
          path="/leaderboard"
          element={
            <PrivateRoute>
              <Leaderboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/quests"
          element={
            <PrivateRoute>
              <Quests />
            </PrivateRoute>
          }
        />
        <Route
          path="/resources"
          element={
            <PrivateRoute>
              <Resources />
            </PrivateRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <PrivateRoute>
              <Profile />
            </PrivateRoute>
          }
        />
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin/account"
          element={
            <PrivateRoute>
              <Account />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin/resources"
          element={
            <PrivateRoute>
              <AdminResources />
            </PrivateRoute>
          }
        />
        <Route
          path="/read/:resourceId"
          element={
            <PrivateRoute>
              <ReadResource />
            </PrivateRoute>
          }
        />
        <Route path='/register' element={<Register />}/>
        <Route path='/login' element={<Login />}/>
      </Routes>
    </div>
  );
}

export default App;
