import axios from 'axios';
import React from 'react';
import { Button } from 'react-bootstrap';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { LinkContainer } from 'react-router-bootstrap';
import logo from '../../assets/chat-logo.jpg';
import { useNavigate } from 'react-router-dom';
function Navigation({ userData, setUserCallback }) {
  const navigate = useNavigate();

  const logOut = () => {
    axios.delete('/api/user/logout').then(() => {
      setUserCallback(null);
      navigate('/');
    });
  };

  return (
    <Navbar bg='light' expand='lg'>
      <Container>
        <LinkContainer to='/'>
          <Navbar.Brand>
            <img src={logo} style={{ width: 50, height: 50 }} />
          </Navbar.Brand>
        </LinkContainer>

        <Navbar.Toggle aria-controls='basic-navbar-nav' />
        <Navbar.Collapse id='basic-navbar-nav'>
          <Nav className='ms-auto'>
            <LinkContainer to='/chat'>
              <Nav.Link>Chat</Nav.Link>
            </LinkContainer>
            {console.log(userData)}
            {!userData ? (
              <LinkContainer to='/login'>
                <Nav.Link> Log in</Nav.Link>
              </LinkContainer>
            ) : (
              <Button
                onClick={() => {
                  logOut();
                }}
              >
                Log out, {userData.username}
              </Button>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default Navigation;
