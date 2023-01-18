import React, { useState, useEffect } from 'react';
import { Button, Form, Row, Col, Modal } from 'react-bootstrap';
import '../../scss/main.scss';
import axios from 'axios';
const MessageForm = ({ selectedChat, setSelectedChatCallback }) => {
  const [showInvitePeople, setShowInvitePeople] = useState(false);
  const [userList, setUserList] = useState([]);
  const [searchedUsername, setSearchedUsername] = useState('');

  function handleSubmit(event) {
    event.preventDefault();
  }
  console.log(selectedChat);

  useEffect(() => {
    const getUsers = () => {
      axios
        .get(
          `/api/user/search?username=${searchedUsername}&chatId=${selectedChat.chat_id}`
        )
        .then((res) => {
          setUserList(res.data.result);
        })
        .catch((err) => console.log(err));
    };
    getUsers();
  }, [searchedUsername]);

  return (
    <>
      <div>You are in chat: {selectedChat.subject}</div>
      <Button
        onClick={() => {
          setShowInvitePeople(true);
          axios
            .get('/api/get-all-users')
            .then((response) => {
              setUserList(response.data.result);
              console.log(response.data);
            })

            .catch((err) => console.log(err.message));
        }}
      >
        Invite people
      </Button>
      <Button>Block user</Button>
      <Button
        onClick={() => {
          setSelectedChatCallback(null);
        }}
      >
        Close chat
      </Button>
      <Modal show={showInvitePeople} backdrop='static' centered>
        <Modal.Header className='text-center'>
          <h2>Invite users</h2>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Control
                className='m-2'
                type='text'
                placeholder={'Find user...'}
                value={searchedUsername}
                onChange={(event) => setSearchedUsername(event.target.value)}
              />
            </Form.Group>
          </Form>
          {userList.length > 0 &&
            userList.map((user, id) => (
              <Row className='text-center align-items-center m-2' key={id}>
                <Col>{user.user_name}</Col>
                <Col>
                  <Button
                    onClick={(e) => {
                      axios
                        .post(
                          `api/chat/invite?chatId=${selectedChat.chat_id}&userId=${user.id}`
                        )
                        .then((response) => {
                          console.log(response.data);
                        })
                        .catch((error) => {
                          console.log(error);
                        });
                      e.target.disabled = true;
                      e.target.textContent = '✔️';
                      e.target.style.backgroundColor = 'green';
                    }}
                  >
                    Invite
                  </Button>{' '}
                </Col>
              </Row>
            ))}
        </Modal.Body>
        <Modal.Footer>
          <Button variant='primary' onClick={() => setShowInvitePeople(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

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
