import React, { useState } from 'react';
import { Card, Badge, Button, ButtonGroup, Form, Row, Col, Alert } from 'react-bootstrap';

const NotificationsPage = ({ notifications, onDismissNotification, onDismissAll }) => {
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  
  if (!notifications || notifications.length === 0) {
    return (
      <Alert variant="info">
        <i className="fas fa-bell-slash me-2"></i>
        You don't have any notifications yet.
      </Alert>
    );
  }

  // Filter notifications based on type and search term
  const filteredNotifications = notifications.filter(notification => {
    const matchesFilter = filter === 'all' || notification.type === filter;
    const matchesSearch = notification.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         notification.message.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  // Get badge color based on notification type
  const getBadgeColor = (type) => {
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

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h5 className="mb-0">
          <i className="fas fa-bell me-2"></i>
          Notifications
        </h5>
        <Button 
          variant="outline-secondary" 
          size="sm" 
          onClick={onDismissAll}
          disabled={notifications.length === 0}
        >
          <i className="fas fa-check-double me-1"></i>
          Mark All as Read
        </Button>
      </div>

      <Row className="mb-4">
        <Col md={6} className="mb-3 mb-md-0">
          <ButtonGroup>
            <Button 
              variant={filter === 'all' ? 'primary' : 'outline-primary'} 
              onClick={() => setFilter('all')}
            >
              All
            </Button>
            <Button 
              variant={filter === 'renewal' ? 'danger' : 'outline-danger'} 
              onClick={() => setFilter('renewal')}
            >
              <i className="fas fa-calendar-exclamation me-1"></i>
              Renewals
            </Button>
            <Button 
              variant={filter === 'update' ? 'warning' : 'outline-warning'} 
              onClick={() => setFilter('update')}
            >
              <i className="fas fa-bell me-1"></i>
              Updates
            </Button>
            <Button 
              variant={filter === 'info' ? 'info' : 'outline-info'} 
              onClick={() => setFilter('info')}
            >
              <i className="fas fa-info-circle me-1"></i>
              Info
            </Button>
          </ButtonGroup>
        </Col>
        <Col md={6}>
          <Form.Control
            type="text"
            placeholder="Search notifications..."
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </Col>
      </Row>

      {filteredNotifications.length === 0 ? (
        <Alert variant="light" className="text-center">
          <i className="fas fa-search me-2"></i>
          No notifications match your filter criteria
        </Alert>
      ) : (
        filteredNotifications.map(notification => (
          <Card 
            key={notification.id} 
            className={`mb-3 border-start border-5 border-${getBadgeColor(notification.type)}`}
          >
            <Card.Body>
              <div className="d-flex justify-content-between align-items-start">
                <div>
                  <h5 className="mb-1">
                    <i className={`fas ${getIcon(notification.type)} me-2 text-${getBadgeColor(notification.type)}`}></i>
                    {notification.title}
                    <Badge 
                      bg={getBadgeColor(notification.type)} 
                      className="ms-2"
                    >
                      {notification.type === 'renewal' ? 'Renewal' : notification.type === 'update' ? 'Update' : 'Info'}
                    </Badge>
                  </h5>
                  <p>{notification.message}</p>
                  <div className="text-muted small">
                    {new Date(notification.date).toLocaleString()}
                  </div>
                </div>
                <Button 
                  variant="link" 
                  className="text-muted p-0" 
                  onClick={() => onDismissNotification(notification.id)}
                >
                  <i className="fas fa-times"></i>
                </Button>
              </div>
            </Card.Body>
          </Card>
        ))
      )}
    </>
  );
};

export default NotificationsPage; 