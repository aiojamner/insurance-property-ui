import React, { useState } from 'react';
import { Card, Form, Button, Row, Col, Alert, InputGroup } from 'react-bootstrap';
import { FaFingerprint, FaUserAlt } from 'react-icons/fa';

const Login = ({ onLogin, onSwitchToRegister }) => {
  const [loginMethod, setLoginMethod] = useState('aadhaar');
  const [formData, setFormData] = useState({
    aadhaar: '',
    otp: '',
    email: '',
    password: ''
  });
  const [otpSent, setOtpSent] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleAadhaarSubmit = (e) => {
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

      // In a real app, you would verify the OTP with your backend
      setLoading(true);
      setTimeout(() => {
        setLoading(false);
        // Simulate successful login
        onLogin({
          name: 'Aadhaar User',
          aadhaar: formData.aadhaar.replace(/(\d{4})/g, '$1 ').trim()
        });
      }, 1500);
    }
  };

  const handleEmailPasswordSubmit = (e) => {
    e.preventDefault();
    
    // Validate email and password
    if (!formData.email) {
      setError('Please enter your email');
      return;
    }
    
    if (!formData.password) {
      setError('Please enter your password');
      return;
    }

    // In a real app, you would verify credentials with your backend
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      // Simulate successful login
      onLogin({
        name: formData.email.split('@')[0],
        email: formData.email
      });
    }, 1500);
  };

  return (
    <Row className="justify-content-center">
      <Col md={6}>
        <Card className="shadow">
          <Card.Header className="bg-primary text-white">
            <h4 className="mb-0">Login to Your Account</h4>
          </Card.Header>
          <Card.Body className="p-4">
            <div className="mb-4">
              <div className="btn-group w-100" role="group">
                <button
                  type="button"
                  className={`btn ${loginMethod === 'aadhaar' ? 'btn-primary' : 'btn-outline-primary'}`}
                  onClick={() => {
                    setLoginMethod('aadhaar');
                    setOtpSent(false);
                    setError('');
                  }}
                >
                  <FaFingerprint className="me-2" />
                  Aadhaar Login
                </button>
                <button
                  type="button"
                  className={`btn ${loginMethod === 'email' ? 'btn-primary' : 'btn-outline-primary'}`}
                  onClick={() => {
                    setLoginMethod('email');
                    setError('');
                  }}
                >
                  <FaUserAlt className="me-2" />
                  Email Login
                </button>
              </div>
            </div>

            {error && <Alert variant="danger">{error}</Alert>}

            {loginMethod === 'aadhaar' ? (
              <Form onSubmit={handleAadhaarSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label>Aadhaar Number</Form.Label>
                  <InputGroup>
                    <InputGroup.Text>
                      <FaFingerprint />
                    </InputGroup.Text>
                    <Form.Control
                      type="text"
                      placeholder="Enter your 12-digit Aadhaar number"
                      name="aadhaar"
                      value={formData.aadhaar}
                      onChange={handleChange}
                      maxLength={12}
                      disabled={otpSent}
                    />
                  </InputGroup>
                </Form.Group>

                {otpSent && (
                  <Form.Group className="mb-3">
                    <Form.Label>OTP</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Enter 6-digit OTP sent to your registered mobile"
                      name="otp"
                      value={formData.otp}
                      onChange={handleChange}
                      maxLength={6}
                    />
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
              <Form onSubmit={handleEmailPasswordSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label>Email Address</Form.Label>
                  <Form.Control
                    type="email"
                    placeholder="Enter your email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Password</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Enter your password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                  />
                </Form.Group>

                <div className="d-grid mt-4">
                  <Button variant="primary" type="submit" disabled={loading}>
                    {loading ? 'Processing...' : 'Login'}
                  </Button>
                </div>
              </Form>
            )}

            <div className="text-center mt-4">
              <p>
                Don't have an account?{' '}
                <Button variant="link" className="p-0" onClick={onSwitchToRegister}>
                  Register Now
                </Button>
              </p>
            </div>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );
};

export default Login; 