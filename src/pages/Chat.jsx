import React, { useEffect } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import Sidebar from '../components/Sidebar';
import MessageForm from '../components/MessageForm';
import { useState } from 'react';
const Chat = ({ setUserCallback }) => {
  const [selectedChat, setSelectedChat] = useState(null);

  const setChat = (chatvalue) => {
    setSelectedChat(chatvalue);
    console.log('hej');
  };

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
          />
        </Col>
        <Col md={8}>
          {selectedChat && (
            <MessageForm
              selectedChat={selectedChat}
              setSelectedChatCallback={setSelectedChat}
            />
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default Chat;
