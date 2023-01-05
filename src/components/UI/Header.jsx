import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import Button from 'react-bootstrap/Button';

function Header() {
  return (
    <Navbar className='bg-secondary mb-4'>
      <Container>
        <Navbar.Brand href='#home'>Chattis</Navbar.Brand>
        <Navbar.Toggle />
        <Navbar.Collapse className='justify-content-end'>
          <Navbar.Text className='mx-3'>
            Signed in as: <a href='#login'>PPC</a>
          </Navbar.Text>
        </Navbar.Collapse>
        <Button variant='light'>Log Out</Button>
      </Container>
    </Navbar>
  );
}

export default Header;
