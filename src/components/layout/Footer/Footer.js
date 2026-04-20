import React from 'react';
import styles from './Footer.module.css';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <p className={styles.copyright}>
          © {currentYear} TopFan Automation. All rights reserved.
        </p>
        <div className={styles.links}>
          <a href="#" className={styles.link}>
            Privacy Policy
          </a>
          <a href="#" className={styles.link}>
            Terms of Service
          </a>
          <a href="#" className={styles.link}>
            Contact
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
