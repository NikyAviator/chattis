import React, { useEffect } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import Sidebar from '../components/Sidebar';
import MessageForm from '../components/MessageForm';
import { useState } from 'react';
import axios from 'axios';
const Chat = ({ setUserCallback }) => {
  const [selectedChat, setSelectedChat] = useState(null);
  const [user, setUser] = useState(null);

  const setChat = (chatvalue) => {
    setSelectedChat(chatvalue);
    console.log('hej');
  };

  useEffect(() => {
    const getUser = () => {
      axios
        .get('/api/fetch-user')
        .then((res) => {
          setUser(res.data.user);
          console.log(res.data.user);
        })
        .catch((err) => {
          console.log(err);
        });
    };
    getUser();
  }, []);

  useEffect(() => {
    console.log(selectedChat);
  }, [selectedChat]);

  console.log(setUserCallback);
  return (
    <Container>
      <Row>
        <Col md={4}>
          <Sidebar
            setUserCallback={setUserCallback}
            setSelectedChatCallback={setChat}
            selectedChat={selectedChat}
            userData={user}
          />
        </Col>
        <Col md={8}>
          {selectedChat && (
            <MessageForm
              selectedChat={selectedChat}
              setSelectedChatCallback={setSelectedChat}
              userData={user}
            />
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default Chat;
