import React from 'react';
import styles from './Loader.module.css';

const Loader = ({ size = 'medium', fullscreen = false, text = '' }) => {
  const loaderClasses = [
    styles.loader,
    styles[size],
  ].filter(Boolean).join(' ');

  if (fullscreen) {
    return (
      <div className={styles.fullscreenWrapper}>
        <div className={styles.loaderContainer}>
          <div className={loaderClasses}></div>
          {text && <p className={styles.text}>{text}</p>}
        </div>
      </div>
    );
  }

  return (
    <div className={styles.loaderContainer}>
      <div className={loaderClasses}></div>
      {text && <p className={styles.text}>{text}</p>}
    </div>
  );
};

export default Loader;
