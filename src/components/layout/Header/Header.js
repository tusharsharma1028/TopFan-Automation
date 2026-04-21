import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../../hooks/useAuth';
import Button from '../../common/Button/Button';
import { ROUTES } from '../../../routes/RouteConfig';
import styles from './Header.module.css';

const Header = () => {
  const { isAuthenticated, user, logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <Link to={ROUTES.HOME} className={styles.logo}>
          TopFan Automation
        </Link>
        
        <nav className={styles.nav}>
          {isAuthenticated ? (
            <>
              <span className={styles.userEmail}>{user?.email}</span>
              <Link to={ROUTES.DASHBOARD} className={styles.navLink}>
                Dashboard
              </Link>
              <Link to={ROUTES.PROFILE} className={styles.navLink}>
                Profile
              </Link>
              <Button
                variant="outline"
                size="small"
                onClick={handleLogout}
                aria-label="Logout"
              >
                Logout
              </Button>
            </>
          ) : (
            <>
              <Link to={ROUTES.LOGIN} className={styles.navLink}>
                Login
              </Link>
              <Link to={ROUTES.REGISTER}>
                <Button variant="primary" size="small">
                  Sign Up
                </Button>
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
