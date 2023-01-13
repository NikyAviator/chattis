import React, { useState, useEffect } from 'react';
import { ListGroup } from 'react-bootstrap';

const Sidebar = () => {
  const [rooms, setRooms] = useState([]);
  const [membersList, setMembersList] = useState([]);

  useEffect(() => {
    // fetch the rooms first
    fetch('/api/chats')
      .then((response) => response.json())
      .then((rooms) => setRooms(rooms));
    // fetch the members
    fetch('/api/chat/users')
      .then((response) => response.json())
      .then((membersList) => setMembersList(membersList));
  }, []);

  return (
    <>
      <h3>Available rooms:</h3>
      <ListGroup>
        {rooms.map((room, index) => (
          <ListGroup.Item action variant='light' key={index}>
            {room}
          </ListGroup.Item>
        ))}
      </ListGroup>
      <h3>Members:</h3>
      <ListGroup>
        {membersList.map((members, index) => (
          <ListGroup.Item action variant='light' key={index}>
            {members}
          </ListGroup.Item>
        ))}
      </ListGroup>
    </>
  );
};

export default Sidebar;
