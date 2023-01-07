import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import axios from 'axios';
import { useState } from 'react';
function RegisterForm() {
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
      <h2>Register:</h2>
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
        <Button variant='primary' type='submit'>
          Register
        </Button>
      </Form>
    </>
  );
}

export default RegisterForm;
