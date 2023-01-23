import React, { useState, useEffect } from 'react';
import { Button, Form, Row, Col, Modal, Card } from 'react-bootstrap';
import '../../scss/main.scss';
import axios from 'axios';
let sse;
const MessageForm = ({ selectedChat, setSelectedChatCallback, userData }) => {
  const [showInvitePeople, setShowInvitePeople] = useState(false);
  const [userList, setUserList] = useState([]);
  const [searchedUsername, setSearchedUsername] = useState('');
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [toggleBlock, setToggleBlock] = useState(false);

  const startSSE = () => {
    // workaround for being called twice in React.StrictMode
    // close the old sse connection if it exists...
    sse && sse.close();

    sse = new EventSource(`/api/sse?chatId=${selectedChat.chat_id}`, {
      withCredentials: true,
    });

    sse.addEventListener('connect', (message) => {
      let data = JSON.parse(message.data);
      data.chatData = selectedChat;
      console.log('[connect]', data);
    });

    sse.addEventListener('disconnect', (message) => {
      let data = JSON.parse(message.data);
      console.log('[disconnect]', data);
      sse.close();
    });

    sse.addEventListener('new-message', (message) => {
      let data = JSON.parse(message.data);
      data.chatData = selectedChat;
      setMessages((messages) => [...messages, data]);
      console.log(messages);
      setMessage('');
    });
  };
  // render and get the chats written for each room
  const getChatMessages = async (chat_id) => {
    await axios
      .get(`/api/chat/messages/${chat_id}`)
      .then((res) => {
        setMessages(res.data.result);
        console.log(res.data.result);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    startSSE();
    getChatMessages(selectedChat.chat_id);
    //}, [messages]);
  }, []);

  // handles the send message
  async function handleSubmit(event) {
    event.preventDefault();
    await axios
      .post('/api/chat/message', {
        chatId: selectedChat.chat_id,
        content: userData.userRole === 'admin' ? message + ` //ADMIN` : message,
        from: userData.username,
        fromId: userData.id,
      })
      .then((res) => {
        console.log(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
    getChatMessages(selectedChat.chat_id);
  }

  // search for users to invite in the chat
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

  useEffect(() => {
    let scroll_to_bottom = document.querySelector('.messages-output');
    scroll_to_bottom.scrollTop = scroll_to_bottom.scrollHeight;
  }, [messages]);

  return (
    <>
      <Modal show={toggleBlock} backdrop='static' centered>
        <Modal.Header className='text-center'>
          <h2>Edit chat</h2>
        </Modal.Header>
        <Modal.Body>
          {userList.length > 0 &&
            userList.map((user, id) => (
              <Row className='text-center align-items-center m-2' key={id}>
                <Col>{user.user_name}</Col>
                <Col>
                  <Button
                    variant={!user.blocked ? 'success' : 'danger'}
                    onClick={(e) => {
                      axios
                        .put(
                          `api/chat/ban?chatId=${selectedChat.chat_id}&userId=${user.id}`
                        )
                        .then((response) => {
                          console.log(response.data);
                        })
                        .catch((error) => {
                          console.log(error);
                        });

                      /* e.target.disabled = true */
                      e.target.textContent = '✔️';
                      e.target.style.backgroundColor = 'blue';
                    }}
                  >
                    {!user.blocked ? '🏴 Ban' : '🏳️ Unban'}
                  </Button>
                </Col>
              </Row>
            ))}
        </Modal.Body>
        <Modal.Footer>
          <Button className='bg-success' onClick={() => setToggleBlock(false)}>
            🚫 Close
          </Button>
        </Modal.Footer>
      </Modal>
      <div>You are in chat: {selectedChat.subject}</div>
      {((userData && selectedChat && userData.id === selectedChat.created_by) ||
        userData.userRole === 'admin') && (
        <>
          <Button
            onClick={() => {
              setShowInvitePeople(true);
              axios
                .get(
                  `/api/user/search?username=${searchedUsername}&chatId=${selectedChat.chat_id}`
                )
                .then((response) => {
                  setUserList(response.data.result);
                })

                .catch((err) => console.log(err.message));
            }}
          >
            Invite people
          </Button>
          <Button
            onClick={() => {
              setToggleBlock(true);
              axios
                .get('/api/chat/users', {
                  params: { chatId: selectedChat.chat_id },
                })
                .then((response) => {
                  setUserList(response.data.result);
                })
                .catch((err) => {
                  console.log(err);
                });
            }}
          >
            Block user
          </Button>
        </>
      )}
      <Button
        variant='danger'
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

      <div className='messages-output'>
        {messages.length > 0 &&
          messages.map((message, id) => (
            <Col key={id}>
              <Card
                className={
                  message.fromId === userData.id
                    ? 'messageMine my-1 px-1'
                    : 'messageOther my-1 px-1'
                }
              >
                <Col>
                  {message.from}
                  {userData.userRole === 'admin' && (
                    <Button
                      onClick={async () => {
                        await axios
                          .delete(`/api/chat/delete-message/${message.id}`)
                          .then((res) => console.log(res))
                          .catch((err) => console.log(err));
                        getChatMessages(selectedChat.chat_id);
                      }}
                      className='mx-3'
                      variant='danger'
                    >
                      delete
                    </Button>
                  )}
                </Col>
                <Col>
                  @ ⏲{' '}
                  {new Date(message.timestamp)
                    .toISOString()
                    .slice(0, 16)
                    .split('T')
                    .join(' ')}
                </Col>
                <Col>{message.content}</Col>
              </Card>
            </Col>
          ))}
      </div>
      <Form onSubmit={handleSubmit}>
        <Row>
          <Col md={11}>
            <Form.Group>
              <Form.Control
                type='text'
                placeholder='Your message'
                onChange={(e) => {
                  setMessage(e.target.value);
                }}
                value={message}
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
