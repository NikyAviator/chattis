import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import axios from 'axios';
import { useState } from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import CheckPasswordLength from '../components/CheckPasswordLength';
function Signup() {
  const [username, setUserName] = useState('');
  const [password, setPassword] = useState('');

  function onSubmitRegister(event) {
    event.preventDefault();
    axios
      .post('/api/user/register', {
        username: username,
        password: password,
      })
      .then((response) => {
        console.log(response);
      });
    setUserName('');
    setPassword('');
  }

  return (
    <>
      <Container>
        <Card className='p-4'>
          <Row>
            <Col md={6}>
              <h2>Sign up:</h2>
              <Form onSubmit={onSubmitRegister}>
                <Form.Group className='mb-3'>
                  <Form.Label>Register your username: </Form.Label>
                  <Form.Control
                    onChange={(event) => {
                      setUserName(event.target.value);
                    }}
                    type='text'
                    placeholder='username'
                  />
                </Form.Group>
                <Form.Group
                  onChange={(event) => {
                    setPassword(event.target.value);
                  }}
                  className='mb-3'
                >
                  <Form.Label>Password:</Form.Label>
                  <Form.Control type='password' placeholder='Password' />
                </Form.Group>
                <Button variant='primary' type='submit' className='mx-auto'>
                  Register
                </Button>
                <div className='py-4'>
                  <p>
                    Already have an account?
                    <Link to='/login'> Log in here</Link>
                  </p>
                </div>
              </Form>
            </Col>
          </Row>
        </Card>
      </Container>
    </>
  );
}

export default Signup;
