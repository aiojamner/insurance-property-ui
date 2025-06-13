import React, { useState, useEffect, useCallback } from 'react';
import { Container, Row, Col, Card, ListGroup, Button, Badge } from 'react-bootstrap';
import Dashboard from './components/Dashboard/Dashboard';
import PropertyForm from './components/PropertyForm';
import InsuranceForm from './components/InsuranceForm';
import NomineeForm from './components/NomineeForm';
import PropertyList from './components/PropertyList';
import InsuranceList from './components/InsuranceList';
import NomineeList from './components/NomineeList';
import Login from './components/Login';
import Register from './components/Register';
import Notifications from './components/Notifications';
import NotificationBell from './components/NotificationBell';
import NotificationsPage from './components/NotificationsPage';
import NotificationSettings from './components/NotificationSettings';
import DocumentGenerator from './components/DocumentGenerator';
import { v4 as uuidv4 } from 'uuid';
import './custom.css'; // We'll create this file next

function App() {
  const [activeSection, setActiveSection] = useState('property');
  const [properties, setProperties] = useState([]);
  const [insurances, setInsurances] = useState([]);
  const [nominees, setNominees] = useState([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [propertyToEdit, setPropertyToEdit] = useState(null);
  const [insuranceToEdit, setInsuranceToEdit] = useState(null);
  const [nomineeToEdit, setNomineeToEdit] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [showToasts, setShowToasts] = useState(true);
  const [notificationSettings, setNotificationSettings] = useState({
    policyRenewal: {
      enabled: true,
      daysInAdvance: 30,
      emailNotification: true,
      appNotification: true
    },
    propertyUpdates: {
      enabled: true,
      emailNotification: false,
      appNotification: true
    },
    insuranceUpdates: {
      enabled: true,
      emailNotification: true,
      appNotification: true
    },
    nomineeUpdates: {
      enabled: true,
      emailNotification: true,
      appNotification: true
    }
  });

  // Memoize the checkForPolicyRenewals function to avoid infinite loops
  const checkForPolicyRenewals = useCallback(() => {
    // Don't generate notifications if they're disabled
    if (!notificationSettings.policyRenewal.enabled) {
      return;
    }

    const today = new Date();
    const daysInAdvance = notificationSettings.policyRenewal.daysInAdvance;
    const futureDate = new Date(today);
    futureDate.setDate(today.getDate() + daysInAdvance);
    
    const renewalNotifications = [];
    
    insurances.forEach(insurance => {
      const endDate = new Date(insurance.endDate);
      
      // Check if policy expires within the specified days
      if (endDate <= futureDate && endDate >= today) {
        const daysRemaining = Math.ceil((endDate - today) / (1000 * 60 * 60 * 24));
        
        // Create notification for policies expiring soon
        const notification = {
          id: uuidv4(),
          type: 'renewal',
          title: 'Policy Renewal Reminder',
          message: `Your ${insurance.type} insurance policy (${insurance.policyNumber}) for ${insurance.propertyName} will expire in ${daysRemaining} days.`,
          date: new Date().toISOString(),
          relatedId: insurance.id
        };
        
        // Check if we already have a similar notification
        const existingNotification = notifications.find(
          n => n.type === 'renewal' && n.relatedId === insurance.id
        );
        
        if (!existingNotification) {
          renewalNotifications.push(notification);
        }
      }
    });
    
    if (renewalNotifications.length > 0) {
      setNotifications(prev => [...renewalNotifications, ...prev]);
    }
  }, [insurances, notifications, notificationSettings.policyRenewal.enabled, notificationSettings.policyRenewal.daysInAdvance]);

  
  // Check for policy renewals and generate notifications
  useEffect(() => {
    const timer = setTimeout(() => {
      if (insurances.length > 0) checkForPolicyRenewals();
    }, 500); // debounce
  
    return () => clearTimeout(timer);
  }, [insurances, checkForPolicyRenewals]);

  // Generate notification when a property is added/updated
  const createPropertyNotification = (property, isNew = true) => {
    // Check if notifications are enabled for property updates
    if (!notificationSettings.propertyUpdates.enabled) {
      return;
    }

    const notification = {
      id: Date.now() + Math.random(),
      type: 'update',
      title: isNew ? 'Property Added' : 'Property Updated',
      message: isNew 
        ? `New property "${property.name}" has been added successfully.`
        : `Property "${property.name}" has been updated successfully.`,
      date: new Date().toISOString(),
      relatedId: property.id
    };
    
    setNotifications(prev => [notification, ...prev]);
  };

  // Generate notification when an insurance is added/updated
  const createInsuranceNotification = (insurance, isNew = true) => {
    // Check if notifications are enabled for insurance updates
    if (!notificationSettings.insuranceUpdates.enabled) {
      return;
    }

    const notification = {
      id: Date.now() + Math.random(),
      type: 'update',
      title: isNew ? 'Insurance Added' : 'Insurance Updated',
      message: isNew 
        ? `New insurance policy "${insurance.policyNumber}" has been added for ${insurance.propertyName}.`
        : `Insurance policy "${insurance.policyNumber}" has been updated.`,
      date: new Date().toISOString(),
      relatedId: insurance.id
    };
    
    setNotifications(prev => [notification, ...prev]);
  };

  // Generate notification when a nominee is added/updated
  const createNomineeNotification = (nominee, isNew = true) => {
    // Check if notifications are enabled for nominee updates
    if (!notificationSettings.nomineeUpdates.enabled) {
      return;
    }

    const notification = {
      id: Date.now() + Math.random(),
      type: 'update',
      title: isNew ? 'Nominee Added' : 'Nominee Updated',
      message: isNew 
        ? `New nominee "${nominee.name}" has been added with ${nominee.sharePercentage}% share.`
        : `Nominee "${nominee.name}" details have been updated.`,
      date: new Date().toISOString(),
      relatedId: nominee.id
    };
    
    setNotifications(prev => [notification, ...prev]);
  };

  // Dismiss a single notification
  const handleDismissNotification = (id) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  };

  // Dismiss all notifications
  const handleDismissAllNotifications = () => {
    setNotifications([]);
  };

  // Handle property operations
  const handleAddProperty = (property) => {
    const newProperty = { ...property, id: Date.now() };
    setProperties([...properties, newProperty]);
    createPropertyNotification(newProperty, true);
  };

  const handleUpdateProperty = (updatedProperty) => {
    const updatedProperties = properties.map(property => 
      property.id === updatedProperty.id ? updatedProperty : property
    );
    setProperties(updatedProperties);
    setPropertyToEdit(null);
    createPropertyNotification(updatedProperty, false);
  };

  // Handle insurance operations
  const handleAddInsurance = (insurance) => {
    const newInsurance = { ...insurance, id: Date.now() };
    setInsurances([...insurances, newInsurance]);
    createInsuranceNotification(newInsurance, true);
  };

  const handleUpdateInsurance = (updatedInsurance) => {
    const updatedInsurances = insurances.map(insurance => 
      insurance.id === updatedInsurance.id ? updatedInsurance : insurance
    );
    setInsurances(updatedInsurances);
    setInsuranceToEdit(null);
    createInsuranceNotification(updatedInsurance, false);
  };

  // Handle nominee operations
  const handleAddNominee = (nominee) => {
    const newNominee = { ...nominee, id: Date.now() };
    setNominees([...nominees, newNominee]);
    createNomineeNotification(newNominee, true);
  };

  const handleUpdateNominee = (updatedNominee) => {
    const updatedNominees = nominees.map(nominee => 
      nominee.id === updatedNominee.id ? updatedNominee : nominee
    );
    setNominees(updatedNominees);
    setNomineeToEdit(null);
    createNomineeNotification(updatedNominee, false);
  };

  // Existing handlers
  const handleEditProperty = (property) => {
    setPropertyToEdit(property);
  };

  const handleCancelEditProperty = () => {
    setPropertyToEdit(null);
  };

  const handleEditInsurance = (insurance) => {
    setInsuranceToEdit(insurance);
  };

  const handleCancelEditInsurance = () => {
    setInsuranceToEdit(null);
  };

  const handleEditNominee = (nominee) => {
    setNomineeToEdit(nominee);
  };

  const handleCancelEditNominee = () => {
    setNomineeToEdit(null);
  };

  const handleLogin = (userData) => {
    // In a real app, you would validate the user's credentials with your backend
    // For this demo, we'll simulate a successful login
    setCurrentUser(userData);
    setIsAuthenticated(true);
  };

  const handleRegister = (userData) => {
    // In a real app, you would send the user's data to your backend to register
    // For this demo, we'll simulate a successful registration
    setCurrentUser(userData);
    setIsAuthenticated(true);
    setShowRegister(false);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setIsAuthenticated(false);
    setNotifications([]);
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const handleSectionChange = (section) => {
    setActiveSection(section);
    setMobileMenuOpen(false); // Close mobile menu after selection
  };

  // Function to view all notifications
  const handleViewAllNotifications = () => {
    setActiveSection('notifications');
  };

  // Update notification settings
  const handleUpdateNotificationSettings = (newSettings) => {
    setNotificationSettings(newSettings);
    // Create an info notification about settings update
    const notification = {
      id: Date.now() + Math.random(),
      type: 'info',
      title: 'Settings Updated',
      message: 'Your notification preferences have been updated successfully.',
      date: new Date().toISOString()
    };
    setNotifications(prev => [notification, ...prev]);
  };

  const toggleShowToasts = () => {
    setShowToasts(!showToasts);
    // Create an info notification about toast visibility
    const notification = {
      id: Date.now() + Math.random(),
      type: 'info',
      title: showToasts ? 'Toasts Disabled' : 'Toasts Enabled',
      message: showToasts 
        ? 'Pop-up notifications have been disabled.' 
        : 'Pop-up notifications have been enabled.',
      date: new Date().toISOString()
    };

    setNotifications(prev => [notification, ...prev]);
  };

  if (!isAuthenticated) {
    return (
      <Container fluid className="p-4">
        <Card className="shadow-sm border-0 mb-4">
          <Card.Body>
            <div className="text-center mb-4">
              <i className="fas fa-building-shield logo-icon-large"></i>
              <h4 className="text-muted mt-2">Your Personal Asset Manager</h4>
            </div>
          </Card.Body>
        </Card>
        
        {showRegister ? (
          <Register 
            onRegister={handleRegister} 
            onSwitchToLogin={() => setShowRegister(false)} 
          />
        ) : (
          <Login 
            onLogin={handleLogin} 
            onSwitchToRegister={() => setShowRegister(true)} 
          />
        )}
      </Container>
    );
  }

  // Function to render the active content section
  const renderActiveContent = () => {
    switch (activeSection) {
      case 'dashboard':
        return <Dashboard />;
      case 'property':
        return (
          <Row>
            <Col lg={5} className="mb-4">
              <Card className="shadow-sm h-100">
                <Card.Header className="bg-primary text-white">
                  <h5 className="mb-0">
                    {propertyToEdit ? 'Edit Property' : 'Add New Property'}
                  </h5>
                </Card.Header>
                <Card.Body>
                  <PropertyForm 
                    onAddProperty={handleAddProperty}
                    onUpdateProperty={handleUpdateProperty}
                    propertyToEdit={propertyToEdit}
                    onCancelEdit={handleCancelEditProperty}
                  />
                </Card.Body>
              </Card>
            </Col>
            <Col lg={7}>
              <Card className="shadow-sm">
                <Card.Header className="bg-info text-white">
                  <h5 className="mb-0">Your Properties</h5>
                </Card.Header>
                <Card.Body>
                  <PropertyList 
                    properties={properties} 
                    onEditProperty={handleEditProperty}
                  />
                </Card.Body>
              </Card>
            </Col>
          </Row>
        );
      case 'insurance':
        return (
          <Row>
            <Col lg={5} className="mb-4">
              <Card className="shadow-sm h-100">
                <Card.Header className="bg-success text-white">
                  <h5 className="mb-0">
                    {insuranceToEdit ? 'Edit Insurance Policy' : 'Add New Insurance'}
                  </h5>
                </Card.Header>
                <Card.Body> 
                  <InsuranceForm 
                    onAddInsurance={handleAddInsurance} 
                    onUpdateInsurance={handleUpdateInsurance}
                    insuranceToEdit={insuranceToEdit}
                    onCancelEdit={handleCancelEditInsurance}
                    properties={properties}
                  />
                </Card.Body>
              </Card>
            </Col>
            <Col lg={7}>
              <Card className="shadow-sm">
                <Card.Header className="bg-info text-white">
                  <h5 className="mb-0">Your Insurance Policies</h5>
                </Card.Header>
                <Card.Body>
                  <InsuranceList 
                    insurances={insurances} 
                    onEditInsurance={handleEditInsurance}
                  />
                </Card.Body>
              </Card>
            </Col>
          </Row>
        );
      case 'nominee':
        return (
          <Row>
            <Col lg={5} className="mb-4">
              <Card className="shadow-sm h-100">
                <Card.Header className="bg-warning text-dark">
                  <h5 className="mb-0">
                    {nomineeToEdit ? 'Edit Nominee' : 'Add New Nominee'}
                  </h5>
                </Card.Header>
                <Card.Body>
                  <NomineeForm 
                    onAddNominee={handleAddNominee}
                    onUpdateNominee={handleUpdateNominee}
                    nomineeToEdit={nomineeToEdit}
                    onCancelEdit={handleCancelEditNominee}
                    properties={properties} 
                    insurances={insurances}
                  />
                </Card.Body>
              </Card>
            </Col>
            <Col lg={7}>
              <Card className="shadow-sm">
                <Card.Header className="bg-info text-white">
                  <h5 className="mb-0">Your Nominees</h5>
                </Card.Header>
                <Card.Body>
                  <NomineeList 
                    nominees={nominees} 
                    onEditNominee={handleEditNominee}
                  />
                </Card.Body>
              </Card>
            </Col>
          </Row>
        );
      case 'documents':
        return (
          <Card className="shadow-sm">
            <Card.Header className="bg-dark text-white">
              <h5 className="mb-0">Document Management</h5>
            </Card.Header>
            <Card.Body>
              <DocumentGenerator 
                properties={properties}
                insurances={insurances}
                nominees={nominees}
              />
            </Card.Body>
          </Card>
        );
      case 'notifications':
        return (
          <Card className="shadow-sm">
            <Card.Header className="bg-secondary text-white">
              <h5 className="mb-0">Notification Center</h5>
            </Card.Header>
            <Card.Body>
              <Row>
                <Col md={12} className="mb-4">
                  <NotificationsPage 
                    notifications={notifications}
                    onDismissNotification={handleDismissNotification}
                    onDismissAll={handleDismissAllNotifications}
                  />
                </Col>
                <Col md={12}>
                  <hr />
                  <NotificationSettings 
                    notificationSettings={notificationSettings}
                    onUpdateSettings={handleUpdateNotificationSettings}
                  />
                </Col>
              </Row>
            </Card.Body>
          </Card>
        );
      default:
        return <div>Select an option from the menu</div>;
    }
  };

  return (
    <Container fluid className="p-4">
      {/* Toast Notifications */}
      {showToasts && (
        <Notifications 
          notifications={notifications} 
          onDismissNotification={handleDismissNotification} 
        />
      )}
      
      <Card className="shadow-sm border-0 mb-4">
        <Card.Body>
          <div className="d-flex justify-content-between align-items-center">
            <div className="d-flex align-items-center">
              <div className="app-logo">
                <i className="fas fa-building-shield logo-icon"></i>
              </div>
              <button 
                className="d-md-none ms-2 btn btn-outline-secondary" 
                onClick={toggleMobileMenu}
                aria-label="Toggle menu"
              >
                <i className={`fas ${mobileMenuOpen ? 'fa-times' : 'fa-bars'}`}></i>
              </button>
            </div>
            <div className="d-flex align-items-center">
              <Button 
                variant="outline-secondary" 
                size="sm" 
                className="me-2" 
                onClick={toggleShowToasts}
                title={showToasts ? "Disable pop-up notifications" : "Enable pop-up notifications"}
              >
                <i className={`fas ${showToasts ? 'fa-bell' : 'fa-bell-slash'}`}></i>
              </Button>
              <div className="me-3">
                <NotificationBell 
                  notifications={notifications}
                  onViewAll={handleViewAllNotifications}
                  onDismissNotification={handleDismissNotification}
                />
              </div>
              <div>
                <span className="me-3 d-none d-sm-inline">Welcome, {currentUser.name}</span>
                <button className="btn btn-outline-secondary btn-sm" onClick={handleLogout}>
                  <i className="fas fa-sign-out-alt d-inline d-sm-none"></i>
                  <span className="d-none d-sm-inline">Logout</span>
                </button>
              </div>
            </div>
          </div>
        </Card.Body>
      </Card>

      <Row>
        <Col md={3} lg={2} className={`sidebar-container ${mobileMenuOpen ? 'mobile-open' : ''}`}>
          <Card className="shadow-sm mb-4 sidebar-menu">
            <Card.Header className="bg-dark text-white">
              <h5 className="mb-0" onClick={() => handleSectionChange('dashboard')}>My Dashboard</h5>
            </Card.Header>
            <ListGroup variant="flush">
              <ListGroup.Item 
                action 
                active={activeSection === 'property'}
                onClick={() => handleSectionChange('property')}
                className="d-flex align-items-center"
              >
                <i className="fas fa-building me-2"></i>
                <span className="menu-text">My Properties</span>
              </ListGroup.Item>
              <ListGroup.Item 
                action 
                active={activeSection === 'insurance'}
                onClick={() => handleSectionChange('insurance')}
                className="d-flex align-items-center"
              >
                <i className="fas fa-shield-alt me-2"></i>
                <span className="menu-text">My Insurance</span>
              </ListGroup.Item>
              <ListGroup.Item 
                action 
                active={activeSection === 'nominee'}
                onClick={() => handleSectionChange('nominee')}
                className="d-flex align-items-center"
              >
                <i className="fas fa-users me-2"></i>
                <span className="menu-text">My Nominees</span>
              </ListGroup.Item>
              <ListGroup.Item 
                action 
                active={activeSection === 'documents'}
                onClick={() => handleSectionChange('documents')}
                className="d-flex align-items-center"
              >
                <i className="fas fa-file-alt me-2"></i>
                <span className="menu-text">Documents</span>
              </ListGroup.Item>
              <ListGroup.Item 
                action 
                active={activeSection === 'notifications'}
                onClick={() => handleSectionChange('notifications')}
                className="d-flex align-items-center"
              >
                <i className="fas fa-bell me-2"></i>
                <span className="menu-text">Notifications</span>
                {notifications.length > 0 && (
                  <Badge 
                    bg="danger" 
                    pill 
                    className="ms-auto"
                  >
                    {notifications.length}
                  </Badge>
                )}
              </ListGroup.Item>
            </ListGroup>
          </Card>
        </Col>
        <Col md={9} lg={10}>
          {renderActiveContent()}
        </Col>
      </Row>

      <footer className="text-center mt-5 pt-3 pb-3 border-top">
        <p className="text-muted">© 2023 Personal Asset Management</p>
      </footer>
    </Container>
  );
}

export default App;
