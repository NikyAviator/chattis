import React, { useState } from 'react';
import RegisterForm from '../UI/RegisterForm';
import LogInForm from '../UI/LogInForm';
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
const HomePage = () => {
  const [showLogInForm, setShowLogInForm] = useState(true);
  const [showRegisterForm, setShowRegisterForm] = useState(false);

  return (
    <Container>
      <Card className='p-3'>
        <Row>
          <Col>
            <h1>Welcome to Chattis!</h1>
            <Button
              variant='secondary'
              onClick={() => {
                setShowLogInForm(false);
                setShowRegisterForm(true);
              }}
            >
              Resgister
            </Button>
            <Button
              variant='secondary'
              onClick={() => {
                setShowLogInForm(true);
                setShowRegisterForm(false);
              }}
            >
              Login
            </Button>
          </Col>
        </Row>
        <Row>
          <Col>{showLogInForm ? <LogInForm /> : <RegisterForm />}</Col>
        </Row>
      </Card>
    </Container>
  );
};

export default HomePage;
