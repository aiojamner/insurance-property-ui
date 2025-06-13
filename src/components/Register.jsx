import React, { useState } from 'react';
import { Card, Form, Button, Row, Col, Alert, InputGroup } from 'react-bootstrap';
import { FaFingerprint, FaUserAlt, FaIdCard, FaUser, FaEnvelope, FaPhone, FaLock } from 'react-icons/fa';

const Register = ({ onRegister, onSwitchToLogin }) => {
  const [registrationMethod, setRegistrationMethod] = useState('aadhaar');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    aadhaar: '',
    otp: ''
  });
  const [otpSent, setOtpSent] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleAadhaarVerification = (e) => {
    e.preventDefault();
    
    // Validate Aadhaar number
    if (!formData.aadhaar || formData.aadhaar.length !== 12 || !/^\d+$/.test(formData.aadhaar)) {
      setError('Please enter a valid 12-digit Aadhaar number');
      return;
    }

    if (!otpSent) {
      // In a real app, you would make an API call to request OTP
      setLoading(true);
      setTimeout(() => {
        setLoading(false);
        setOtpSent(true);
        setError('');
      }, 1500);
    } else {
      // Validate OTP
      if (!formData.otp || formData.otp.length !== 6 || !/^\d+$/.test(formData.otp)) {
        setError('Please enter a valid 6-digit OTP');
        return;
      }

      // In a real app, you would verify the OTP with your backend and proceed with registration
      setLoading(true);
      setTimeout(() => {
        setLoading(false);
        
        // Simulate fetching user data from Aadhaar
        const aadhaarUserData = {
          name: 'John Doe', // This would come from the Aadhaar database
          phone: '9876543210', // This would come from the Aadhaar database
          email: '', // User will need to provide this
          aadhaar: formData.aadhaar.replace(/(\d{4})/g, '$1 ').trim()
        };
        
        setFormData({
          ...formData,
          name: aadhaarUserData.name,
          phone: aadhaarUserData.phone
        });
        
        // Move to step 2 of registration
        setRegistrationMethod('complete-profile');
      }, 1500);
    }
  };

  const handleCompleteRegistration = (e) => {
    e.preventDefault();
    
    // Validate the rest of the form
    if (!formData.email) {
      setError('Please enter your email address');
      return;
    }
    
    if (!formData.password) {
      setError('Please enter a password');
      return;
    }
    
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    // Submit registration
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onRegister({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        aadhaar: formData.aadhaar.replace(/(\d{4})/g, '$1 ').trim()
      });
    }, 1500);
  };

  const handleEmailRegistration = (e) => {
    e.preventDefault();
    
    // Validate all fields
    if (!formData.name) {
      setError('Please enter your name');
      return;
    }
    
    if (!formData.email) {
      setError('Please enter your email address');
      return;
    }
    
    if (!formData.phone) {
      setError('Please enter your phone number');
      return;
    }
    
    if (!formData.password) {
      setError('Please enter a password');
      return;
    }
    
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    // Submit registration
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onRegister({
        name: formData.name,
        email: formData.email,
        phone: formData.phone
      });
    }, 1500);
  };

  return (
    <Row className="justify-content-center">
      <Col md={6}>
        <Card className="shadow">
          <Card.Header className="bg-primary text-white">
            <h4 className="mb-0">Create an Account</h4>
          </Card.Header>
          <Card.Body className="p-4">
            {registrationMethod === 'complete-profile' ? (
              <>
                <div className="alert alert-success">
                  <FaFingerprint className="me-2" />
                  Your Aadhaar has been verified successfully! Please complete your profile.
                </div>
                
                {error && <Alert variant="danger">{error}</Alert>}
                
                <Form onSubmit={handleCompleteRegistration}>
                  <Form.Group className="mb-3">
                    <Form.Label>Full Name (from Aadhaar)</Form.Label>
                    <InputGroup>
                      <InputGroup.Text>
                        <FaUser />
                      </InputGroup.Text>
                      <Form.Control
                        type="text"
                        value={formData.name}
                        disabled
                      />
                    </InputGroup>
                  </Form.Group>
                  
                  <Form.Group className="mb-3">
                    <Form.Label>Phone Number (from Aadhaar)</Form.Label>
                    <InputGroup>
                      <InputGroup.Text>
                        <FaPhone />
                      </InputGroup.Text>
                      <Form.Control
                        type="text"
                        value={formData.phone}
                        disabled
                      />
                    </InputGroup>
                  </Form.Group>
                  
                  <Form.Group className="mb-3">
                    <Form.Label>Email Address</Form.Label>
                    <InputGroup>
                      <InputGroup.Text>
                        <FaEnvelope />
                      </InputGroup.Text>
                      <Form.Control
                        type="email"
                        placeholder="Enter your email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                      />
                    </InputGroup>
                  </Form.Group>
                  
                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Password</Form.Label>
                        <InputGroup>
                          <InputGroup.Text>
                            <FaLock />
                          </InputGroup.Text>
                          <Form.Control
                            type="password"
                            placeholder="Create a password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                          />
                        </InputGroup>
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Confirm Password</Form.Label>
                        <InputGroup>
                          <InputGroup.Text>
                            <FaLock />
                          </InputGroup.Text>
                          <Form.Control
                            type="password"
                            placeholder="Confirm password"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            required
                          />
                        </InputGroup>
                      </Form.Group>
                    </Col>
                  </Row>
                  
                  <div className="d-grid mt-4">
                    <Button variant="primary" type="submit" disabled={loading}>
                      {loading ? 'Processing...' : 'Complete Registration'}
                    </Button>
                  </div>
                </Form>
              </>
            ) : (
              <>
                <div className="mb-4">
                  <div className="btn-group w-100" role="group">
                    <button
                      type="button"
                      className={`btn ${registrationMethod === 'aadhaar' ? 'btn-primary' : 'btn-outline-primary'}`}
                      onClick={() => {
                        setRegistrationMethod('aadhaar');
                        setOtpSent(false);
                        setError('');
                      }}
                    >
                      <FaFingerprint className="me-2" />
                      Aadhaar Verification
                    </button>
                    <button
                      type="button"
                      className={`btn ${registrationMethod === 'email' ? 'btn-primary' : 'btn-outline-primary'}`}
                      onClick={() => {
                        setRegistrationMethod('email');
                        setError('');
                      }}
                    >
                      <FaUserAlt className="me-2" />
                      Email Registration
                    </button>
                  </div>
                </div>

                {error && <Alert variant="danger">{error}</Alert>}

                {registrationMethod === 'aadhaar' ? (
                  <Form onSubmit={handleAadhaarVerification}>
                    <Form.Group className="mb-3">
                      <Form.Label>Aadhaar Number</Form.Label>
                      <InputGroup>
                        <InputGroup.Text>
                          <FaIdCard />
                        </InputGroup.Text>
                        <Form.Control
                          type="text"
                          placeholder="Enter your 12-digit Aadhaar number"
                          name="aadhaar"
                          value={formData.aadhaar}
                          onChange={handleChange}
                          maxLength={12}
                          disabled={otpSent}
                          required
                        />
                      </InputGroup>
                      <Form.Text className="text-muted">
                        We'll use your Aadhaar to verify your identity. Your information is secure.
                      </Form.Text>
                    </Form.Group>

                    {otpSent && (
                      <Form.Group className="mb-3">
                        <Form.Label>OTP</Form.Label>
                        <InputGroup>
                          <InputGroup.Text>
                            <FaFingerprint />
                          </InputGroup.Text>
                          <Form.Control
                            type="text"
                            placeholder="Enter 6-digit OTP sent to your registered mobile"
                            name="otp"
                            value={formData.otp}
                            onChange={handleChange}
                            maxLength={6}
                            required
                          />
                        </InputGroup>
                        <Form.Text className="text-muted">
                          A one-time password has been sent to your registered mobile number.
                        </Form.Text>
                      </Form.Group>
                    )}

                    <div className="d-grid mt-4">
                      <Button variant="primary" type="submit" disabled={loading}>
                        {loading ? 'Processing...' : otpSent ? 'Verify OTP' : 'Send OTP'}
                      </Button>
                    </div>
                  </Form>
                ) : (
                  <Form onSubmit={handleEmailRegistration}>
                    <Form.Group className="mb-3">
                      <Form.Label>Full Name</Form.Label>
                      <InputGroup>
                        <InputGroup.Text>
                          <FaUser />
                        </InputGroup.Text>
                        <Form.Control
                          type="text"
                          placeholder="Enter your full name"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          required
                        />
                      </InputGroup>
                    </Form.Group>

                    <Row>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Email Address</Form.Label>
                          <InputGroup>
                            <InputGroup.Text>
                              <FaEnvelope />
                            </InputGroup.Text>
                            <Form.Control
                              type="email"
                              placeholder="Enter your email"
                              name="email"
                              value={formData.email}
                              onChange={handleChange}
                              required
                            />
                          </InputGroup>
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Phone Number</Form.Label>
                          <InputGroup>
                            <InputGroup.Text>
                              <FaPhone />
                            </InputGroup.Text>
                            <Form.Control
                              type="tel"
                              placeholder="Enter your phone"
                              name="phone"
                              value={formData.phone}
                              onChange={handleChange}
                              required
                            />
                          </InputGroup>
                        </Form.Group>
                      </Col>
                    </Row>

                    <Row>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Password</Form.Label>
                          <InputGroup>
                            <InputGroup.Text>
                              <FaLock />
                            </InputGroup.Text>
                            <Form.Control
                              type="password"
                              placeholder="Create a password"
                              name="password"
                              value={formData.password}
                              onChange={handleChange}
                              required
                            />
                          </InputGroup>
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Confirm Password</Form.Label>
                          <InputGroup>
                            <InputGroup.Text>
                              <FaLock />
                            </InputGroup.Text>
                            <Form.Control
                              type="password"
                              placeholder="Confirm password"
                              name="confirmPassword"
                              value={formData.confirmPassword}
                              onChange={handleChange}
                              required
                            />
                          </InputGroup>
                        </Form.Group>
                      </Col>
                    </Row>

                    <div className="d-grid mt-4">
                      <Button variant="primary" type="submit" disabled={loading}>
                        {loading ? 'Processing...' : 'Register'}
                      </Button>
                    </div>
                  </Form>
                )}
              </>
            )}

            <div className="text-center mt-4">
              <p>
                Already have an account?{' '}
                <Button variant="link" className="p-0" onClick={onSwitchToLogin}>
                  Login Now
                </Button>
              </p>
            </div>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );
};

export default Register; 