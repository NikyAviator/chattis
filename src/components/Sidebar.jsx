import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { ListGroup } from 'react-bootstrap';

const Sidebar = () => {
  const [rooms, setRooms] = useState([]);
  const [membersList, setMembersList] = useState([]);

  // useEffect(() => {
  //   // fetch the rooms first
  //   fetch('/api/chats')
  //     .then((response) => response.json())
  //     .then((rooms) => setRooms(rooms.result));
  //   // fetch the members
  //   fetch('/api/chat/users')
  //     .then((response) => response.json())
  //     .then((membersList) => setMembersList(membersList));
  // }, []);

  useEffect(() => {
    axios.get('/api/chats').then((res) => {
      console.log(res.data.result);
      setRooms(res.data.result);
    });
  }, []);

  return (
    <>
      <h3>Available rooms:</h3>
      <ListGroup>
        {rooms.map((room, index) => (
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
