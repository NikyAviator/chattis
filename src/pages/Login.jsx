import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { Container, Row, Col, Card } from 'react-bootstrap';
import axios from 'axios';
import { useState } from 'react';
import { LinkContainer } from 'react-router-bootstrap';
function Login() {
  const [username, setUserName] = useState('');
  const [password, setPassword] = useState('');

  function onSubmitLoginForm(event) {
    event.preventDefault();
    axios
      .post('/api/user/login', {
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
              <h2>Login:</h2>
              <Form onSubmit={onSubmitLoginForm}>
                <Form.Group className='mb-3' controlId='formBasicEmail'>
                  <Form.Label>Log in with user name:</Form.Label>
                  <Form.Control
                    onChange={(event) => {
                      setUserName(event.target.value);
                    }}
                    type='text'
                    placeholder='Enter username'
                  />
                </Form.Group>
                <Form.Group className='mb-3'>
                  <Form.Label>Password</Form.Label>
                  <Form.Control
                    onChange={(event) => {
                      setPassword(event.target.value);
                    }}
                    className='mb-3'
                    type='password'
                    placeholder='Password'
                  />
                </Form.Group>
                <Button variant='primary' type='submit'>
                  Login
                </Button>
                <LinkContainer to='/signup'>
                  <Button variant='primary' className='mx-5'>
                    No account? Sign up here!
                  </Button>
                </LinkContainer>
              </Form>
            </Col>
          </Row>
        </Card>
      </Container>
    </>
  );
}

export default Login;
