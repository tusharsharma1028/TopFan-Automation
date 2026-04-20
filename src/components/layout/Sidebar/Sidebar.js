import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ROUTES } from '../../../routes/RouteConfig';
import styles from './Sidebar.module.css';

const Sidebar = ({ isOpen }) => {
  const location = useLocation();

  const menuItems = [
    { path: ROUTES.HOME, label: 'Home' },
    { path: ROUTES.DASHBOARD, label: 'Dashboard' },
    { path: ROUTES.SETTINGS, label: 'Settings' },
  ];

  return (
    <aside className={`${styles.sidebar} ${isOpen ? styles.open : ''}`}>
      <nav className={styles.nav}>
        {menuItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`${styles.navItem} ${
              location.pathname === item.path ? styles.active : ''
            }`}
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
