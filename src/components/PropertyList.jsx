import React, { useState } from 'react';
import { Table, Card, Button, Badge, Row, Col, Accordion, Alert } from 'react-bootstrap';
import { formatCurrency } from '../utils/formatters';

const PropertyList = ({ properties, onEditProperty }) => {
  const [expandedProperty, setExpandedProperty] = useState(null);

  const togglePropertyDetails = (propertyId) => {
    if (expandedProperty === propertyId) {
      setExpandedProperty(null);
    } else {
      setExpandedProperty(propertyId);
    }
  };

  const getPropertyTypeBadge = (type) => {
    const badgeColors = {
      'Residential': 'success',
      'Commercial': 'primary',
      'Land': 'info',
      'Industrial': 'secondary',
      'Agricultural': 'warning',
      'Other': 'dark'
    };
    
    return <Badge bg={badgeColors[type] || 'secondary'}>{type}</Badge>;
  };

  const getLoanStatusBadge = (status) => {
    const badgeColors = {
      'No Loan': 'success',
      'Active': 'warning',
      'Paid Off': 'info'
    };
    
    return <Badge bg={badgeColors[status] || 'secondary'}>{status}</Badge>;
  };

  if (!properties || properties.length === 0) {
    return (
      <Alert variant="info">
        <i className="fas fa-info-circle me-2"></i>
        No properties added yet. Please add your first property.
      </Alert>
    );
  }

  return (
    <div className="property-list">
      {properties.map(property => (
        <Card key={property.id} className="mb-3 property-card">
          <Card.Header className="d-flex justify-content-between align-items-center">
            <div>
              <h5 className="mb-0">{property.name}</h5>
              <div className="mt-1">
                {getPropertyTypeBadge(property.type)}
                {property.loanStatus && (
                  <span className="ms-2">{getLoanStatusBadge(property.loanStatus)}</span>
                )}
              </div>
            </div>
            <div>
              <Button 
                variant="outline-primary" 
                size="sm" 
                className="me-2"
                onClick={() => togglePropertyDetails(property.id)}
              >
                <i className={`fas ${expandedProperty === property.id ? 'fa-chevron-up' : 'fa-chevron-down'} me-1`}></i>
                {expandedProperty === property.id ? 'Hide Details' : 'View Details'}
              </Button>
              <Button 
                variant="outline-secondary" 
                size="sm"
                onClick={() => onEditProperty(property)}
              >
                <i className="fas fa-edit me-1"></i>
                Edit
              </Button>
            </div>
          </Card.Header>
          
          {expandedProperty === property.id && (
            <Card.Body>
              <Row className="mb-3">
                <Col md={6}>
                  <h6 className="mb-2">
                    <i className="fas fa-map-marker-alt me-2 text-primary"></i>
                    Address
                  </h6>
                  <p className="mb-1">{property.address}</p>
                  <p className="mb-1">
                    {property.city}{property.state ? `, ${property.state}` : ''}
                    {property.postalCode ? ` - ${property.postalCode}` : ''}
                  </p>
                  <p>{property.country}</p>
                </Col>
                <Col md={6}>
                  <h6 className="mb-2">
                    <i className="fas fa-money-bill-wave me-2 text-success"></i>
                    Valuation
                  </h6>
                  <Table size="sm" borderless className="mb-0">
                    <tbody>
                      <tr>
                        <td className="text-muted">Purchase Value:</td>
                        <td className="fw-bold">{formatCurrency(property.purchaseValue)}</td>
                      </tr>
                      <tr>
                        <td className="text-muted">Current Market Value:</td>
                        <td className="fw-bold">{formatCurrency(property.marketValue || property.currentValue)}</td>
                      </tr>
                      <tr>
                        <td className="text-muted">Purchase Date:</td>
                        <td>{new Date(property.purchaseDate).toLocaleDateString()}</td>
                      </tr>
                      {property.valuationDate && (
                        <tr>
                          <td className="text-muted">Last Valuation:</td>
                          <td>{new Date(property.valuationDate).toLocaleDateString()}</td>
                        </tr>
                      )}
                    </tbody>
                  </Table>
                </Col>
              </Row>
              
              <Accordion flush>
                <Accordion.Item eventKey="0">
                  <Accordion.Header>
                    <i className="fas fa-info-circle me-2"></i>
                    Additional Details
                  </Accordion.Header>
                  <Accordion.Body>
                    <Row>
                      <Col md={6}>
                        <h6 className="mb-2">Property Dimensions</h6>
                        <Table size="sm" borderless>
                          <tbody>
                            <tr>
                              <td className="text-muted">Land Area:</td>
                              <td>{property.landArea ? `${property.landArea} sq.ft` : 'Not specified'}</td>
                            </tr>
                            <tr>
                              <td className="text-muted">Built-Up Area:</td>
                              <td>{property.builtArea ? `${property.builtArea} sq.ft` : 'Not specified'}</td>
                            </tr>
                          </tbody>
                        </Table>
                      </Col>
                      <Col md={6}>
                        <h6 className="mb-2">Ownership Details</h6>
                        <Table size="sm" borderless>
                          <tbody>
                            <tr>
                              <td className="text-muted">Owner Name:</td>
                              <td>{property.ownerName || 'Not specified'}</td>
                            </tr>
                            {property.ownerContact && (
                              <tr>
                                <td className="text-muted">Contact:</td>
                                <td>{property.ownerContact}</td>
                              </tr>
                            )}
                            {property.ownerIdType && (
                              <tr>
                                <td className="text-muted">ID Type:</td>
                                <td>{property.ownerIdType}</td>
                              </tr>
                            )}
                          </tbody>
                        </Table>
                      </Col>
                    </Row>
                    
                    {property.loanStatus === 'Active' && (
                      <div className="mt-3">
                        <h6 className="mb-2">Loan Information</h6>
                        <Table size="sm" borderless>
                          <tbody>
                            <tr>
                              <td className="text-muted">Loan Amount:</td>
                              <td>{formatCurrency(property.loanAmount)}</td>
                            </tr>
                            <tr>
                              <td className="text-muted">Provider:</td>
                              <td>{property.loanProvider}</td>
                            </tr>
                          </tbody>
                        </Table>
                      </div>
                    )}
                    
                    {property.documents && property.documents.some(doc => doc.uploaded) && (
                      <div className="mt-3">
                        <h6 className="mb-2">Uploaded Documents</h6>
                        <ul className="list-unstyled">
                          {property.documents
                            .filter(doc => doc.uploaded)
                            .map((doc, index) => (
                              <li key={index} className="mb-1">
                                <i className="fas fa-file-alt me-2 text-primary"></i>
                                <span className="text-muted">{doc.name}:</span> {doc.fileName}
                              </li>
                            ))}
                        </ul>
                      </div>
                    )}
                    
                    {property.notes && (
                      <div className="mt-3">
                        <h6 className="mb-2">Notes</h6>
                        <p>{property.notes}</p>
                      </div>
                    )}
                  </Accordion.Body>
                </Accordion.Item>
              </Accordion>
            </Card.Body>
          )}
        </Card>
      ))}
    </div>
  );
};

export default PropertyList; 