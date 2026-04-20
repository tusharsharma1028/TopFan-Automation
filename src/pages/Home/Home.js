import React from 'react';
import Button from '../../components/common/Button/Button';
import styles from './Home.module.css';

const Home = () => {
  return (
    <div className={styles.home}>
      <div className={styles.hero}>
        <h1 className={styles.title}>Welcome to TopFan Automation</h1>
        <p className={styles.subtitle}>
          A modern, production-ready React application for fan engagement automation.
        </p>
        <div className={styles.buttonGroup}>
          <Button variant="primary" size="large">
            Get Started
          </Button>
          <Button variant="outline" size="large">
            Learn More
          </Button>
        </div>
      </div>
      <div className={styles.features}>
        <div className={styles.feature}>
          <h3>Fast & Efficient</h3>
          <p>Built with modern React and optimized for performance</p>
        </div>
        <div className={styles.feature}>
          <h3>Scalable Architecture</h3>
          <p>Structured for growth with industry best practices</p>
        </div>
        <div className={styles.feature}>
          <h3>Developer Friendly</h3>
          <p>Clean code, comprehensive documentation, and great DX</p>
        </div>
      </div>
    </div>
  );
};

export default Home;
