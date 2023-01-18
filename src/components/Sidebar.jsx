import axios from 'axios';
import { Button, Modal, Row, Col } from 'react-bootstrap';
import React, { useState, useEffect } from 'react';
import { ListGroup } from 'react-bootstrap';
import CreateChat from './CreateChat';

const Sidebar = ({ setUserCallback, setSelectedChatCallback }) => {
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
      console.log(res.data.result);
      setRooms(res.data.result);
    });
  };
  // Get all the available rooms and users
  useEffect(() => {
    const getAllUsers = async () => {
      await axios.get('/api/get-all-users').then((res) => {
        console.log(res.data.result);
        setMembersList(res.data.result);
      });
    };
    getChats();
    getAllUsers();
  }, []);

  return (
    <>
      <h3>Available rooms:</h3>
      <Button
        onClick={() => {
          setCreateChat(!createChat);
        }}
      >
        Create Chat
      </Button>
      <Button
        onClick={() => {
          setShowChatInvitations(true);
        }}
        disabled={chatInvitation.length == 0 ? true : false}
      >
        Pending Invites: {chatInvitation.length}
      </Button>
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
                  {console.log(chat)}
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
      <ListGroup>
        {rooms.length > 0 &&
          rooms.map((room, index) => (
            <ListGroup.Item
              action
              variant='light'
              key={index}
              onClick={() => setSelectedChatCallback(room)}
            >
              {room.subject}
            </ListGroup.Item>
          ))}
      </ListGroup>
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
