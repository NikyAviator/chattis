import React from 'react';
import { Row, Col, Button } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import '../../scss/main.scss';

function Home() {
  return (
    <Row>
      <Col
        md={6}
        className='d-flex flex-direction-column align-items-center justify-content-center'
      >
        <div>
          <h1>Productivity, Positivity & Community</h1>
          <p>Chattis lets you connect with the world, PPC!</p>
          <LinkContainer to='/login'>
            <Button variant='primary'>Get Started</Button>
          </LinkContainer>
        </div>
      </Col>
      <Col md={6} className='home__bg'></Col>
    </Row>
  );
}

export default Home;
