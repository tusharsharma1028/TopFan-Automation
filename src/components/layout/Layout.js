import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import Header from './Header/Header';
import Footer from './Footer/Footer';
import Sidebar from './Sidebar/Sidebar';
import Toast from '../common/Toast/Toast';
import DynamicFormBuilder from '../common/DynamicFormBuilder/DynamicFormBuilder';
import { selectModal, closeModal, addNotification } from '../../store/slices/uiSlice';
import { QUICK_START_FORM_CONFIG } from '../../utils/formConfigs';
import { NOTIFICATION_TYPES } from '../../utils/constants';
import styles from './Layout.module.css';

const Layout = () => {
  const dispatch = useDispatch();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const modal = useSelector(selectModal);

  const handleFormSubmit = (formData) => {
    console.log('Form submitted with data:', formData);
    dispatch(addNotification({
      type: NOTIFICATION_TYPES.SUCCESS,
      message: 'Form submitted successfully!',
    }));
    dispatch(closeModal());
  };

  const handleCloseModal = () => {
    dispatch(closeModal());
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      handleCloseModal();
    }
  };

  useEffect(() => {
    const handleEscapeKey = (e) => {
      if (e.key === 'Escape' && modal.isOpen) {
        handleCloseModal();
      }
    };

    document.addEventListener('keydown', handleEscapeKey);
    return () => document.removeEventListener('keydown', handleEscapeKey);
  }, [modal.isOpen]);

  return (
    <div className={styles.layout}>
      <Header />
      <div className={styles.mainContainer}>
        <Sidebar isOpen={sidebarOpen} />
        <main className={styles.main}>
          <Outlet />
        </main>
      </div>
      <Footer />
      
      {modal.isOpen && modal.type === 'quickStartForm' && (
        <div
          className={styles.modalOverlay}
          onClick={handleOverlayClick}
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
        >
          <div className={styles.modalContent}>
            <div className={styles.modalHeader}>
              <h2 id="modal-title">Quick Start</h2>
              <button
                className={styles.closeButton}
                onClick={handleCloseModal}
                aria-label="Close modal"
              >
                ×
              </button>
            </div>
            <div className={styles.modalBody}>
              <DynamicFormBuilder
                formConfig={QUICK_START_FORM_CONFIG}
                onSubmit={handleFormSubmit}
                loading={false}
              />
            </div>
          </div>
        </div>
      )}
      
      <Toast />
    </div>
  );
};

export default Layout;
