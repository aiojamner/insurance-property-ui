import React, { useState } from 'react';
import { Button, Card, Form, Row, Col, Alert } from 'react-bootstrap';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

const DocumentGenerator = ({ properties, insurances, nominees }) => {
  const [documentType, setDocumentType] = useState('propertyReport');
  const [selectedProperty, setSelectedProperty] = useState('');
  const [selectedInsurance, setSelectedInsurance] = useState('');
  const [selectedNominee, setSelectedNominee] = useState('');
  const [generating, setGenerating] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [documentData, setDocumentData] = useState(null);
  const [documentTitle, setDocumentTitle] = useState('');

  // Handle document type change
  const handleDocumentTypeChange = (e) => {
    setDocumentType(e.target.value);
    setSelectedProperty('');
    setSelectedInsurance('');
    setSelectedNominee('');
    setShowPreview(false);
  };

  // Handle selection changes
  const handlePropertyChange = (e) => {
    setSelectedProperty(e.target.value);
  };

  const handleInsuranceChange = (e) => {
    setSelectedInsurance(e.target.value);
  };

  const handleNomineeChange = (e) => {
    setSelectedNominee(e.target.value);
  };

  // Generate document preview data
  const generateDocumentPreview = () => {
    setGenerating(true);
    let data = null;
    let title = '';

    switch (documentType) {
      case 'propertyReport':
        if (selectedProperty) {
          const property = properties.find(p => p.id === parseInt(selectedProperty));
          if (property) {
            data = property;
            title = `Property Report - ${property.name}`;
          }
        } else {
          data = properties;
          title = 'Complete Property Report';
        }
        break;
      
      case 'insuranceReport':
        if (selectedInsurance) {
          const insurance = insurances.find(i => i.id === parseInt(selectedInsurance));
          if (insurance) {
            data = insurance;
            title = `Insurance Report - ${insurance.policyNumber}`;
          }
        } else if (selectedProperty) {
          const property = properties.find(p => p.id === parseInt(selectedProperty));
          const propertyInsurances = insurances.filter(i => i.propertyId === parseInt(selectedProperty));
          if (property && propertyInsurances.length > 0) {
            data = { property, insurances: propertyInsurances };
            title = `Insurance Report for ${property.name}`;
          }
        } else {
          data = insurances;
          title = 'Complete Insurance Report';
        }
        break;
      
      case 'nomineeReport':
        if (selectedNominee) {
          const nominee = nominees.find(n => n.id === parseInt(selectedNominee));
          if (nominee) {
            data = nominee;
            title = `Nominee Report - ${nominee.name}`;
          }
        } else {
          data = nominees;
          title = 'Complete Nominee Report';
        }
        break;
      
      case 'summaryReport':
        data = {
          properties,
          insurances,
          nominees
        };
        title = 'Complete Summary Report';
        break;
        
      default:
        break;
    }

    setDocumentData(data);
    setDocumentTitle(title);
    setShowPreview(true);
    setGenerating(false);
  };

  // Handle print document
  const handlePrintDocument = () => {
    const printContent = document.getElementById('document-preview');
    const originalContents = document.body.innerHTML;
    
    document.body.innerHTML = `
      <div style="padding: 20px;">
        <h1 style="text-align: center; margin-bottom: 20px;">${documentTitle}</h1>
        ${printContent.innerHTML}
        <div style="margin-top: 30px; font-size: 12px; text-align: center;">
          <p>Generated on ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}</p>
          <p>© 2023 Personal Asset Management</p>
        </div>
      </div>
    `;
    
    window.print();
    document.body.innerHTML = originalContents;
    window.location.reload(); // Reload the page after printing
  };

  // Handle download as PDF
  const handleDownloadPDF = () => {
    const input = document.getElementById('document-preview');
    
    html2canvas(input, { scale: 2 }).then(canvas => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
      const imgX = (pdfWidth - imgWidth * ratio) / 2;
      const imgY = 30;
      
      // Add title to PDF
      pdf.setFontSize(20);
      pdf.text(documentTitle, pdfWidth / 2, 15, { align: 'center' });
      
      // Add image to PDF
      pdf.addImage(imgData, 'PNG', imgX, imgY, imgWidth * ratio, imgHeight * ratio);
      
      // Add footer to PDF
      pdf.setFontSize(10);
      pdf.text(`Generated on ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}`, pdfWidth / 2, pdfHeight - 15, { align: 'center' });
      pdf.text('© 2023 Personal Asset Management', pdfWidth / 2, pdfHeight - 10, { align: 'center' });
      
      // Download PDF
      pdf.save(`${documentTitle.replace(/\s+/g, '_')}.pdf`);
    });
  };

  // Render property report
  const renderPropertyReport = (data) => {
    if (Array.isArray(data)) {
      return (
        <div>
          <h3 className="mb-4">Property List</h3>
          {data.length === 0 ? (
            <Alert variant="info">No properties added yet.</Alert>
          ) : (
            data.map(property => (
              <Card key={property.id} className="mb-3">
                <Card.Header className="bg-primary text-white">
                  <h5 className="mb-0">{property.name}</h5>
                </Card.Header>
                <Card.Body>
                  <Row>
                    <Col md={6}>
                      <p><strong>Type:</strong> {property.type}</p>
                      <p><strong>Address:</strong> {property.address}</p>
                      <p><strong>City:</strong> {property.city}</p>
                    </Col>
                    <Col md={6}>
                      <p><strong>Purchase Date:</strong> {new Date(property.purchaseDate).toLocaleDateString()}</p>
                      <p><strong>Purchase Value:</strong> ${property.purchaseValue}</p>
                      <p><strong>Current Value:</strong> ${property.currentValue}</p>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            ))
          )}
        </div>
      );
    } else {
      // Single property report
      return (
        <div>
          <h3 className="mb-4">Property Details</h3>
          <Card>
            <Card.Header className="bg-primary text-white">
              <h5 className="mb-0">{data.name}</h5>
            </Card.Header>
            <Card.Body>
              <Row>
                <Col md={6}>
                  <p><strong>Type:</strong> {data.type}</p>
                  <p><strong>Address:</strong> {data.address}</p>
                  <p><strong>City:</strong> {data.city}</p>
                  <p><strong>State:</strong> {data.state}</p>
                  <p><strong>Postal Code:</strong> {data.postalCode}</p>
                </Col>
                <Col md={6}>
                  <p><strong>Purchase Date:</strong> {new Date(data.purchaseDate).toLocaleDateString()}</p>
                  <p><strong>Purchase Value:</strong> ${data.purchaseValue}</p>
                  <p><strong>Current Value:</strong> ${data.currentValue}</p>
                  <p><strong>Land Area:</strong> {data.landArea} sq.ft</p>
                  <p><strong>Built Area:</strong> {data.builtArea} sq.ft</p>
                </Col>
              </Row>
              <div className="mt-3">
                <strong>Additional Notes:</strong>
                <p>{data.notes || 'No additional notes.'}</p>
              </div>
            </Card.Body>
          </Card>
        </div>
      );
    }
  };

  // Render insurance report
  const renderInsuranceReport = (data) => {
    if (Array.isArray(data)) {
      return (
        <div>
          <h3 className="mb-4">Insurance Policies</h3>
          {data.length === 0 ? (
            <Alert variant="info">No insurance policies added yet.</Alert>
          ) : (
            data.map(insurance => (
              <Card key={insurance.id} className="mb-3">
                <Card.Header className="bg-success text-white">
                  <h5 className="mb-0">
                    {insurance.type} Insurance - {insurance.policyNumber}
                  </h5>
                </Card.Header>
                <Card.Body>
                  <Row>
                    <Col md={6}>
                      <p><strong>Provider:</strong> {insurance.provider}</p>
                      <p><strong>Property:</strong> {insurance.propertyName}</p>
                      <p><strong>Coverage Amount:</strong> ${insurance.coverageAmount}</p>
                    </Col>
                    <Col md={6}>
                      <p><strong>Premium:</strong> ${insurance.premium} ({insurance.premiumFrequency})</p>
                      <p><strong>Start Date:</strong> {new Date(insurance.startDate).toLocaleDateString()}</p>
                      <p><strong>End Date:</strong> {new Date(insurance.endDate).toLocaleDateString()}</p>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            ))
          )}
        </div>
      );
    } else if (data && data.property) {
      // Property-specific insurance report
      return (
        <div>
          <h3 className="mb-4">Insurance Policies for {data.property.name}</h3>
          {data.insurances.length === 0 ? (
            <Alert variant="info">No insurance policies for this property.</Alert>
          ) : (
            data.insurances.map(insurance => (
              <Card key={insurance.id} className="mb-3">
                <Card.Header className="bg-success text-white">
                  <h5 className="mb-0">
                    {insurance.type} Insurance - {insurance.policyNumber}
                  </h5>
                </Card.Header>
                <Card.Body>
                  <Row>
                    <Col md={6}>
                      <p><strong>Provider:</strong> {insurance.provider}</p>
                      <p><strong>Coverage Amount:</strong> ${insurance.coverageAmount}</p>
                      <p><strong>Premium:</strong> ${insurance.premium} ({insurance.premiumFrequency})</p>
                    </Col>
                    <Col md={6}>
                      <p><strong>Start Date:</strong> {new Date(insurance.startDate).toLocaleDateString()}</p>
                      <p><strong>End Date:</strong> {new Date(insurance.endDate).toLocaleDateString()}</p>
                      <p><strong>Next Payment:</strong> {insurance.nextPaymentDate ? new Date(insurance.nextPaymentDate).toLocaleDateString() : 'Not specified'}</p>
                    </Col>
                  </Row>
                  <div className="mt-3">
                    <strong>Coverage Details:</strong>
                    <p>{insurance.coverageDetails || 'No additional details.'}</p>
                  </div>
                </Card.Body>
              </Card>
            ))
          )}
        </div>
      );
    } else {
      // Single insurance report
      return (
        <div>
          <h3 className="mb-4">Insurance Policy Details</h3>
          <Card>
            <Card.Header className="bg-success text-white">
              <h5 className="mb-0">
                {data.type} Insurance - {data.policyNumber}
              </h5>
            </Card.Header>
            <Card.Body>
              <Row>
                <Col md={6}>
                  <p><strong>Provider:</strong> {data.provider}</p>
                  <p><strong>Property:</strong> {data.propertyName}</p>
                  <p><strong>Coverage Amount:</strong> ${data.coverageAmount}</p>
                  <p><strong>Premium:</strong> ${data.premium} ({data.premiumFrequency})</p>
                </Col>
                <Col md={6}>
                  <p><strong>Start Date:</strong> {new Date(data.startDate).toLocaleDateString()}</p>
                  <p><strong>End Date:</strong> {new Date(data.endDate).toLocaleDateString()}</p>
                  <p><strong>Next Payment:</strong> {data.nextPaymentDate ? new Date(data.nextPaymentDate).toLocaleDateString() : 'Not specified'}</p>
                  <p><strong>Status:</strong> {new Date(data.endDate) > new Date() ? 'Active' : 'Expired'}</p>
                </Col>
              </Row>
              <div className="mt-3">
                <strong>Coverage Details:</strong>
                <p>{data.coverageDetails || 'No additional details.'}</p>
              </div>
            </Card.Body>
          </Card>
        </div>
      );
    }
  };

  // Render nominee report
  const renderNomineeReport = (data) => {
    if (Array.isArray(data)) {
      return (
        <div>
          <h3 className="mb-4">Nominees List</h3>
          {data.length === 0 ? (
            <Alert variant="info">No nominees added yet.</Alert>
          ) : (
            data.map(nominee => (
              <Card key={nominee.id} className="mb-3">
                <Card.Header className="bg-warning text-dark">
                  <h5 className="mb-0">{nominee.name}</h5>
                </Card.Header>
                <Card.Body>
                  <Row>
                    <Col md={6}>
                      <p><strong>Relationship:</strong> {nominee.relationship}</p>
                      <p><strong>Contact:</strong> {nominee.contact}</p>
                      <p><strong>Email:</strong> {nominee.email}</p>
                    </Col>
                    <Col md={6}>
                      <p><strong>Property:</strong> {nominee.propertyName}</p>
                      <p><strong>Insurance:</strong> {nominee.insuranceName || 'N/A'}</p>
                      <p><strong>Share Percentage:</strong> {nominee.sharePercentage}%</p>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            ))
          )}
        </div>
      );
    } else {
      // Single nominee report
      return (
        <div>
          <h3 className="mb-4">Nominee Details</h3>
          <Card>
            <Card.Header className="bg-warning text-dark">
              <h5 className="mb-0">{data.name}</h5>
            </Card.Header>
            <Card.Body>
              <Row>
                <Col md={6}>
                  <p><strong>Relationship:</strong> {data.relationship}</p>
                  <p><strong>Contact:</strong> {data.contact}</p>
                  <p><strong>Email:</strong> {data.email}</p>
                  <p><strong>Address:</strong> {data.address}</p>
                </Col>
                <Col md={6}>
                  <p><strong>Property:</strong> {data.propertyName}</p>
                  <p><strong>Insurance:</strong> {data.insuranceName || 'N/A'}</p>
                  <p><strong>Share Percentage:</strong> {data.sharePercentage}%</p>
                  <p><strong>Added Date:</strong> {data.addedDate ? new Date(data.addedDate).toLocaleDateString() : new Date().toLocaleDateString()}</p>
                </Col>
              </Row>
              <div className="mt-3">
                <strong>Additional Details:</strong>
                <p>{data.additionalDetails || 'No additional details.'}</p>
              </div>
            </Card.Body>
          </Card>
        </div>
      );
    }
  };

  // Render summary report
  const renderSummaryReport = (data) => {
    return (
      <div>
        <h3 className="mb-4">Asset Management Summary Report</h3>
        
        <Card className="mb-4">
          <Card.Header className="bg-primary text-white">
            <h5 className="mb-0">Properties Summary</h5>
          </Card.Header>
          <Card.Body>
            <p><strong>Total Properties:</strong> {data.properties.length}</p>
            <p><strong>Total Property Value:</strong> ${data.properties.reduce((sum, prop) => sum + parseFloat(prop.currentValue || 0), 0).toFixed(2)}</p>
            {data.properties.length > 0 && (
              <div className="mt-3">
                <h6>Property Distribution:</h6>
                <ul>
                  {Array.from(new Set(data.properties.map(p => p.type))).map(type => (
                    <li key={type}>
                      {type}: {data.properties.filter(p => p.type === type).length} properties
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </Card.Body>
        </Card>
        
        <Card className="mb-4">
          <Card.Header className="bg-success text-white">
            <h5 className="mb-0">Insurance Summary</h5>
          </Card.Header>
          <Card.Body>
            <p><strong>Total Policies:</strong> {data.insurances.length}</p>
            <p><strong>Total Coverage Amount:</strong> ${data.insurances.reduce((sum, ins) => sum + parseFloat(ins.coverageAmount || 0), 0).toFixed(2)}</p>
            <p><strong>Total Annual Premium:</strong> ${data.insurances.reduce((sum, ins) => {
              let premium = parseFloat(ins.premium || 0);
              switch (ins.premiumFrequency) {
                case 'Monthly': premium *= 12; break;
                case 'Quarterly': premium *= 4; break;
                case 'Semi-Annual': premium *= 2; break;
                default: break;
              }
              return sum + premium;
            }, 0).toFixed(2)}</p>
            
            {data.insurances.length > 0 && (
              <div className="mt-3">
                <h6>Policies Expiring Soon:</h6>
                {data.insurances.filter(ins => {
                  const today = new Date();
                  const endDate = new Date(ins.endDate);
                  const daysRemaining = Math.ceil((endDate - today) / (1000 * 60 * 60 * 24));
                  return daysRemaining > 0 && daysRemaining <= 90;
                }).length > 0 ? (
                  <ul>
                    {data.insurances.filter(ins => {
                      const today = new Date();
                      const endDate = new Date(ins.endDate);
                      const daysRemaining = Math.ceil((endDate - today) / (1000 * 60 * 60 * 24));
                      return daysRemaining > 0 && daysRemaining <= 90;
                    }).map(ins => (
                      <li key={ins.id}>
                        {ins.type} Insurance ({ins.policyNumber}) for {ins.propertyName} - Expires on {new Date(ins.endDate).toLocaleDateString()}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p>No policies expiring in the next 90 days.</p>
                )}
              </div>
            )}
          </Card.Body>
        </Card>
        
        <Card>
          <Card.Header className="bg-warning text-dark">
            <h5 className="mb-0">Nominees Summary</h5>
          </Card.Header>
          <Card.Body>
            <p><strong>Total Nominees:</strong> {data.nominees.length}</p>
            
            {data.nominees.length > 0 && (
              <div className="mt-3">
                <h6>Nominees by Relationship:</h6>
                <ul>
                  {Array.from(new Set(data.nominees.map(n => n.relationship))).map(rel => (
                    <li key={rel}>
                      {rel}: {data.nominees.filter(n => n.relationship === rel).length} nominees
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </Card.Body>
        </Card>
      </div>
    );
  };

  // Render the document preview based on the document type
  const renderDocumentPreview = () => {
    if (!documentData) return null;

    switch (documentType) {
      case 'propertyReport':
        return renderPropertyReport(documentData);
      case 'insuranceReport':
        return renderInsuranceReport(documentData);
      case 'nomineeReport':
        return renderNomineeReport(documentData);
      case 'summaryReport':
        return renderSummaryReport(documentData);
      default:
        return null;
    }
  };

  return (
    <div className="document-generator">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h5 className="mb-0">
          <i className="fas fa-file-alt me-2"></i>
          Document Generator
        </h5>
      </div>

      <Row>
        <Col lg={showPreview ? 4 : 12}>
          <Card className="mb-4">
            <Card.Header className="bg-info text-white">
              <h6 className="mb-0">Document Options</h6>
            </Card.Header>
            <Card.Body>
              <Form.Group className="mb-3">
                <Form.Label>Document Type</Form.Label>
                <Form.Select 
                  value={documentType}
                  onChange={handleDocumentTypeChange}
                >
                  <option value="propertyReport">Property Report</option>
                  <option value="insuranceReport">Insurance Report</option>
                  <option value="nomineeReport">Nominee Report</option>
                  <option value="summaryReport">Summary Report</option>
                </Form.Select>
              </Form.Group>

              {documentType === 'propertyReport' && (
                <Form.Group className="mb-3">
                  <Form.Label>Select Property (Optional)</Form.Label>
                  <Form.Select 
                    value={selectedProperty}
                    onChange={handlePropertyChange}
                  >
                    <option value="">All Properties</option>
                    {properties.map(property => (
                      <option key={property.id} value={property.id}>{property.name}</option>
                    ))}
                  </Form.Select>
                  <Form.Text className="text-muted">
                    Leave blank to generate a report for all properties
                  </Form.Text>
                </Form.Group>
              )}

              {documentType === 'insuranceReport' && (
                <>
                  <Form.Group className="mb-3">
                    <Form.Label>Select Property (Optional)</Form.Label>
                    <Form.Select 
                      value={selectedProperty}
                      onChange={handlePropertyChange}
                    >
                      <option value="">All Properties</option>
                      {properties.map(property => (
                        <option key={property.id} value={property.id}>{property.name}</option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Select Insurance (Optional)</Form.Label>
                    <Form.Select 
                      value={selectedInsurance}
                      onChange={handleInsuranceChange}
                      disabled={selectedProperty !== ''}
                    >
                      <option value="">All Insurances</option>
                      {insurances
                        .filter(insurance => !selectedProperty || insurance.propertyId === parseInt(selectedProperty))
                        .map(insurance => (
                          <option key={insurance.id} value={insurance.id}>
                            {insurance.policyNumber} - {insurance.type}
                          </option>
                        ))}
                    </Form.Select>
                    <Form.Text className="text-muted">
                      {selectedProperty 
                        ? 'Select a specific insurance or leave blank for all insurances related to this property' 
                        : 'Leave blank to generate a report for all insurances'}
                    </Form.Text>
                  </Form.Group>
                </>
              )}

              {documentType === 'nomineeReport' && (
                <Form.Group className="mb-3">
                  <Form.Label>Select Nominee (Optional)</Form.Label>
                  <Form.Select 
                    value={selectedNominee}
                    onChange={handleNomineeChange}
                  >
                    <option value="">All Nominees</option>
                    {nominees.map(nominee => (
                      <option key={nominee.id} value={nominee.id}>{nominee.name}</option>
                    ))}
                  </Form.Select>
                  <Form.Text className="text-muted">
                    Leave blank to generate a report for all nominees
                  </Form.Text>
                </Form.Group>
              )}

              <div className="d-grid mt-4">
                <Button 
                  variant="primary" 
                  onClick={generateDocumentPreview}
                  disabled={generating}
                >
                  {generating ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                      Generating...
                    </>
                  ) : (
                    <>
                      <i className="fas fa-file-alt me-2"></i>
                      Generate Document
                    </>
                  )}
                </Button>
              </div>
            </Card.Body>
          </Card>

          {showPreview && (
            <Card className="mb-4">
              <Card.Header className="bg-success text-white">
                <h6 className="mb-0">Document Actions</h6>
              </Card.Header>
              <Card.Body>
                <div className="d-grid gap-2">
                  <Button 
                    variant="primary" 
                    onClick={handlePrintDocument}
                  >
                    <i className="fas fa-print me-2"></i>
                    Print Document
                  </Button>
                  <Button 
                    variant="secondary" 
                    onClick={handleDownloadPDF}
                  >
                    <i className="fas fa-download me-2"></i>
                    Download as PDF
                  </Button>
                </div>
              </Card.Body>
            </Card>
          )}
        </Col>

        {showPreview && (
          <Col lg={8}>
            <Card className="mb-4">
              <Card.Header className="bg-primary text-white">
                <h6 className="mb-0">Document Preview</h6>
              </Card.Header>
              <Card.Body>
                <div 
                  id="document-preview" 
                  className="document-preview p-4 bg-white"
                  style={{ minHeight: '500px' }}
                >
                  {renderDocumentPreview()}
                </div>
              </Card.Body>
            </Card>
          </Col>
        )}
      </Row>
    </div>
  );
};

export default DocumentGenerator; 