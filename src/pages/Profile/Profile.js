import React from 'react';
import { useAuth } from '../../hooks/useAuth';
import styles from './Profile.module.css';

const Profile = () => {
  const { user } = useAuth();

  return (
    <div className={styles.profile}>
      <div className={styles.header}>
        <h1 className={styles.title}>Profile</h1>
        <p className={styles.subtitle}>Manage your account information</p>
      </div>
      
      <div className={styles.content}>
        <div className={styles.card}>
          <h2>Account Details</h2>
          <div className={styles.field}>
            <label>Email:</label>
            <span>{user?.email}</span>
          </div>
          <div className={styles.field}>
            <label>User ID:</label>
            <span>{user?.id}</span>
          </div>
          <div className={styles.field}>
            <label>Member Since:</label>
            <span>{user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}</span>
          </div>
        </div>
        
        <div className={styles.card}>
          <h2>Profile Settings</h2>
          <p className={styles.comingSoon}>Profile editing features coming soon!</p>
        </div>
      </div>
    </div>
  );
};

export default Profile;
