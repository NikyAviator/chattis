import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import Button from 'react-bootstrap/Button';
import { useEffect, useState } from 'react';
import axios from 'axios';
function Header() {
  const [loginUser, setLoginUser] = useState('Not signed in!');

  useEffect(() => {
    axios.get('/api/user/login').then((response) => {
      setLoginUser(response.data.user.user_name);
    });
  }, [loginUser]);

  function logOut() {
    axios.delete('/api/user/logout').then((response) => {
      console.log('logged out!', response);
    });
  }

  return (
    <Navbar className='bg-secondary mb-4'>
      <Container>
        <Navbar.Brand href='#home'>Chattis</Navbar.Brand>
        <Navbar.Toggle />
        <Navbar.Collapse className='justify-content-end'>
          <Navbar.Text className='mx-3'>
            Signed in as: <a href='#login'>{loginUser}</a>
          </Navbar.Text>
        </Navbar.Collapse>
        <Button onClick={logOut} variant='light'>
          Log Out
        </Button>
      </Container>
    </Navbar>
  );
}

export default Header;
