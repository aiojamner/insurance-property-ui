import React from 'react';
import { Table, Alert, Badge, Button, Card, Row, Col } from 'react-bootstrap';

const NomineeList = ({ nominees, onEditNominee }) => {
  if (nominees.length === 0) {
    return (
      <Alert variant="info">
        <i className="fas fa-info-circle me-2"></i>
        You haven't added any nominees yet. Please add your first nominee using the form.
      </Alert>
    );
  }

  // Calculate age from date of birth
  const calculateAge = (dateOfBirth) => {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age;
  };

  // Responsive design: cards for mobile, table for larger screens
  const renderMobileView = () => {
    return (
      <div className="d-md-none">
        {nominees.map((nominee) => (
          <Card key={nominee.id} className="mb-3 nominee-card">
            <Card.Header className="d-flex justify-content-between align-items-center">
              <span className="fw-bold">{nominee.name}</span>
              <Badge bg="secondary" pill>
                {nominee.relationship}
              </Badge>
            </Card.Header>
            <Card.Body>
              <Row className="mb-2">
                <Col xs={4} className="text-muted">Age:</Col>
                <Col xs={8}>{calculateAge(nominee.dateOfBirth)} years</Col>
              </Row>
              <Row className="mb-2">
                <Col xs={4} className="text-muted">Contact:</Col>
                <Col xs={8}>{nominee.contactNumber}</Col>
              </Row>
              <Row className="mb-2">
                <Col xs={4} className="text-muted">Email:</Col>
                <Col xs={8}>{nominee.email}</Col>
              </Row>
              <Row className="mb-2">
                <Col xs={4} className="text-muted">Property:</Col>
                <Col xs={8}>{nominee.propertyName}</Col>
              </Row>
              <Row className="mb-2">
                <Col xs={4} className="text-muted">Policy:</Col>
                <Col xs={8}>{nominee.insurancePolicy}</Col>
              </Row>
              <Row className="mb-2">
                <Col xs={4} className="text-muted">Share:</Col>
                <Col xs={8}><Badge bg="info">{nominee.sharePercentage}%</Badge></Col>
              </Row>
              <Row className="mt-3">
                <Col xs={12}>
                  <Button 
                    variant="outline-warning" 
                    size="sm" 
                    className="w-100"
                    onClick={() => onEditNominee(nominee)}
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
              <th>Nominee</th>
              <th>Property & Insurance</th>
              <th>Contact</th>
              <th>Share %</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {nominees.map((nominee, index) => (
              <tr key={nominee.id}>
                <td>{index + 1}</td>
                <td>
                  <div>
                    <strong>{nominee.name}</strong> 
                    <Badge bg="secondary" className="ms-2" pill>
                      {calculateAge(nominee.dateOfBirth)} yrs
                    </Badge>
                  </div>
                  <div className="small text-muted">{nominee.relationship}</div>
                </td>
                <td>
                  <div><strong>{nominee.propertyName}</strong></div>
                  <div className="small text-muted">Policy: {nominee.insurancePolicy}</div>
                </td>
                <td>
                  <div>{nominee.contactNumber}</div>
                  <div className="small text-muted">{nominee.email}</div>
                  <div className="small text-muted text-truncate" style={{ maxWidth: '150px' }}>
                    {nominee.address}
                  </div>
                </td>
                <td>
                  <Badge bg="info">{nominee.sharePercentage}%</Badge>
                </td>
                <td>
                  <Button 
                    variant="outline-warning" 
                    size="sm"
                    onClick={() => onEditNominee(nominee)}
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

export default NomineeList; 