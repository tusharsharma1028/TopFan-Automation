import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import Loader from '../components/common/Loader/Loader';
import ProtectedRoute from '../components/ProtectedRoute';
import { ROUTES } from './RouteConfig';
import { useAuth } from '../hooks/useAuth';

const Home = lazy(() => import('../pages/Home/Home'));
const Login = lazy(() => import('../pages/Login/Login'));
const Register = lazy(() => import('../pages/Register/Register'));
const NotFound = lazy(() => import('../pages/NotFound/NotFound'));

const Dashboard = lazy(() => import('../pages/Dashboard/Dashboard'));
const Profile = lazy(() => import('../pages/Profile/Profile'));
const Settings = lazy(() => import('../pages/Settings/Settings'));

const AuthRedirect = ({ children }) => {
  const { isAuthenticated } = useAuth();
  
  if (isAuthenticated) {
    return <Navigate to={ROUTES.DASHBOARD} replace />;
  }
  
  return children;
};

const AppRoutes = () => {
  return (
    <Suspense fallback={<Loader fullscreen />}>
      <Routes>
        <Route path={ROUTES.HOME} element={<Layout />}>
          <Route index element={<Home />} />
          
          <Route
            path={ROUTES.LOGIN}
            element={
              <AuthRedirect>
                <Login />
              </AuthRedirect>
            }
          />
          
          <Route
            path={ROUTES.REGISTER}
            element={
              <AuthRedirect>
                <Register />
              </AuthRedirect>
            }
          />
          
          <Route element={<ProtectedRoute />}>
            <Route path={ROUTES.DASHBOARD} element={<Dashboard />} />
            <Route path={ROUTES.PROFILE} element={<Profile />} />
            <Route path={ROUTES.SETTINGS} element={<Settings />} />
          </Route>
          
          <Route path={ROUTES.NOT_FOUND} element={<NotFound />} />
        </Route>
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;
