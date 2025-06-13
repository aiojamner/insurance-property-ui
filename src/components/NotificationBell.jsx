import React, { useState } from 'react';
import { Button, Badge, Offcanvas, ListGroup } from 'react-bootstrap';

const NotificationBell = ({ notifications, onViewAll, onDismissNotification }) => {
  const [show, setShow] = useState(false);
  
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  
  const unreadCount = notifications ? notifications.length : 0;
  
  // Get background color for notification item
  const getBgColor = (type) => {
    switch (type) {
      case 'renewal':
        return 'danger';
      case 'update':
        return 'warning';
      case 'info':
        return 'info';
      default:
        return 'light';
    }
  };
  
  // Get icon for notification type
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
    <>
      <Button 
        variant="outline-secondary" 
        className="notification-bell position-relative"
        onClick={handleShow}
      >
        <i className="fas fa-bell"></i>
        {unreadCount > 0 && (
          <Badge 
            bg="danger" 
            className="position-absolute top-0 start-100 translate-middle rounded-pill"
            style={{ fontSize: '0.6rem' }}
          >
            {unreadCount}
          </Badge>
        )}
      </Button>
      
      <Offcanvas show={show} onHide={handleClose} placement="end">
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>Notifications</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body className="p-0">
          {notifications && notifications.length > 0 ? (
            <ListGroup variant="flush">
              {notifications.map(notification => (
                <ListGroup.Item 
                  key={notification.id}
                  className={`border-start border-5 border-${getBgColor(notification.type)}`}
                >
                  <div className="d-flex justify-content-between align-items-start">
                    <div>
                      <div className="fw-bold">
                        <i className={`fas ${getIcon(notification.type)} me-2 text-${getBgColor(notification.type)}`}></i>
                        {notification.title}
                      </div>
                      <p className="mb-1 text-muted small">{notification.message}</p>
                      <small className="text-muted">
                        {new Date(notification.date).toLocaleDateString()}
                      </small>
                    </div>
                    <Button 
                      variant="link" 
                      className="p-0 text-muted" 
                      onClick={() => onDismissNotification(notification.id)}
                    >
                      <i className="fas fa-times"></i>
                    </Button>
                  </div>
                </ListGroup.Item>
              ))}
            </ListGroup>
          ) : (
            <div className="text-center p-4">
              <i className="fas fa-check-circle text-success fa-3x mb-3"></i>
              <p>No new notifications</p>
            </div>
          )}
        </Offcanvas.Body>
        {notifications && notifications.length > 0 && (
          <div className="p-3 border-top">
            <Button variant="primary" size="sm" className="w-100" onClick={onViewAll}>
              View All Notifications
            </Button>
          </div>
        )}
      </Offcanvas>
    </>
  );
};

export default NotificationBell; 