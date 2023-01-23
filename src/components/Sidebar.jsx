import axios from 'axios';
import { Button, Modal, Row, Col, Container } from 'react-bootstrap';
import React, { useState, useEffect } from 'react';
import { ListGroup } from 'react-bootstrap';
import CreateChat from './CreateChat';

const Sidebar = ({
  setUserCallback,
  setSelectedChatCallback,
  selectedChat,
  userData,
}) => {
  const [rooms, setRooms] = useState([]);
  const [membersList, setMembersList] = useState([]);
  const [createChat, setCreateChat] = useState(false);
  const [chatInvitation, setChatinvitation] = useState([]);
  const [showChatInvitations, setShowChatInvitations] = useState(false);

  const getChatInvitations = () => {
    axios
      .get('/api/chat/invites')
      .then((res) => {
        console.log(res.data.result);
        setChatinvitation(res.data.result);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  useEffect(() => {
    getChatInvitations();
  }, []);

  const getChats = async () => {
    await axios.get('/api/chats').then((res) => {
      setRooms(res.data.result);
    });
  };
  // Get all the available rooms and users
  useEffect(() => {
    const getAllUsers = async () => {
      await axios.get('/api/get-all-users').then((res) => {
        setMembersList(res.data.result);
      });
    };
    getChats();
    getAllUsers();
  }, []);

  const sortByChatsByName = () => {
    let sortedChats = rooms.sort((a, b) => {
      const chatSubjectA = a.subject.toUpperCase();
      const chatSubjectB = b.subject.toUpperCase();
      if (chatSubjectA < chatSubjectB) {
        return -1;
      }
      if (chatSubjectA > chatSubjectB) {
        return 1;
      }
      return 0;
    });
    setRooms([]);
    setRooms([...sortedChats]);
  };
  const sortChatsByLatestMessage = () => {
    let sortedChats = rooms.sort((a, b) => {
      const msgTimestampA = new Date(a.last_message_timestamp);
      const msgTimestampB = new Date(b.last_message_timestamp);
      if (msgTimestampA > msgTimestampB) {
        return -1;
      }
      if (msgTimestampA < msgTimestampB) {
        return 1;
      }
      return 0;
    });
    setRooms([]);
    setRooms([...sortedChats]);
  };

  const sortChatsByUsersLatestMessage = () => {
    let sortedChats = rooms.sort((a, b) => {
      const msgTimestampA = new Date(a.user_latest_message_timestamp);
      const msgTimestampB = new Date(b.user_latest_message_timestamp);
      if (msgTimestampA > msgTimestampB) {
        return -1;
      }
      if (msgTimestampA < msgTimestampB) {
        return 1;
      }
      return 0;
    });
    setRooms([]);
    setRooms([...sortedChats]);
  };

  return (
    <>
      <Container>
        <Row>
          <Col xs='5'>
            <Button
              onClick={() => {
                setCreateChat(!createChat);
              }}
            >
              Create Chat
            </Button>
          </Col>
          <Col xs='6'>
            <Button
              onClick={() => {
                setShowChatInvitations(true);
              }}
              disabled={chatInvitation.length === 0 ? true : false}
            >
              Pending Invites: {chatInvitation.length}
            </Button>
          </Col>
        </Row>
        <Row>
          <Col className='my-1 mb-0'>
            <p>Sort rooms by:</p>
          </Col>
        </Row>
        <Row>
          <Col>
            <Button
              onClick={() => {
                sortByChatsByName();
              }}
              variant='primary'
            >
              Name
            </Button>
          </Col>
          <Col>
            <Button
              onClick={() => {
                sortChatsByLatestMessage();
              }}
            >
              latest message
            </Button>
          </Col>
          <Col>
            <Button
              onClick={() => {
                sortChatsByUsersLatestMessage();
              }}
            >
              my last messages
            </Button>
          </Col>
        </Row>
      </Container>
      <h3>Available rooms:</h3>

      {showChatInvitations && (
        <Modal show={showChatInvitations}>
          <Modal.Header className='text-center'>
            <h2>Chat Invitations</h2>
          </Modal.Header>
          <Modal.Body>
            {chatInvitation.length > 0 &&
              chatInvitation.map((chat, id) => (
                <Row className='text-center align-items-center m-2' key={id}>
                  <Col>{chat.subject}</Col>
                  <Col>
                    <Button
                      variant='success'
                      onClick={async (e) => {
                        axios
                          .put(`api/chat/accept-invite/${chat.id}`)
                          .then((res) => {
                            console.log('success', res.data);
                          })
                          .catch((err) => console.log(err));
                        e.target.disabled = true;
                        e.target.textContent = '✅';
                        e.target.style.backgroundColor = 'green';
                      }}
                    >
                      Join
                    </Button>
                  </Col>
                </Row>
              ))}
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant='primary'
              onClick={() => {
                getChatInvitations();
                setShowChatInvitations(false);
                getChats();
              }}
            >
              🚫 Close
            </Button>
          </Modal.Footer>
        </Modal>
      )}
      {createChat && <CreateChat setChatCallback={setRooms} />}
      {!selectedChat &&
        rooms.length > 0 &&
        rooms.map((room, index) => (
          <Row className='my-3' key={index}>
            <Col xs='4'>
              <Button
                disabled={room.blocked ? true : false}
                variant={room.blocked ? 'danger' : 'secondary'}
                onClick={() => setSelectedChatCallback(room)}
              >
                {room.subject}
                {room.created_by === userData?.id && <p>👮</p>}
              </Button>
            </Col>
          </Row>
        ))}

      <h3>All Registered Chattis users:</h3>
      <ListGroup>
        {membersList.map((members, index) => (
          <ListGroup.Item action variant='light' key={index}>
            {members.user_name}
          </ListGroup.Item>
        ))}
      </ListGroup>
    </>
  );
};

export default Sidebar;
