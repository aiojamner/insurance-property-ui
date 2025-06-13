import React, { useState } from 'react';
import { Form, Button, Card, Row, Col } from 'react-bootstrap';

const NotificationSettings = ({ notificationSettings, onUpdateSettings }) => {
  const [settings, setSettings] = useState(notificationSettings || {
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

  const handleToggle = (category, field) => {
    setSettings({
      ...settings,
      [category]: {
        ...settings[category],
        [field]: !settings[category][field]
      }
    });
  };

  const handleDaysChange = (e) => {
    setSettings({
      ...settings,
      policyRenewal: {
        ...settings.policyRenewal,
        daysInAdvance: parseInt(e.target.value, 10)
      }
    });
  };

  const handleSaveSettings = () => {
    onUpdateSettings(settings);
  };

  return (
    <div className="notification-settings">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h5 className="mb-0">
          <i className="fas fa-bell-slash me-2"></i>
          Notification Preferences
        </h5>
        <Button variant="primary" size="sm" onClick={handleSaveSettings}>
          <i className="fas fa-save me-1"></i>
          Save Preferences
        </Button>
      </div>

      <Row>
        <Col md={6} className="mb-4">
          <Card>
            <Card.Header className="bg-danger text-white">
              <h6 className="mb-0">
                <i className="fas fa-calendar-exclamation me-2"></i>
                Policy Renewal Reminders
              </h6>
            </Card.Header>
            <Card.Body>
              <Form.Check 
                type="switch"
                id="policy-renewal-toggle"
                label="Enable policy renewal notifications"
                checked={settings.policyRenewal.enabled}
                onChange={() => handleToggle('policyRenewal', 'enabled')}
                className="mb-3"
              />
              
              <Form.Group className="mb-3">
                <Form.Label>Notify me before expiry (days)</Form.Label>
                <Form.Select 
                  value={settings.policyRenewal.daysInAdvance}
                  onChange={handleDaysChange}
                  disabled={!settings.policyRenewal.enabled}
                >
                  <option value="7">7 days</option>
                  <option value="15">15 days</option>
                  <option value="30">30 days</option>
                  <option value="60">60 days</option>
                  <option value="90">90 days</option>
                </Form.Select>
              </Form.Group>
              
              <Form.Check 
                type="switch"
                id="policy-renewal-email"
                label="Send email notifications"
                checked={settings.policyRenewal.emailNotification}
                onChange={() => handleToggle('policyRenewal', 'emailNotification')}
                disabled={!settings.policyRenewal.enabled}
                className="mb-2"
              />
              
              <Form.Check 
                type="switch"
                id="policy-renewal-app"
                label="Send in-app notifications"
                checked={settings.policyRenewal.appNotification}
                onChange={() => handleToggle('policyRenewal', 'appNotification')}
                disabled={!settings.policyRenewal.enabled}
              />
            </Card.Body>
          </Card>
        </Col>
        
        <Col md={6} className="mb-4">
          <Card>
            <Card.Header className="bg-primary text-white">
              <h6 className="mb-0">
                <i className="fas fa-building me-2"></i>
                Property Update Notifications
              </h6>
            </Card.Header>
            <Card.Body>
              <Form.Check 
                type="switch"
                id="property-updates-toggle"
                label="Enable property update notifications"
                checked={settings.propertyUpdates.enabled}
                onChange={() => handleToggle('propertyUpdates', 'enabled')}
                className="mb-3"
              />
              
              <Form.Check 
                type="switch"
                id="property-updates-email"
                label="Send email notifications"
                checked={settings.propertyUpdates.emailNotification}
                onChange={() => handleToggle('propertyUpdates', 'emailNotification')}
                disabled={!settings.propertyUpdates.enabled}
                className="mb-2"
              />
              
              <Form.Check 
                type="switch"
                id="property-updates-app"
                label="Send in-app notifications"
                checked={settings.propertyUpdates.appNotification}
                onChange={() => handleToggle('propertyUpdates', 'appNotification')}
                disabled={!settings.propertyUpdates.enabled}
              />
            </Card.Body>
          </Card>
        </Col>
        
        <Col md={6} className="mb-4">
          <Card>
            <Card.Header className="bg-success text-white">
              <h6 className="mb-0">
                <i className="fas fa-shield-alt me-2"></i>
                Insurance Update Notifications
              </h6>
            </Card.Header>
            <Card.Body>
              <Form.Check 
                type="switch"
                id="insurance-updates-toggle"
                label="Enable insurance update notifications"
                checked={settings.insuranceUpdates.enabled}
                onChange={() => handleToggle('insuranceUpdates', 'enabled')}
                className="mb-3"
              />
              
              <Form.Check 
                type="switch"
                id="insurance-updates-email"
                label="Send email notifications"
                checked={settings.insuranceUpdates.emailNotification}
                onChange={() => handleToggle('insuranceUpdates', 'emailNotification')}
                disabled={!settings.insuranceUpdates.enabled}
                className="mb-2"
              />
              
              <Form.Check 
                type="switch"
                id="insurance-updates-app"
                label="Send in-app notifications"
                checked={settings.insuranceUpdates.appNotification}
                onChange={() => handleToggle('insuranceUpdates', 'appNotification')}
                disabled={!settings.insuranceUpdates.enabled}
              />
            </Card.Body>
          </Card>
        </Col>
        
        <Col md={6} className="mb-4">
          <Card>
            <Card.Header className="bg-warning text-dark">
              <h6 className="mb-0">
                <i className="fas fa-users me-2"></i>
                Nominee Update Notifications
              </h6>
            </Card.Header>
            <Card.Body>
              <Form.Check 
                type="switch"
                id="nominee-updates-toggle"
                label="Enable nominee update notifications"
                checked={settings.nomineeUpdates.enabled}
                onChange={() => handleToggle('nomineeUpdates', 'enabled')}
                className="mb-3"
              />
              
              <Form.Check 
                type="switch"
                id="nominee-updates-email"
                label="Send email notifications"
                checked={settings.nomineeUpdates.emailNotification}
                onChange={() => handleToggle('nomineeUpdates', 'emailNotification')}
                disabled={!settings.nomineeUpdates.enabled}
                className="mb-2"
              />
              
              <Form.Check 
                type="switch"
                id="nominee-updates-app"
                label="Send in-app notifications"
                checked={settings.nomineeUpdates.appNotification}
                onChange={() => handleToggle('nomineeUpdates', 'appNotification')}
                disabled={!settings.nomineeUpdates.enabled}
              />
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default NotificationSettings; 