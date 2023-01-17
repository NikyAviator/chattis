import axios from 'axios';
import { Button } from 'react-bootstrap';
import React, { useState, useEffect } from 'react';
import { ListGroup } from 'react-bootstrap';
import CreateChat from './CreateChat';

const Sidebar = ({ setUserCallback }) => {
  const [rooms, setRooms] = useState([]);
  const [membersList, setMembersList] = useState([]);
  const [createChat, setCreateChat] = useState(false);

  // Get all the available rooms and users
  useEffect(() => {
    const getChats = async () => {
      await axios.get('/api/chats').then((res) => {
        console.log(res.data.result);
        setRooms(res.data.result);
      });
    };
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
      {createChat && <CreateChat />}
      <ListGroup>
        {rooms.length > 0 &&
          rooms.map((room, index) => (
            <ListGroup.Item action variant='light' key={index}>
              {room.subject}
            </ListGroup.Item>
          ))}
      </ListGroup>
      <h3>Members:</h3>
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
