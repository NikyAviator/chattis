import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import Sidebar from '../components/Sidebar';
import MessageForm from '../components/MessageForm';
const Chat = ({ setUserCallback }) => {
  console.log(setUserCallback);
  return (
    <Container>
      <Row>
        <Col md={4}>
          <Sidebar setUserCallback={setUserCallback} />
        </Col>
        <Col md={8}>
          <MessageForm />
        </Col>
      </Row>
    </Container>
  );
};

export default Chat;
