import React, { useState, useEffect } from 'react';
import { Form, Button, Row, Col, Alert } from 'react-bootstrap';

const InsuranceForm = ({ onAddInsurance, onUpdateInsurance, insuranceToEdit, onCancelEdit, properties }) => {
  const [insurance, setInsurance] = useState({
    policyNumber: '',
    provider: '',
    propertyId: '',
    type: 'property',
    coverageAmount: '',
    premium: '',
    startDate: '',
    endDate: '',
    notes: '',
  });
  const [validated, setValidated] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  // Effect to handle insurance edit mode
  useEffect(() => {
    if (insuranceToEdit) {
      setInsurance(insuranceToEdit);
      setIsEditing(true);
    } else {
      setIsEditing(false);
    }
  }, [insuranceToEdit]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInsurance({ ...insurance, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    
    if (form.checkValidity() === false) {
      e.stopPropagation();
      setValidated(true);
      return;
    }

    // Add the property name to the insurance record for display purposes
    const selectedProperty = properties.find(p => p.id === parseInt(insurance.propertyId));
    const insuranceWithProperty = {
      ...insurance,
      propertyName: selectedProperty ? selectedProperty.name : 'Unknown'
    };

    if (isEditing) {
      onUpdateInsurance(insuranceWithProperty);
    } else {
      onAddInsurance(insuranceWithProperty);
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
    setInsurance({
      policyNumber: '',
      provider: '',
      propertyId: '',
      type: 'property',
      coverageAmount: '',
      premium: '',
      startDate: '',
      endDate: '',
      notes: '',
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

  return (
    <>
      {showSuccess && (
        <Alert variant="success" className="mb-3">
          <i className="fas fa-check-circle me-2"></i>
          {isEditing ? 'Insurance policy updated successfully!' : 'Insurance policy added successfully!'}
        </Alert>
      )}
      
      <Form noValidate validated={validated} onSubmit={handleSubmit}>
        <Row>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>
                <i className="fas fa-id-card me-2 text-success"></i>
                Policy Number
              </Form.Label>
              <Form.Control
                required
                type="text"
                placeholder="Enter policy number"
                name="policyNumber"
                value={insurance.policyNumber}
                onChange={handleChange}
              />
              <Form.Control.Feedback type="invalid">
                Please provide a policy number.
              </Form.Control.Feedback>
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>
                <i className="fas fa-building me-2 text-success"></i>
                Insurance Provider
              </Form.Label>
              <Form.Control
                required
                type="text"
                placeholder="Enter provider name"
                name="provider"
                value={insurance.provider}
                onChange={handleChange}
              />
              <Form.Control.Feedback type="invalid">
                Please provide a provider name.
              </Form.Control.Feedback>
            </Form.Group>
          </Col>
        </Row>

        <Row>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>
                <i className="fas fa-home me-2 text-success"></i>
                Related Property
              </Form.Label>
              <Form.Select
                required
                name="propertyId"
                value={insurance.propertyId}
                onChange={handleChange}
                disabled={properties.length === 0}
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
              {properties.length === 0 && (
                <div className="text-danger small mt-1">
                  No properties available. Please add a property first.
                </div>
              )}
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>
                <i className="fas fa-shield-alt me-2 text-success"></i>
                Insurance Type
              </Form.Label>
              <Form.Select
                required
                name="type"
                value={insurance.type}
                onChange={handleChange}
              >
                <option value="property">Property Insurance</option>
                <option value="liability">Liability Insurance</option>
                <option value="fire">Fire Insurance</option>
                <option value="flood">Flood Insurance</option>
                <option value="earthquake">Earthquake Insurance</option>
                <option value="other">Other</option>
              </Form.Select>
            </Form.Group>
          </Col>
        </Row>

        <Row>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>
                <i className="fas fa-money-bill-wave me-2 text-success"></i>
                Coverage Amount
              </Form.Label>
              <Form.Control
                required
                type="number"
                placeholder="Enter coverage amount"
                name="coverageAmount"
                value={insurance.coverageAmount}
                onChange={handleChange}
                min="0"
              />
              <Form.Control.Feedback type="invalid">
                Please provide a valid coverage amount.
              </Form.Control.Feedback>
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>
                <i className="fas fa-receipt me-2 text-success"></i>
                Premium
              </Form.Label>
              <Form.Control
                required
                type="number"
                placeholder="Enter premium amount"
                name="premium"
                value={insurance.premium}
                onChange={handleChange}
                min="0"
              />
              <Form.Control.Feedback type="invalid">
                Please provide a valid premium amount.
              </Form.Control.Feedback>
            </Form.Group>
          </Col>
        </Row>

        <Row>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>
                <i className="fas fa-calendar-plus me-2 text-success"></i>
                Start Date
              </Form.Label>
              <Form.Control
                required
                type="date"
                name="startDate"
                value={insurance.startDate}
                onChange={handleChange}
              />
              <Form.Control.Feedback type="invalid">
                Please provide a start date.
              </Form.Control.Feedback>
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>
                <i className="fas fa-calendar-minus me-2 text-success"></i>
                End Date
              </Form.Label>
              <Form.Control
                required
                type="date"
                name="endDate"
                value={insurance.endDate}
                onChange={handleChange}
              />
              <Form.Control.Feedback type="invalid">
                Please provide an end date.
              </Form.Control.Feedback>
            </Form.Group>
          </Col>
        </Row>

        <Form.Group className="mb-3">
          <Form.Label>
            <i className="fas fa-sticky-note me-2 text-success"></i>
            Notes
          </Form.Label>
          <Form.Control
            as="textarea"
            rows={2}
            placeholder="Enter additional notes (optional)"
            name="notes"
            value={insurance.notes}
            onChange={handleChange}
          />
        </Form.Group>

        <div className="d-grid gap-2">
          {isEditing ? (
            <Row>
              <Col>
                <Button 
                  variant="success" 
                  type="submit" 
                  size="lg" 
                  className="mt-3 w-100"
                >
                  <i className="fas fa-save me-2"></i>
                  Update Insurance
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
              variant="success" 
              type="submit" 
              size="lg"
              disabled={properties.length === 0}
              className="mt-3"
            >
              <i className="fas fa-plus-circle me-2"></i>
              Add Insurance Policy
            </Button>
          )}
        </div>
      </Form>
    </>
  );
};

export default InsuranceForm; 