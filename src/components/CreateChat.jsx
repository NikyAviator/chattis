import React from 'react';
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import axios from 'axios';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
const CreateChat = ({ setUserCallback, setChatCallback }) => {
  const [subject, setSubject] = useState('');
  const navigate = useNavigate();

  async function onSumbitCreateChat(event) {
    event.preventDefault();
    console.log('ppc');
    await axios
      .post('/api/chat/create', {
        subject: subject,
      })
      .catch((error) => {
        console.log(error);
        return;
      });
    await axios.get('/api/chats').then((res) => {
      console.log(res.data.result);
      setChatCallback(res.data.result);
    });
    setSubject('');

    navigate('/chat');
  }
  return (
    <>
      <Container>
        <Card>
          <Row>
            <Col>
              <h5>Subject:</h5>
              <Form>
                <Form.Group className='mb-3' controlId='formBasicEmail'>
                  <Form.Control
                    value={subject}
                    onChange={(event) => {
                      setSubject(event.target.value);
                    }}
                    type='text'
                    placeholder='Enter subject for chat'
                  />
                </Form.Group>
              </Form>
              <Button
                variant='primary'
                type='submit'
                onClick={onSumbitCreateChat}
              >
                Create chat
              </Button>
            </Col>
          </Row>
        </Card>
      </Container>
    </>
  );
};

export default CreateChat;
