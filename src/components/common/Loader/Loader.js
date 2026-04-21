import React from 'react';
import PropTypes from 'prop-types';
import styles from './Loader.module.css';

const Loader = ({ fullscreen = false, size = 'medium' }) => {
  const loaderClasses = [styles.loader, styles[size]].filter(Boolean).join(' ');

  if (fullscreen) {
    return (
      <div className={styles.fullscreen} data-testid="loader">
        <div className={loaderClasses}></div>
      </div>
    );
  }

  return <div className={loaderClasses} data-testid="loader"></div>;
};

Loader.propTypes = {
  fullscreen: PropTypes.bool,
  size: PropTypes.oneOf(['small', 'medium', 'large']),
};

export default Loader;
