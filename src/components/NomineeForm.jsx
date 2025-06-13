import React, { useState, useEffect } from 'react';
import { Form, Button, Row, Col, Alert } from 'react-bootstrap';

const NomineeForm = ({ onAddNominee, onUpdateNominee, nomineeToEdit, onCancelEdit, properties, insurances }) => {
  const [nominee, setNominee] = useState({
    name: '',
    relationship: '',
    contactNumber: '',
    email: '',
    address: '',
    dateOfBirth: '',
    propertyId: '',
    insuranceId: '',
    sharePercentage: '',
  });
  const [validated, setValidated] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  // Effect to handle nominee edit mode
  useEffect(() => {
    if (nomineeToEdit) {
      setNominee(nomineeToEdit);
      setIsEditing(true);
    } else {
      setIsEditing(false);
    }
  }, [nomineeToEdit]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNominee({ ...nominee, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    
    if (form.checkValidity() === false) {
      e.stopPropagation();
      setValidated(true);
      return;
    }

    // Add property and insurance names for display
    const selectedProperty = properties.find(p => p.id === parseInt(nominee.propertyId));
    const selectedInsurance = insurances.find(i => i.id === parseInt(nominee.insuranceId));
    
    const nomineeWithDetails = {
      ...nominee,
      propertyName: selectedProperty ? selectedProperty.name : 'Unknown',
      insurancePolicy: selectedInsurance ? selectedInsurance.policyNumber : 'Unknown'
    };

    if (isEditing) {
      onUpdateNominee(nomineeWithDetails);
    } else {
      onAddNominee(nomineeWithDetails);
    }
    
    setShowSuccess(true);
    
    // Only reset if not editing
    if (!isEditing) {
      resetForm();
    } else {
      // Keep form data but show success message
      setTimeout(() => {
        setShowSuccess(false);
      }, 3000);
    }
  };

  const resetForm = () => {
    setNominee({
      name: '',
      relationship: '',
      contactNumber: '',
      email: '',
      address: '',
      dateOfBirth: '',
      propertyId: '',
      insuranceId: '',
      sharePercentage: '',
    });
    setValidated(false);
    
    // Hide success message after 3 seconds
    setTimeout(() => {
      setShowSuccess(false);
    }, 3000);
  };

  const handleCancel = () => {
    resetForm();
    setIsEditing(false);
    onCancelEdit();
  };

  // Filter insurance policies by property
  const filterInsurancesByProperty = () => {
    if (!nominee.propertyId) return [];
    return insurances.filter(insurance => 
      insurance.propertyId === nominee.propertyId
    );
  };

  const filteredInsurances = nominee.propertyId ? filterInsurancesByProperty() : [];
  const hasProperties = properties.length > 0;
  const hasInsurances = insurances.length > 0;

  return (
    <>
      {showSuccess && (
        <Alert variant="success" className="mb-3">
          <i className="fas fa-check-circle me-2"></i>
          {isEditing ? 'Nominee updated successfully!' : 'Nominee added successfully!'}
        </Alert>
      )}
      
      <Form noValidate validated={validated} onSubmit={handleSubmit}>
        <Row>
          <Col md={8}>
            <Form.Group className="mb-3">
              <Form.Label>
                <i className="fas fa-user me-2 text-warning"></i>
                Nominee Name
              </Form.Label>
              <Form.Control
                required
                type="text"
                placeholder="Enter nominee's full name"
                name="name"
                value={nominee.name}
                onChange={handleChange}
              />
              <Form.Control.Feedback type="invalid">
                Please provide nominee's name.
              </Form.Control.Feedback>
            </Form.Group>
          </Col>
          <Col md={4}>
            <Form.Group className="mb-3">
              <Form.Label>
                <i className="fas fa-user-friends me-2 text-warning"></i>
                Relationship
              </Form.Label>
              <Form.Control
                required
                type="text"
                placeholder="e.g., Spouse, Child"
                name="relationship"
                value={nominee.relationship}
                onChange={handleChange}
              />
              <Form.Control.Feedback type="invalid">
                Please provide relationship.
              </Form.Control.Feedback>
            </Form.Group>
          </Col>
        </Row>

        <Row>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>
                <i className="fas fa-phone me-2 text-warning"></i>
                Contact Number
              </Form.Label>
              <Form.Control
                required
                type="tel"
                placeholder="Enter contact number"
                name="contactNumber"
                value={nominee.contactNumber}
                onChange={handleChange}
              />
              <Form.Control.Feedback type="invalid">
                Please provide a contact number.
              </Form.Control.Feedback>
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>
                <i className="fas fa-envelope me-2 text-warning"></i>
                Email Address
              </Form.Label>
              <Form.Control
                required
                type="email"
                placeholder="Enter email address"
                name="email"
                value={nominee.email}
                onChange={handleChange}
              />
              <Form.Control.Feedback type="invalid">
                Please provide a valid email.
              </Form.Control.Feedback>
            </Form.Group>
          </Col>
        </Row>

        <Form.Group className="mb-3">
          <Form.Label>
            <i className="fas fa-map-marker-alt me-2 text-warning"></i>
            Address
          </Form.Label>
          <Form.Control
            required
            as="textarea"
            rows={2}
            placeholder="Enter address"
            name="address"
            value={nominee.address}
            onChange={handleChange}
          />
          <Form.Control.Feedback type="invalid">
            Please provide an address.
          </Form.Control.Feedback>
        </Form.Group>

        <Row>
          <Col md={4}>
            <Form.Group className="mb-3">
              <Form.Label>
                <i className="fas fa-birthday-cake me-2 text-warning"></i>
                Date of Birth
              </Form.Label>
              <Form.Control
                required
                type="date"
                name="dateOfBirth"
                value={nominee.dateOfBirth}
                onChange={handleChange}
              />
              <Form.Control.Feedback type="invalid">
                Please provide date of birth.
              </Form.Control.Feedback>
            </Form.Group>
          </Col>
          <Col md={4}>
            <Form.Group className="mb-3">
              <Form.Label>
                <i className="fas fa-home me-2 text-warning"></i>
                Property
              </Form.Label>
              <Form.Select
                required
                name="propertyId"
                value={nominee.propertyId}
                onChange={handleChange}
                disabled={!hasProperties}
              >
                <option value="">Select property</option>
                {properties.map((property) => (
                  <option key={property.id} value={property.id}>
                    {property.name}
                  </option>
                ))}
              </Form.Select>
              <Form.Control.Feedback type="invalid">
                Please select a property.
              </Form.Control.Feedback>
              {!hasProperties && (
                <div className="text-danger small mt-1">
                  No properties available. Add a property first.
                </div>
              )}
            </Form.Group>
          </Col>
          <Col md={4}>
            <Form.Group className="mb-3">
              <Form.Label>
                <i className="fas fa-file-contract me-2 text-warning"></i>
                Insurance Policy
              </Form.Label>
              <Form.Select
                required
                name="insuranceId"
                value={nominee.insuranceId}
                onChange={handleChange}
                disabled={!nominee.propertyId || filteredInsurances.length === 0}
              >
                <option value="">Select insurance</option>
                {nominee.propertyId && filteredInsurances.map((insurance) => (
                  <option key={insurance.id} value={insurance.id}>
                    {insurance.policyNumber}
                  </option>
                ))}
              </Form.Select>
              <Form.Control.Feedback type="invalid">
                Please select an insurance policy.
              </Form.Control.Feedback>
              {nominee.propertyId && filteredInsurances.length === 0 && (
                <div className="text-danger small mt-1">
                  No insurance for this property. Add insurance first.
                </div>
              )}
            </Form.Group>
          </Col>
        </Row>

        <Form.Group className="mb-3">
          <Form.Label>
            <i className="fas fa-percentage me-2 text-warning"></i>
            Share Percentage (%)
          </Form.Label>
          <Form.Control
            required
            type="number"
            placeholder="Enter percentage share"
            name="sharePercentage"
            value={nominee.sharePercentage}
            onChange={handleChange}
            min="1"
            max="100"
          />
          <Form.Control.Feedback type="invalid">
            Please provide a valid percentage (1-100).
          </Form.Control.Feedback>
        </Form.Group>

        <div className="d-grid gap-2">
          {isEditing ? (
            <Row>
              <Col>
                <Button 
                  variant="warning" 
                  type="submit" 
                  size="lg" 
                  className="mt-3 w-100"
                >
                  <i className="fas fa-save me-2"></i>
                  Update Nominee
                </Button>
              </Col>
              <Col>
                <Button 
                  variant="outline-secondary" 
                  onClick={handleCancel} 
                  size="lg" 
                  className="mt-3 w-100"
                >
                  <i className="fas fa-times me-2"></i>
                  Cancel
                </Button>
              </Col>
            </Row>
          ) : (
            <Button 
              variant="warning" 
              type="submit" 
              size="lg"
              disabled={!hasProperties || !hasInsurances}
              className="mt-3"
            >
              <i className="fas fa-plus-circle me-2"></i>
              Add Nominee
            </Button>
          )}
          
          {(!hasProperties || !hasInsurances) && !isEditing && (
            <Alert variant="warning" className="mt-3 mb-0">
              You need to add both properties and insurance policies before adding nominees.
            </Alert>
          )}
        </div>
      </Form>
    </>
  );
};

export default NomineeForm; 