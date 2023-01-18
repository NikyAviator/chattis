import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import axios from 'axios';
import { useState } from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';

function Signup() {
  const [username, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [validPassword, setValidPassword] = useState(false);

  const validatePassword = (e) => {
    const regex = /^(?=.*[\d!#$%&? "])(?=.*[A-Z])[a-zA-Z0-9!#$%&?]{8,}/;
    console.log(e.target.value);
    if (e.target?.value && e.target.value.match(regex)) {
      setValidPassword(true);
      setPassword(e.target.value);
    } else {
      setValidPassword(false);
      setPassword(e.target.value);
    }
  };

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
    alert('Account registered!');
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
                  <Form.Label>
                    ( Min 8 chars, Capitalize one letter and min one
                    number/special char)
                  </Form.Label>
                  <Form.Control type='text' placeholder='Password' />
                </Form.Group>
                <Form.Group onChange={validatePassword} className='mb-3'>
                  <Form.Label>Retype your password:</Form.Label>
                  <Form.Control type='text' placeholder='Password' />
                </Form.Group>
                <Button
                  variant='primary'
                  type='submit'
                  className='mx-auto'
                  disabled={validPassword ? false : true}
                >
                  Register
                </Button>
                <div className='py-4'>
                  <p>
                    Already have an account?{' '}
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
