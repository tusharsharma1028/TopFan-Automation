import React from 'react';
import { NavLink } from 'react-router-dom';
import { ROUTES } from '../../../routes/RouteConfig';
import styles from './Sidebar.module.css';

const Sidebar = ({ isOpen }) => {
  return (
    <aside className={`${styles.sidebar} ${!isOpen ? styles.closed : ''}`}>
      <nav className={styles.nav}>
        <NavLink
          to={ROUTES.DASHBOARD}
          className={({ isActive }) =>
            `${styles.navLink} ${isActive ? styles.active : ''}`
          }
        >
          Dashboard
        </NavLink>
        <NavLink
          to={ROUTES.PROFILE}
          className={({ isActive }) =>
            `${styles.navLink} ${isActive ? styles.active : ''}`
          }
        >
          Profile
        </NavLink>
        <NavLink
          to={ROUTES.SETTINGS}
          className={({ isActive }) =>
            `${styles.navLink} ${isActive ? styles.active : ''}`
          }
        >
          Settings
        </NavLink>
      </nav>
    </aside>
  );
};

export default Sidebar;
