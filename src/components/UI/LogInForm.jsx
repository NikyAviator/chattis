import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

function LogInForm() {
  return (
    <>
      <h2>Login:</h2>
      <Form>
        <Form.Group className='mb-3' controlId='formBasicEmail'>
          <Form.Label>Enter User Name</Form.Label>
          <Form.Control type='text' placeholder='Enter email' />
        </Form.Group>
        <Form.Group className='mb-3' controlId='formBasicPassword'>
          <Form.Label>Password</Form.Label>
          <Form.Control type='password' placeholder='Password' />
        </Form.Group>
        <Button variant='primary' type='submit'>
          Login
        </Button>
      </Form>
    </>
  );
}

export default LogInForm;
