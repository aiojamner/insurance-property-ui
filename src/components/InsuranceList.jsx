import React from 'react';
import { Table, Badge, Alert, Button, Card, Row, Col } from 'react-bootstrap';

const InsuranceList = ({ insurances, onEditInsurance }) => {
  // Format currency
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(value);
  };

  // Get badge color based on insurance type
  const getBadgeColor = (type) => {
    switch (type) {
      case 'property':
        return 'primary';
      case 'liability':
        return 'info';
      case 'fire':
        return 'danger';
      case 'flood':
        return 'warning';
      case 'earthquake':
        return 'dark';
      default:
        return 'secondary';
    }
  };

  // Format the type name
  const formatType = (type) => {
    return type.charAt(0).toUpperCase() + type.slice(1);
  };

  if (insurances.length === 0) {
    return (
      <Alert variant="info">
        <i className="fas fa-info-circle me-2"></i>
        You haven't added any insurance policies yet. Please add your first policy using the form.
      </Alert>
    );
  }

  // Responsive design: cards for mobile, table for larger screens
  const renderMobileView = () => {
    return (
      <div className="d-md-none">
        {insurances.map((insurance) => (
          <Card key={insurance.id} className="mb-3 insurance-card">
            <Card.Header className="d-flex justify-content-between align-items-center">
              <span className="fw-bold">{insurance.policyNumber}</span>
              <Badge bg={getBadgeColor(insurance.type)} pill>
                {formatType(insurance.type)}
              </Badge>
            </Card.Header>
            <Card.Body>
              <Row className="mb-2">
                <Col xs={4} className="text-muted">Provider:</Col>
                <Col xs={8}>{insurance.provider}</Col>
              </Row>
              <Row className="mb-2">
                <Col xs={4} className="text-muted">Property:</Col>
                <Col xs={8}>{insurance.propertyName}</Col>
              </Row>
              <Row className="mb-2">
                <Col xs={4} className="text-muted">Coverage:</Col>
                <Col xs={8}>{formatCurrency(insurance.coverageAmount)}</Col>
              </Row>
              <Row className="mb-2">
                <Col xs={4} className="text-muted">Premium:</Col>
                <Col xs={8}>{formatCurrency(insurance.premium)}</Col>
              </Row>
              <Row>
                <Col xs={4} className="text-muted">Valid:</Col>
                <Col xs={8}>
                  {new Date(insurance.startDate).toLocaleDateString()} to {new Date(insurance.endDate).toLocaleDateString()}
                </Col>
              </Row>
              <Row className="mt-3">
                <Col xs={12}>
                  <Button 
                    variant="outline-success" 
                    size="sm" 
                    className="w-100"
                    onClick={() => onEditInsurance(insurance)}
                  >
                    <i className="fas fa-edit me-1"></i> Edit
                  </Button>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        ))}
      </div>
    );
  };

  // Table view for larger screens
  const renderTableView = () => {
    return (
      <div className="table-responsive d-none d-md-block">
        <Table striped hover className="mb-0">
          <thead>
            <tr>
              <th>#</th>
              <th>Policy Details</th>
              <th>Property</th>
              <th>Coverage</th>
              <th>Duration</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {insurances.map((insurance, index) => (
              <tr key={insurance.id}>
                <td>{index + 1}</td>
                <td>
                  <div><strong>{insurance.policyNumber}</strong></div>
                  <div className="small text-muted">{insurance.provider}</div>
                  <Badge bg={getBadgeColor(insurance.type)} className="mt-1">
                    {formatType(insurance.type)}
                  </Badge>
                </td>
                <td>{insurance.propertyName}</td>
                <td>
                  <div><strong>{formatCurrency(insurance.coverageAmount)}</strong></div>
                  <div className="small text-muted">
                    Premium: {formatCurrency(insurance.premium)}
                  </div>
                </td>
                <td>
                  <div>{new Date(insurance.startDate).toLocaleDateString()}</div>
                  <div className="small text-muted">
                    to {new Date(insurance.endDate).toLocaleDateString()}
                  </div>
                </td>
                <td>
                  <Button 
                    variant="outline-success" 
                    size="sm"
                    onClick={() => onEditInsurance(insurance)}
                  >
                    <i className="fas fa-edit"></i>
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
    );
  };

  return (
    <>
      {renderMobileView()}
      {renderTableView()}
    </>
  );
};

export default InsuranceList; 