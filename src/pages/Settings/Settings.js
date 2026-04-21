import React from 'react';
import { useAuth } from '../../hooks/useAuth';
import styles from './Settings.module.css';

const Settings = () => {
  const { user } = useAuth();

  return (
    <div className={styles.settings}>
      <div className={styles.header}>
        <h1 className={styles.title}>Settings</h1>
        <p className={styles.subtitle}>Manage your preferences and account settings</p>
      </div>
      
      <div className={styles.content}>
        <div className={styles.card}>
          <h2>Account Settings</h2>
          <p className={styles.comingSoon}>Account settings coming soon!</p>
        </div>
        
        <div className={styles.card}>
          <h2>Security</h2>
          <p className={styles.comingSoon}>Security settings coming soon!</p>
        </div>
        
        <div className={styles.card}>
          <h2>Notifications</h2>
          <p className={styles.comingSoon}>Notification preferences coming soon!</p>
        </div>
      </div>
    </div>
  );
};

export default Settings;
