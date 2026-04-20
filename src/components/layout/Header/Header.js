import React from 'react';
import { Link } from 'react-router-dom';
import { ROUTES } from '../../../routes/RouteConfig';
import styles from './Header.module.css';

const Header = () => {
  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <Link to={ROUTES.HOME} className={styles.logo}>
          TopFan Automation
        </Link>
        <nav className={styles.nav}>
          <Link to={ROUTES.HOME} className={styles.navLink}>
            Home
          </Link>
          <Link to={ROUTES.DASHBOARD} className={styles.navLink}>
            Dashboard
          </Link>
        </nav>
      </div>
    </header>
  );
};

export default Header;
