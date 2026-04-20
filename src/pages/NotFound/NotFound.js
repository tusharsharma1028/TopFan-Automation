import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../../components/common/Button/Button';
import { ROUTES } from '../../routes/RouteConfig';
import styles from './NotFound.module.css';

const NotFound = () => {
  return (
    <div className={styles.notFound}>
      <div className={styles.content}>
        <h1 className={styles.code}>404</h1>
        <h2 className={styles.title}>Page Not Found</h2>
        <p className={styles.message}>
          Sorry, the page you are looking for does not exist or has been moved.
        </p>
        <Link to={ROUTES.HOME}>
          <Button variant="primary" size="large">
            Go to Home
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
