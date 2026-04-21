import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../../hooks/useAuth';
import { ROUTES } from '../../../routes/RouteConfig';
import styles from './Sidebar.module.css';

const Sidebar = ({ isOpen }) => {
  const location = useLocation();
  const { isAuthenticated, logout } = useAuth();

  const handleLogout = async (e) => {
    e.preventDefault();
    try {
      await logout();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const isActive = (path) => location.pathname === path;

  if (!isOpen) return null;

  return (
    <aside className={styles.sidebar}>
      <nav className={styles.nav}>
        <Link
          to={ROUTES.HOME}
          className={`${styles.navItem} ${isActive(ROUTES.HOME) ? styles.active : ''}`}
        >
          Home
        </Link>
        
        {isAuthenticated ? (
          <>
            <Link
              to={ROUTES.DASHBOARD}
              className={`${styles.navItem} ${isActive(ROUTES.DASHBOARD) ? styles.active : ''}`}
            >
              Dashboard
            </Link>
            <Link
              to={ROUTES.PROFILE}
              className={`${styles.navItem} ${isActive(ROUTES.PROFILE) ? styles.active : ''}`}
            >
              Profile
            </Link>
            <Link
              to={ROUTES.SETTINGS}
              className={`${styles.navItem} ${isActive(ROUTES.SETTINGS) ? styles.active : ''}`}
            >
              Settings
            </Link>
            <button
              onClick={handleLogout}
              className={`${styles.navItem} ${styles.logoutButton}`}
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link
              to={ROUTES.LOGIN}
              className={`${styles.navItem} ${isActive(ROUTES.LOGIN) ? styles.active : ''}`}
            >
              Login
            </Link>
            <Link
              to={ROUTES.REGISTER}
              className={`${styles.navItem} ${isActive(ROUTES.REGISTER) ? styles.active : ''}`}
            >
              Register
            </Link>
          </>
        )}
      </nav>
    </aside>
  );
};

export default Sidebar;
