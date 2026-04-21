import React from 'react';
import { useDispatch } from 'react-redux';
import { useAuth } from '../../hooks/useAuth';
import { Button } from '../../components';
import { openModal } from '../../store/slices/uiSlice';
import styles from './Dashboard.module.css';

const Dashboard = () => {
  const dispatch = useDispatch();
  const { user } = useAuth();

  const handleQuickStartClick = () => {
    dispatch(openModal({ type: 'quickStartForm', data: null }));
  };

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
          <div className={styles.quickStartButton}>
            <Button
              variant="primary"
              size="medium"
              onClick={handleQuickStartClick}
            >
              Quick Start
            </Button>
          </div>
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
