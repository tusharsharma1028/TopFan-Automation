import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { selectNotifications, removeNotification } from '../../../store/slices/uiSlice';
import { NOTIFICATION_TYPES } from '../../../utils/constants';
import styles from './Toast.module.css';

const Toast = () => {
  const dispatch = useDispatch();
  const notifications = useSelector(selectNotifications);

  useEffect(() => {
    notifications.forEach((notification) => {
      const timer = setTimeout(() => {
        dispatch(removeNotification(notification.id));
      }, 3000);

      return () => clearTimeout(timer);
    });
  }, [notifications, dispatch]);

  const handleClose = (id) => {
    dispatch(removeNotification(id));
  };

  const getTypeClass = (type) => {
    switch (type) {
      case NOTIFICATION_TYPES.SUCCESS:
        return styles.success;
      case NOTIFICATION_TYPES.ERROR:
        return styles.error;
      case NOTIFICATION_TYPES.WARNING:
        return styles.warning;
      case NOTIFICATION_TYPES.INFO:
        return styles.info;
      default:
        return styles.info;
    }
  };

  if (notifications.length === 0) {
    return null;
  }

  return (
    <div className={styles.toastContainer}>
      {notifications.map((notification) => (
        <div
          key={notification.id}
          className={`${styles.toast} ${getTypeClass(notification.type)}`}
          role="alert"
          aria-live="polite"
        >
          <span className={styles.message}>{notification.message}</span>
          <button
            className={styles.closeButton}
            onClick={() => handleClose(notification.id)}
            aria-label="Close notification"
          >
            ×
          </button>
        </div>
      ))}
    </div>
  );
};

export default Toast;
