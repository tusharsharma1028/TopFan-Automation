import React from 'react';
import { Link } from 'react-router-dom';
import { ROUTES } from '../../../routes/RouteConfig';
import styles from './Footer.module.css';

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.content}>
        <div className={styles.links}>
          <Link to={ROUTES.HOME} className={styles.link}>
            Home
          </Link>
          <Link to="/about" className={styles.link}>
            About
          </Link>
          <Link to="/contact" className={styles.link}>
            Contact
          </Link>
          <Link to="/privacy" className={styles.link}>
            Privacy Policy
          </Link>
        </div>
        <p>&copy; {new Date().getFullYear()} TopFan Automation. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
