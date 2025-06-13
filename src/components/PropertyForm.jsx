import React, { useState, useEffect } from 'react';
import { Form, Button, Row, Col, Alert } from 'react-bootstrap';

const PropertyForm = ({ onAddProperty, onUpdateProperty, propertyToEdit, onCancelEdit }) => {
  const [name, setName] = useState('');
  const [type, setType] = useState('Residential');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [country, setCountry] = useState('');
  const [purchaseDate, setPurchaseDate] = useState('');
  const [purchaseValue, setPurchaseValue] = useState('');
  const [currentValue, setCurrentValue] = useState('');
  const [landArea, setLandArea] = useState('');
  const [builtArea, setBuiltArea] = useState('');
  const [ownerName, setOwnerName] = useState('');
  const [ownerContact, setOwnerContact] = useState('');
  const [ownerIdType, setOwnerIdType] = useState('');
  const [ownerIdNumber, setOwnerIdNumber] = useState('');
  const [marketValue, setMarketValue] = useState('');
  const [valuationDate, setValuationDate] = useState('');
  const [loanStatus, setLoanStatus] = useState('No Loan');
  const [loanAmount, setLoanAmount] = useState('');
  const [loanProvider, setLoanProvider] = useState('');
  const [documents, setDocuments] = useState([
    { name: 'Deed Papers', uploaded: false, fileName: '' },
    { name: 'Tax Receipts', uploaded: false, fileName: '' },
    { name: 'Loan Documents', uploaded: false, fileName: '' },
    { name: 'Valuation Report', uploaded: false, fileName: '' }
  ]);
  const [notes, setNotes] = useState('');
  
  const [showSuccess, setShowSuccess] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});

  useEffect(() => {
    if (propertyToEdit) {
      setName(propertyToEdit.name || '');
      setType(propertyToEdit.type || 'Residential');
      setAddress(propertyToEdit.address || '');
      setCity(propertyToEdit.city || '');
      setState(propertyToEdit.state || '');
      setPostalCode(propertyToEdit.postalCode || '');
      setCountry(propertyToEdit.country || '');
      setPurchaseDate(propertyToEdit.purchaseDate || '');
      setPurchaseValue(propertyToEdit.purchaseValue || '');
      setCurrentValue(propertyToEdit.currentValue || '');
      setLandArea(propertyToEdit.landArea || '');
      setBuiltArea(propertyToEdit.builtArea || '');
      setOwnerName(propertyToEdit.ownerName || '');
      setOwnerContact(propertyToEdit.ownerContact || '');
      setOwnerIdType(propertyToEdit.ownerIdType || '');
      setOwnerIdNumber(propertyToEdit.ownerIdNumber || '');
      setMarketValue(propertyToEdit.marketValue || '');
      setValuationDate(propertyToEdit.valuationDate || '');
      setLoanStatus(propertyToEdit.loanStatus || 'No Loan');
      setLoanAmount(propertyToEdit.loanAmount || '');
      setLoanProvider(propertyToEdit.loanProvider || '');
      setDocuments(propertyToEdit.documents || [
        { name: 'Deed Papers', uploaded: false, fileName: '' },
        { name: 'Tax Receipts', uploaded: false, fileName: '' },
        { name: 'Loan Documents', uploaded: false, fileName: '' },
        { name: 'Valuation Report', uploaded: false, fileName: '' }
      ]);
      setNotes(propertyToEdit.notes || '');
    }
  }, [propertyToEdit]);

  const validateForm = () => {
    const errors = {};
    
    if (!name.trim()) errors.name = 'Property name is required';
    if (!address.trim()) errors.address = 'Address is required';
    if (!city.trim()) errors.city = 'City is required';
    if (!purchaseDate) errors.purchaseDate = 'Purchase date is required';
    if (purchaseValue && isNaN(Number(purchaseValue))) errors.purchaseValue = 'Purchase value must be a number';
    if (currentValue && isNaN(Number(currentValue))) errors.currentValue = 'Current value must be a number';
    if (marketValue && isNaN(Number(marketValue))) errors.marketValue = 'Market value must be a number';
    if (landArea && isNaN(Number(landArea))) errors.landArea = 'Land area must be a number';
    if (builtArea && isNaN(Number(builtArea))) errors.builtArea = 'Built area must be a number';
    if (loanStatus === 'Active' && (!loanAmount || isNaN(Number(loanAmount)))) {
      errors.loanAmount = 'Loan amount must be a valid number';
    }
    if (loanStatus === 'Active' && !loanProvider) {
      errors.loanProvider = 'Loan provider is required when loan is active';
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleDocumentChange = (index, uploaded, fileName = '') => {
    const updatedDocuments = [...documents];
    updatedDocuments[index] = {
      ...updatedDocuments[index],
      uploaded,
      fileName
    };
    setDocuments(updatedDocuments);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    const propertyData = {
      name,
      type,
      address,
      city,
      state,
      postalCode,
      country,
      purchaseDate,
      purchaseValue: purchaseValue ? Number(purchaseValue) : 0,
      currentValue: currentValue ? Number(currentValue) : 0,
      landArea: landArea ? Number(landArea) : 0,
      builtArea: builtArea ? Number(builtArea) : 0,
      ownerName,
      ownerContact,
      ownerIdType,
      ownerIdNumber,
      marketValue: marketValue ? Number(marketValue) : 0,
      valuationDate,
      loanStatus,
      loanAmount: loanAmount ? Number(loanAmount) : 0,
      loanProvider,
      documents,
      notes
    };
    
    if (propertyToEdit) {
      onUpdateProperty({ ...propertyData, id: propertyToEdit.id });
    } else {
      onAddProperty(propertyData);
      resetForm();
    }
    
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const resetForm = () => {
    setName('');
    setType('Residential');
    setAddress('');
    setCity('');
    setState('');
    setPostalCode('');
    setCountry('');
    setPurchaseDate('');
    setPurchaseValue('');
    setCurrentValue('');
    setLandArea('');
    setBuiltArea('');
    setOwnerName('');
    setOwnerContact('');
    setOwnerIdType('');
    setOwnerIdNumber('');
    setMarketValue('');
    setValuationDate('');
    setLoanStatus('No Loan');
    setLoanAmount('');
    setLoanProvider('');
    setDocuments([
      { name: 'Deed Papers', uploaded: false, fileName: '' },
      { name: 'Tax Receipts', uploaded: false, fileName: '' },
      { name: 'Loan Documents', uploaded: false, fileName: '' },
      { name: 'Valuation Report', uploaded: false, fileName: '' }
    ]);
    setNotes('');
    setValidationErrors({});
  };

  const handleCancel = () => {
    if (propertyToEdit) {
      onCancelEdit();
    }
    resetForm();
  };

  const handleFileChange = (e, index) => {
    const fileName = e.target.files[0] ? e.target.files[0].name : '';
    handleDocumentChange(index, !!fileName, fileName);
  };

  return (
    <div>
      {showSuccess && (
        <Alert variant="success" onClose={() => setShowSuccess(false)} dismissible>
          {propertyToEdit 
            ? 'Property updated successfully!' 
            : 'Property added successfully!'}
        </Alert>
      )}

      <Form onSubmit={handleSubmit}>
        <h5 className="mb-3">Basic Information</h5>
        <Row>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Property Name*</Form.Label>
              <Form.Control 
                type="text" 
                value={name} 
                onChange={(e) => setName(e.target.value)}
                isInvalid={!!validationErrors.name}
              />
              <Form.Control.Feedback type="invalid">
                {validationErrors.name}
              </Form.Control.Feedback>
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Property Type*</Form.Label>
              <Form.Select 
                value={type} 
                onChange={(e) => setType(e.target.value)}
              >
                <option value="Residential">Residential</option>
                <option value="Commercial">Commercial</option>
                <option value="Land">Land</option>
                <option value="Industrial">Industrial</option>
                <option value="Agricultural">Agricultural</option>
                <option value="Other">Other</option>
              </Form.Select>
            </Form.Group>
          </Col>
        </Row>

        <h5 className="mb-3 mt-4">Property Address</h5>
        <Form.Group className="mb-3">
          <Form.Label>Street Address*</Form.Label>
          <Form.Control 
            type="text" 
            value={address} 
            onChange={(e) => setAddress(e.target.value)}
            isInvalid={!!validationErrors.address}
          />
          <Form.Control.Feedback type="invalid">
            {validationErrors.address}
          </Form.Control.Feedback>
        </Form.Group>

        <Row>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>City*</Form.Label>
              <Form.Control 
                type="text" 
                value={city} 
                onChange={(e) => setCity(e.target.value)}
                isInvalid={!!validationErrors.city}
              />
              <Form.Control.Feedback type="invalid">
                {validationErrors.city}
              </Form.Control.Feedback>
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>State/Province</Form.Label>
              <Form.Control 
                type="text" 
                value={state} 
                onChange={(e) => setState(e.target.value)}
              />
            </Form.Group>
          </Col>
        </Row>

        <Row>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Postal Code</Form.Label>
              <Form.Control 
                type="text" 
                value={postalCode} 
                onChange={(e) => setPostalCode(e.target.value)}
              />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Country</Form.Label>
              <Form.Control 
                type="text" 
                value={country} 
                onChange={(e) => setCountry(e.target.value)}
              />
            </Form.Group>
          </Col>
        </Row>

        <h5 className="mb-3 mt-4">Ownership Details</h5>
        <Row>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Owner's Name</Form.Label>
              <Form.Control 
                type="text" 
                value={ownerName} 
                onChange={(e) => setOwnerName(e.target.value)}
              />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Owner's Contact</Form.Label>
              <Form.Control 
                type="text" 
                value={ownerContact} 
                onChange={(e) => setOwnerContact(e.target.value)}
              />
            </Form.Group>
          </Col>
        </Row>

        <Row>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>ID Type</Form.Label>
              <Form.Select 
                value={ownerIdType} 
                onChange={(e) => setOwnerIdType(e.target.value)}
              >
                <option value="">Select ID Type</option>
                <option value="Passport">Passport</option>
                <option value="Driver's License">Driver's License</option>
                <option value="National ID">National ID</option>
                <option value="Social Security">Social Security</option>
                <option value="Other">Other</option>
              </Form.Select>
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>ID Number</Form.Label>
              <Form.Control 
                type="text" 
                value={ownerIdNumber} 
                onChange={(e) => setOwnerIdNumber(e.target.value)}
              />
            </Form.Group>
          </Col>
        </Row>

        <h5 className="mb-3 mt-4">Property Valuation</h5>
        <Row>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Purchase Date*</Form.Label>
              <Form.Control 
                type="date" 
                value={purchaseDate} 
                onChange={(e) => setPurchaseDate(e.target.value)}
                isInvalid={!!validationErrors.purchaseDate}
              />
              <Form.Control.Feedback type="invalid">
                {validationErrors.purchaseDate}
              </Form.Control.Feedback>
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Purchase Value ($)</Form.Label>
              <Form.Control 
                type="number" 
                value={purchaseValue} 
                onChange={(e) => setPurchaseValue(e.target.value)}
                isInvalid={!!validationErrors.purchaseValue}
              />
              <Form.Control.Feedback type="invalid">
                {validationErrors.purchaseValue}
              </Form.Control.Feedback>
            </Form.Group>
          </Col>
        </Row>

        <Row>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Current Market Value ($)</Form.Label>
              <Form.Control 
                type="number" 
                value={marketValue} 
                onChange={(e) => setMarketValue(e.target.value)}
                isInvalid={!!validationErrors.marketValue}
              />
              <Form.Control.Feedback type="invalid">
                {validationErrors.marketValue}
              </Form.Control.Feedback>
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Valuation Date</Form.Label>
              <Form.Control 
                type="date" 
                value={valuationDate} 
                onChange={(e) => setValuationDate(e.target.value)}
              />
            </Form.Group>
          </Col>
        </Row>

        <h5 className="mb-3 mt-4">Property Dimensions</h5>
        <Row>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Land Area (sq.ft)</Form.Label>
              <Form.Control 
                type="number" 
                value={landArea} 
                onChange={(e) => setLandArea(e.target.value)}
                isInvalid={!!validationErrors.landArea}
              />
              <Form.Control.Feedback type="invalid">
                {validationErrors.landArea}
              </Form.Control.Feedback>
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Built-Up Area (sq.ft)</Form.Label>
              <Form.Control 
                type="number" 
                value={builtArea} 
                onChange={(e) => setBuiltArea(e.target.value)}
                isInvalid={!!validationErrors.builtArea}
              />
              <Form.Control.Feedback type="invalid">
                {validationErrors.builtArea}
              </Form.Control.Feedback>
            </Form.Group>
          </Col>
        </Row>

        <h5 className="mb-3 mt-4">Loan Details</h5>
        <Row>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Loan Status</Form.Label>
              <Form.Select 
                value={loanStatus} 
                onChange={(e) => setLoanStatus(e.target.value)}
              >
                <option value="No Loan">No Loan</option>
                <option value="Active">Active</option>
                <option value="Paid Off">Paid Off</option>
              </Form.Select>
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Loan Amount ($)</Form.Label>
              <Form.Control 
                type="number" 
                value={loanAmount} 
                onChange={(e) => setLoanAmount(e.target.value)}
                disabled={loanStatus === 'No Loan'}
                isInvalid={!!validationErrors.loanAmount}
              />
              <Form.Control.Feedback type="invalid">
                {validationErrors.loanAmount}
              </Form.Control.Feedback>
            </Form.Group>
          </Col>
        </Row>

        <Form.Group className="mb-3">
          <Form.Label>Loan Provider</Form.Label>
          <Form.Control 
            type="text" 
            value={loanProvider} 
            onChange={(e) => setLoanProvider(e.target.value)}
            disabled={loanStatus === 'No Loan'}
            isInvalid={!!validationErrors.loanProvider}
          />
          <Form.Control.Feedback type="invalid">
            {validationErrors.loanProvider}
          </Form.Control.Feedback>
        </Form.Group>

        <h5 className="mb-3 mt-4">Documents</h5>
        <Row>
          {documents.map((doc, index) => (
            <Col md={6} key={index} className="mb-3">
              <Form.Group>
                <Form.Label>{doc.name}</Form.Label>
                <div className="d-flex align-items-center">
                  <Form.Control 
                    type="file" 
                    onChange={(e) => handleFileChange(e, index)}
                    className="me-2"
                  />
                  {doc.uploaded && (
                    <span className="text-success small">
                      <i className="fas fa-check-circle me-1"></i>
                      {doc.fileName}
                    </span>
                  )}
                </div>
              </Form.Group>
            </Col>
          ))}
        </Row>

        <Form.Group className="mb-3 mt-3">
          <Form.Label>Additional Notes</Form.Label>
          <Form.Control 
            as="textarea" 
            rows={3} 
            value={notes} 
            onChange={(e) => setNotes(e.target.value)}
          />
        </Form.Group>

        <div className="d-flex justify-content-between mt-4">
          <Button variant="secondary" onClick={handleCancel}>
            {propertyToEdit ? 'Cancel' : 'Reset'}
          </Button>
          <Button variant="primary" type="submit">
            {propertyToEdit ? 'Update Property' : 'Add Property'}
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default PropertyForm; 