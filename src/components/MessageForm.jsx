import React from 'react';
import { Button, Form, Row, Col } from 'react-bootstrap';
import '../../scss/main.scss';
const MessageForm = () => {
  function handleSubmit(event) {
    event.preventDefault();
  }

  return (
    <>
      <div className='messages-output'></div>
      <Form onSubmit={handleSubmit}>
        <Row>
          <Col md={11}>
            <Form.Group>
              <Form.Control
                type='text'
                placeholder='Your message'
              ></Form.Control>
            </Form.Group>
          </Col>
          <Col md={1}>
            <Button variant='primary' type='submit'>
              <p>Skicka</p>
            </Button>
          </Col>
        </Row>
      </Form>
    </>
  );
};

export default MessageForm;
