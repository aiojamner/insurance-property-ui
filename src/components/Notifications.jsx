import React from 'react';
import { Toast, ToastContainer, Badge } from 'react-bootstrap';

const Notifications = ({ notifications, onDismissNotification }) => {
  if (!notifications || notifications.length === 0) {
    return null;
  }

  // Get variant based on notification type
  const getVariant = (type) => {
    switch (type) {
      case 'renewal':
        return 'danger';
      case 'update':
        return 'warning';
      case 'info':
        return 'info';
      default:
        return 'secondary';
    }
  };

  // Get icon based on notification type
  const getIcon = (type) => {
    switch (type) {
      case 'renewal':
        return 'fa-calendar-exclamation';
      case 'update':
        return 'fa-bell';
      case 'info':
        return 'fa-info-circle';
      default:
        return 'fa-bell';
    }
  };

  return (
    <ToastContainer className="position-fixed p-3" position="top-end" style={{ zIndex: 1060 }}>
      {notifications.map((notification) => (
        <Toast 
          key={notification.id} 
          onClose={() => onDismissNotification(notification.id)} 
          show={true}
          bg={getVariant(notification.type)}
          className="mb-2"
          delay={10000}
          autohide
        >
          <Toast.Header>
            <i className={`fas ${getIcon(notification.type)} me-2`}></i>
            <strong className="me-auto">{notification.title}</strong>
            <Badge bg="light" text="dark" pill>
              {new Date(notification.date).toLocaleDateString()}
            </Badge>
          </Toast.Header>
          <Toast.Body className={notification.type === 'renewal' ? 'text-white' : ''}>
            {notification.message}
          </Toast.Body>
        </Toast>
      ))}
    </ToastContainer>
  );
};

export default Notifications; 