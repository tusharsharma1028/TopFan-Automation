import React from 'react';
import { useAuth } from '../../hooks/useAuth';
import styles from './Dashboard.module.css';

const Dashboard = () => {
  const { user } = useAuth();

  return (
    <div className={styles.dashboard}>
      <div className={styles.header}>
        <h1 className={styles.title}>Dashboard</h1>
        <p className={styles.subtitle}>Welcome back, {user?.email}</p>
      </div>
      
      <div className={styles.content}>
        <div className={styles.card}>
          <h2>Quick Stats</h2>
          <p>Your dashboard content goes here.</p>
        </div>
        
        <div className={styles.card}>
          <h2>Recent Activity</h2>
          <p>No recent activity to show.</p>
        </div>
        
        <div className={styles.card}>
          <h2>Getting Started</h2>
          <p>Explore the features available in your account.</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
