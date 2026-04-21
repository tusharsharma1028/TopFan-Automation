import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../hooks/useAuth';
import Button from '../../common/Button/Button';
import { ROUTES } from '../../../routes/RouteConfig';
import styles from './Header.module.css';

const Header = () => {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate(ROUTES.LOGIN);
  };

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <Link to={ROUTES.HOME} className={styles.logo}>
          TopFan
        </Link>
        <nav className={styles.nav}>
          {isAuthenticated ? (
            <>
              <Link to={ROUTES.DASHBOARD} className={styles.navLink}>
                Dashboard
              </Link>
              <Link to={ROUTES.PROFILE} className={styles.navLink}>
                Profile
              </Link>
              <Link to={ROUTES.SETTINGS} className={styles.navLink}>
                Settings
              </Link>
              <Button variant="outline" size="small" onClick={handleLogout}>
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
